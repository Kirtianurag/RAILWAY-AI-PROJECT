import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stationsPath = path.join(__dirname, "../Data/stations.json");
const trainsPath = path.join(__dirname, "../Data/trains.json");

const getStations = () => JSON.parse(fs.readFileSync(stationsPath, "utf-8"));
const getTrains = () => JSON.parse(fs.readFileSync(trainsPath, "utf-8"));

// Helper: Dynamically maps the train image based on the train name keywords
const getTrainImage = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("vande bharat")) {
    return "https://wallpapercave.com/wp/wp12183303.jpg";
  }
  if (lowerName.includes("rajdhani")) {
    return "https://static.india.com/wp-content/uploads/2017/09/rajdhani-train-1.jpg";
  }
  if (lowerName.includes("shatabdi")) {
    return "https://i0.wp.com/www.himachaltaxi.com/wp-content/uploads/2013/03/Shatabdi-Express-Chandigarh.jpg";
  }
  if (lowerName.includes("tejas")) {
    return "https://images.indianexpress.com/2017/05/nh21tejastrain759.jpg";
  }
  // Default for all other Express/Mail trains
  return "https://etedge-insights.com/wp-content/uploads/2025/12/LHB.jpg";
};

// Helper: Dynamically determines correct traveling classes and fares based on real Indian Railway rules
const getTrainClassesAndFares = (trainName, rawFare) => {
  const name = trainName.toLowerCase();

  // 1. Vande Bharat, Shatabdi, Tejas
  if (name.includes("vande bharat") || name.includes("shatabdi") || name.includes("tejas")) {
    const classes = ["CC", "EC"];
    let ccBase = 950;
    let ecBase = 1700;

    if (rawFare && typeof rawFare === "object") {
      ccBase = rawFare["CC"] || rawFare["SL"] * 2.2 || rawFare["3A"] * 0.8 || 950;
      ecBase = rawFare["EC"] || ccBase * 1.8 || 1700;
    }

    return {
      classes,
      fare: {
        "CC": Math.round(ccBase),
        "EC": Math.round(ecBase)
      }
    };
  }

  // 2. Rajdhani
  if (name.includes("rajdhani")) {
    const classes = ["3A", "2A", "1A"];
    let base3A = 1600;
    let base2A = 2300;
    let base1A = 3400;

    if (rawFare && typeof rawFare === "object") {
      base3A = rawFare["3A"] || rawFare["SL"] * 2.8 || 1600;
      base2A = rawFare["2A"] || base3A * 1.45 || 2300;
      base1A = rawFare["1A"] || base3A * 2.15 || 3400;
    }

    return {
      classes,
      fare: {
        "3A": Math.round(base3A),
        "2A": Math.round(base2A),
        "1A": Math.round(base1A)
      }
    };
  }

  // 3. Default Mail / Express / Superfast
  const classes = ["SL", "3A", "2A", "1A"];
  let baseSL = 450;
  let base3A = 1200;
  let base2A = 1700;
  let base1A = 2400;

  if (rawFare && typeof rawFare === "object") {
    baseSL = rawFare["SL"] || 450;
    base3A = rawFare["3A"] || baseSL * 2.6 || 1200;
    base2A = rawFare["2A"] || baseSL * 3.7 || 1700;
    base1A = rawFare["1A"] || baseSL * 5.3 || 2400;
  }

  return {
    classes,
    fare: {
      "SL": Math.round(baseSL),
      "3A": Math.round(base3A),
      "2A": Math.round(base2A),
      "1A": Math.round(base1A)
    }
  };
};

// 1. Search Stations (Autocomplete)
export const searchStations = (req, res) => {
  const { q } = req.query;
  const stations = getStations();

  if (!q) return res.json(stations.slice(0, 10)); // Top 10 by default

  const filtered = stations.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.code.toLowerCase().includes(q.toLowerCase())
  );

  res.json(filtered.slice(0, 10)); // Return top 10 matches
};

// 2. Get Recommended Trains (Random 6)
export const getRecommendedTrains = (req, res) => {
  const trains = getTrains();
  const shuffled = trains.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 6)); // Return 6 random trains
};

// 3. Search Trains between stations (Dynamic Gemini AI Integrated!)
export const searchTrainsBetweenStations = async (req, res) => {
  const { from, to } = req.query;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!from || !to) {
    return res.status(400).json({ error: "Source and destination stations are required" });
  }

  const cleanFrom = from.trim().toLowerCase();
  const cleanTo = to.trim().toLowerCase();

  // 1. Smart Heuristic Validator to catch keyboard mashing instantly (saves Gemini Quota!)
  const isGibberish = (str) => {
    const s = str.toLowerCase().trim();
    if (s.length < 3) return true;

    // Check for non-alphabetic characters (except spaces or hyphen)
    if (/[^a-z\s\-]/i.test(s)) return true;

    // Check if it matches any station code in our local database (e.g. NDLS, HWH, CSMT)
    const isStationCode = getStations().some(st => st.code.toLowerCase() === s);
    if (isStationCode) return false;

    // If it has no vowels and is not a known station code, it's gibberish (e.g. "zxcv")
    if (!/[aeiouy]/i.test(s)) return true;

    // If it has weird consonant clusters of 4+ consonants in a row (excluding spaces)
    const normalized = s.replace(/\s+/g, '');
    if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(normalized)) return true;

    return false;
  };

  if (isGibberish(cleanFrom) || isGibberish(cleanTo)) {
    return res.status(400).json({
      error: `🚨 Invalid Stations: "${from}" or "${to}" is not a recognized railway station. Please enter valid station names (e.g. Varanasi, New Delhi).`
    });
  }

  // FALLBACK SIMULATION: If API fails/exhausts daily quota, return realistic trains with mapped images and complete fares
  const getFallbackSimulated = () => [
    {
      trainNo: "22436",
      name: "Vande Bharat Express",
      from, to,
      desc: "Semi-high speed premium train connecting " + from + " and " + to + " with world-class facilities.",
      image: "https://wallpapercave.com/wp/wp12183303.jpg",
      rating: "4.9",
      fare: { "1A": 2200, "2A": 1600, "3A": 1200, "SL": 550 },
      time: "8h 15m",
      days: "Daily",
      halts: ["Halt Station A", "Halt Station B", "Halt Station C"]
    },
    {
      trainNo: "12951",
      name: "Mumbai Rajdhani Express",
      from, to,
      desc: "Superfast premium overnight service between " + from + " and " + to + " with exquisite hospitality.",
      image: "https://static.india.com/wp-content/uploads/2017/09/rajdhani-train-1.jpg",
      rating: "4.8",
      fare: { "1A": 3400, "2A": 2300, "3A": 1600, "SL": 650 },
      time: "12h 30m",
      days: "Daily",
      halts: ["Stop Station X", "Stop Station Y", "Stop Station Z"]
    },
    {
      trainNo: "12002",
      name: "Shatabdi Express",
      from, to,
      desc: "High-speed daytime chair-car service linking " + from + " and " + to + ".",
      image: "https://i0.wp.com/www.himachaltaxi.com/wp-content/uploads/2013/03/Shatabdi-Express-Chandigarh.jpg",
      rating: "4.6",
      fare: { "1A": 1900, "2A": 1400, "3A": 950, "SL": 420 },
      time: "6h 45m",
      days: "Mon, Tue, Thu, Fri, Sat",
      halts: ["Junction Halt A", "Junction Halt B", "Junction Halt C"]
    }
  ];

  // 2. Combined Validation & Train Search (ONE Single Call to Gemini - Saves 50% Quota!)
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

      const prompt = `You are a strict Indian Railway Database Assistant.
First, check if both of the entered stations are real, recognized railway stations, cities, or towns in India:
Source: "${from}"
Destination: "${to}"

If EITHER or BOTH are invalid, fake, fictional, random keystrokes, or gibberish (e.g. "bbkjkash", "sxuuhxk", "asdfgh"), you MUST return EXACTLY this JSON object:
{
  "invalid": true,
  "error": "🚨 Invalid Stations: \\"${from}\\" or \\"${to}\\" is not a recognized railway station. Please enter valid station names (e.g. Varanasi, New Delhi)."
}

If both stations are valid, retrieve a JSON array containing up to 5 real or highly realistic express/superfast trains (including Vande Bharat, Rajdhani, Shatabdi, Tejas, and Mail/Express trains) that operate between '${from}' and '${to}' in India.
For each train object in the array, you MUST return these exact fields:
1. "trainNo": A string containing a real/realistic 5-digit number (e.g., "22436", "12953").
2. "name": The official train name (e.g., "Vande Bharat Express", "Rajdhani Express", "Shatabdi Express", "Tejas Express", "Poorva Express").
3. "from": "${from}"
4. "to": "${to}"
5. "desc": A 1-sentence description detailing on-board pantry or comfort features.
6. "image": "placeholder"
7. "rating": A string decimal rating between "4.2" and "4.9" (e.g., "4.7").
8. "fare": An object containing class ticket pricing. IMPORTANT: For Vande Bharat, Shatabdi, and Tejas Express, you MUST use ONLY classes "CC" and "EC" (e.g. {"CC": 980, "EC": 1800}). For Rajdhani, you MUST use ONLY "3A", "2A", and "1A" (No Sleeper SL!). For other general Mail/Express/Superfast trains, you MUST use "SL", "3A", "2A", "1A" (e.g. {"SL": 480, "3A": 1200, "2A": 1700, "1A": 2400}).
9. "time": Travel duration (e.g. "8h 15m", "12h 45m").
10. "days": Days of operation (e.g. "Daily" or "Mon, Wed, Fri").
11. "halts": A JSON array of 3 strings representing the actual, real-world major intermediate halts/stations between '${from}' and '${to}'.

Return ONLY the raw parseable JSON (either the invalid object or the array of trains). Do not wrap it in markdown code blocks like \`\`\`json. Do not include any other conversational text or explanation.`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });

      if (response.data && response.data.candidates) {
        let text = response.data.candidates[0].content.parts[0].text.trim();

        // Clean markdown block wrappers if model outputs them
        if (text.startsWith("```json")) {
          text = text.substring(7);
        } else if (text.startsWith("```")) {
          text = text.substring(3);
        }

        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }

        text = text.trim();

        const parsedResult = JSON.parse(text);

        // Handle case where Gemini flagged invalid stations
        if (parsedResult && parsedResult.invalid === true) {
          console.log(`Validation Rejected by consolidated Gemini Prompt: ${parsedResult.error}`);
          return res.status(400).json({ error: parsedResult.error });
        }

        const parsedTrains = parsedResult;
        if (Array.isArray(parsedTrains) && parsedTrains.length > 0) {

          // POST-PROCESSING: Map user custom train images and dynamic classes/fares based on real railway rules
          parsedTrains.forEach(t => {
            const mapped = getTrainClassesAndFares(t.name, t.fare);
            t.classes = mapped.classes;
            t.fare = mapped.fare;
            t.image = getTrainImage(t.name);
          });

          console.log(`Successfully fetched ${parsedTrains.length} trains from consolidated Gemini prompt for ${from} -> ${to}`);
          return res.json(parsedTrains);
        }
      }
    } catch (error) {
      console.error("GEMINI CONSOLIDATED SEARCH ERROR (Passing to realistic local search):", error.response?.data || error.message);
      // Fall back to mock simulation gracefully
    }
  }

  // If Gemini API is missing or fails, send clean realistic fallback with direct Unsplash images and stops
  console.log(`Using high-res simulated train data fallback for ${from} -> ${to}`);

  const fallback = getFallbackSimulated();
  fallback.forEach(t => {
    t.image = getTrainImage(t.name);
    const mapped = getTrainClassesAndFares(t.name, t.fare);
    t.classes = mapped.classes;
    t.fare = mapped.fare;
  });
  res.json(fallback);
};

// 4. Get seat availability (Gemini AI Integrated!)
export const getSeatAvailability = async (req, res) => {
  const { from, to, date } = req.query;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Source, destination, and date are required" });
  }

  const cleanFrom = from.trim().toLowerCase();
  const cleanTo = to.trim().toLowerCase();

  const isGibberish = (str) => {
    const s = str.toLowerCase().trim();
    if (s.length < 3) return true;
    if (/[^a-z\s\-]/i.test(s)) return true;
    if (!/[aeiouy]/i.test(s)) return true;
    if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(s.replace(/\s+/g, ''))) return true;
    return false;
  };

  if (isGibberish(cleanFrom) || isGibberish(cleanTo)) {
    return res.status(400).json({
      error: `🚨 Invalid Stations: "${from}" or "${to}" is not a recognized railway station. Please enter valid station names.`
    });
  }

  // Fallback simulated availability
  const getFallbackAvailability = () => [
    {
      trainNo: "22436",
      trainName: "Vande Bharat Express",
      from, to,
      class: "CC",
      fare: 1100,
      status: "AVAILABLE 18"
    },
    {
      trainNo: "22436",
      trainName: "Vande Bharat Express",
      from, to,
      class: "EC",
      fare: 2050,
      status: "AVAILABLE 4"
    },
    {
      trainNo: "12951",
      trainName: "Mumbai Rajdhani Express",
      from, to,
      class: "3A",
      fare: 1650,
      status: "RAC 2"
    },
    {
      trainNo: "12951",
      trainName: "Mumbai Rajdhani Express",
      from, to,
      class: "1A",
      fare: 3500,
      status: "AVAILABLE 1"
    },
    {
      trainNo: "12002",
      trainName: "Shatabdi Express",
      from, to,
      class: "CC",
      fare: 950,
      status: "WL 5"
    }
  ];

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

      const prompt = `You are a real-time Indian Railway Seat Availability system.
For the route: '${from}' to '${to}' on travel date: '${date}'.
Please retrieve a JSON array of up to 5 real or highly realistic trains operating between these stations on this date.
For each train, you MUST determine a realistic seat availability status (e.g. "AVAILABLE 12", "RAC 2", "WL 5", "AVAILABLE 2") for each of its active traveling classes.
For each object in the array, you MUST return these exact fields:
1. "trainNo": A string containing a real/realistic 5-digit number (e.g., "22436", "12953").
2. "trainName": The official train name (e.g., "Vande Bharat Express", "Rajdhani Express", "Shatabdi Express").
3. "from": "${from}"
4. "to": "${to}"
5. "class": One of "1A", "2A", "3A", "SL", "CC", "EC" (string).
6. "fare": Price of ticket in INR (number).
7. "status": Seat status (string, e.g. "AVAILABLE 4", "RAC 1", "WL 3", "AVAILABLE 18").

Return ONLY the raw parseable JSON array. Do not wrap it in markdown code blocks like \`\`\`json. Do not include any other conversational text or explanation.`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });

      if (response.data && response.data.candidates) {
        let text = response.data.candidates[0].content.parts[0].text.trim();

        if (text.startsWith("```json")) {
          text = text.substring(7);
        } else if (text.startsWith("```")) {
          text = text.substring(3);
        }

        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }

        text = text.trim();

        const parsedResult = JSON.parse(text);
        if (Array.isArray(parsedResult) && parsedResult.length > 0) {
          console.log(`Successfully fetched ${parsedResult.length} seat availabilities from Gemini prompt for ${from} -> ${to}`);
          return res.json(parsedResult);
        }
      }
    } catch (error) {
      console.error("GEMINI AVAILABILITY ERROR (Passing to realistic fallback):", error.response?.data || error.message);
    }
  }

  console.log(`Using simulated seat availability fallback for ${from} -> ${to}`);
  return res.json(getFallbackAvailability());
};

// Helper: Dynamic Chronological Time-Alignment Post-Processor
const alignHaltsToCurrentTime = (data) => {
  if (!data || !data.halts || data.halts.length === 0) return;

  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentHour = istTime.getHours();
  const currentMin = istTime.getMinutes();
  let currentMins = currentHour * 60 + currentMin;

  const parseTime = (str) => {
    if (!str) return 0;
    const parts = str.split(":");
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  // 1. Calculate day offset wrap factors (e.g. crossing midnight)
  let dayOffset = 0;
  let prevMins = parseTime(data.halts[0].scheduledArrival);

  data.halts.forEach((halt, idx) => {
    let mins = parseTime(halt.scheduledArrival);
    if (idx > 0 && mins < prevMins) {
      dayOffset += 1440; // Add 24 hours
    }
    halt.absMins = mins + dayOffset;
    prevMins = mins;
  });

  // 2. Adjust current test time coordinate:
  // If tested in inactive hours, shift currentMins to 45% of trip for gorgeous simulator views
  const tripStart = data.halts[0].absMins;
  const tripEnd = data.halts[data.halts.length - 1].absMins;

  if (currentMins < tripStart || currentMins > tripEnd) {
    const duration = tripEnd - tripStart;
    currentMins = tripStart + Math.round(duration * 0.45);
  }

  const delay = typeof data.delay === "number" ? data.delay : 0;
  let lastDepartedIdx = -1;

  // 3. Process departed vs upcoming halts cleanly based on time
  data.halts.forEach((halt, idx) => {
    const actMins = halt.absMins + delay;

    // Reformat actMins back to HH:MM format
    const actH = Math.floor((actMins % 1440) / 60).toString().padStart(2, "0");
    const actM = Math.floor(actMins % 60).toString().padStart(2, "0");
    halt.actualArrival = `${actH}:${actM}`;

    halt.delay = delay;

    if (currentMins >= actMins) {
      halt.status = "DEPARTED";
      lastDepartedIdx = idx;
    } else {
      halt.status = "UPCOMING";
    }
  });

  // Safe checks
  if (lastDepartedIdx === -1) {
    data.halts[0].status = "DEPARTED";
    lastDepartedIdx = 0;
  }

  if (lastDepartedIdx === data.halts.length - 1) {
    data.halts[data.halts.length - 1].status = "UPCOMING";
    lastDepartedIdx = data.halts.length - 2;
  }

  // 4. Synthesize logical heading status
  const currentHalt = data.halts[lastDepartedIdx];
  const nextHalt = data.halts[lastDepartedIdx + 1];

  if (nextHalt) {
    data.currentStation = `Departed ${currentHalt.stationName}, heading to ${nextHalt.stationName}`;
    if (!data.positionStatus) {
      data.positionStatus = `Running 37 km behind ${nextHalt.stationName}`;
    }
  } else {
    data.currentStation = `Arrived at ${currentHalt.stationName}`;
    if (!data.positionStatus) {
      data.positionStatus = `Arrived at destination: ${currentHalt.stationName}`;
    }
  }
};

// 5. Get Live Train Status (Dynamic Gemini AI Integrated!)
export const getLiveTrainStatus = async (req, res) => {
  const { trainNo } = req.query;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!trainNo || trainNo.trim().length === 0) {
    return res.status(400).json({ error: "Train number is required" });
  }

  const cleanTrainNo = trainNo.trim();

  // Heuristic simulated status
  const getFallbackStatus = () => {
    const isRajdhani = cleanTrainNo === "12951" || cleanTrainNo.includes("951");
    const isPatna = cleanTrainNo === "12309" || cleanTrainNo.includes("309");

    if (isRajdhani) {
      return {
        trainNo: "12951",
        trainName: "Mumbai Rajdhani Express",
        currentStation: "Vadodara Junction",
        speed: "112 km/h",
        delay: 15,
        lastUpdated: "2 mins ago",
        halts: [
          { stationName: "New Delhi", stationCode: "NDLS", scheduledArrival: "16:55", actualArrival: "16:55", status: "DEPARTED", delay: 0 },
          { stationName: "Kota Junction", stationCode: "KOTA", scheduledArrival: "22:10", actualArrival: "22:15", status: "DEPARTED", delay: 5 },
          { stationName: "Ratlam Junction", stationCode: "RTM", scheduledArrival: "01:55", actualArrival: "02:05", status: "DEPARTED", delay: 10 },
          { stationName: "Vadodara Junction", stationCode: "BRC", scheduledArrival: "05:50", actualArrival: "06:05", status: "DEPARTED", delay: 15 },
          { stationName: "Mumbai Central", stationCode: "MMCT", scheduledArrival: "08:35", actualArrival: "08:50", status: "UPCOMING", delay: 15 }
        ]
      };
    }

    if (isPatna) {
      return {
        trainNo: "12309",
        trainName: "Patna Rajdhani Express",
        currentStation: "Kanpur Central",
        speed: "95 km/h",
        delay: 25,
        lastUpdated: "Just now",
        halts: [
          { stationName: "New Delhi", stationCode: "NDLS", scheduledArrival: "17:10", actualArrival: "17:10", status: "DEPARTED", delay: 0 },
          { stationName: "Kanpur Central", stationCode: "CNB", scheduledArrival: "21:55", actualArrival: "22:20", status: "DEPARTED", delay: 25 },
          { stationName: "Prayagraj Junction", stationCode: "PRYJ", scheduledArrival: "00:15", actualArrival: "00:40", status: "UPCOMING", delay: 25 },
          { stationName: "Patna Junction", stationCode: "PNBE", scheduledArrival: "04:40", actualArrival: "05:05", status: "UPCOMING", delay: 25 }
        ]
      };
    }

    // Default dynamic simulator for general train numbers (e.g. 12391 Shramjeevi)
    return {
      trainNo: cleanTrainNo,
      trainName: `Express Train ${cleanTrainNo}`,
      currentStation: "Pt. Deen Dayal Upadhyaya Jn.",
      speed: "80 km/h",
      delay: 25,
      lastUpdated: "Just now",
      halts: [
        { stationName: "Pt. Deen Dayal Upadhyaya Jn.", stationCode: "DDU", scheduledArrival: "14:15", actualArrival: "14:40", status: "DEPARTED", delay: 25 },
        { stationName: "Varanasi Jn", stationCode: "BSB", scheduledArrival: "15:02", actualArrival: "15:27", status: "UPCOMING", delay: 25 },
        { stationName: "Sultanpur Jn", stationCode: "SLN", scheduledArrival: "17:03", actualArrival: "17:28", status: "UPCOMING", delay: 25 },
        { stationName: "Lucknow Charbagh", stationCode: "LKO", scheduledArrival: "19:55", actualArrival: "20:20", status: "UPCOMING", delay: 25 },
        { stationName: "Moradabad", stationCode: "MB", scheduledArrival: "01:27", actualArrival: "01:52", status: "UPCOMING", delay: 25 },
        { stationName: "New Delhi", stationCode: "NDLS", scheduledArrival: "04:40", actualArrival: "05:05", status: "UPCOMING", delay: 25 }
      ]
    };
  };

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

      const prompt = `You are a real-time Indian Railway Live Running Status assistant.
For train number: '${cleanTrainNo}'.
Please generate a highly realistic and detailed live running status of this train today in India.
Your response MUST be a single, strict JSON object containing these exact fields:
1. "trainNo": "${cleanTrainNo}"
2. "trainName": The official name of the train matching this number (e.g. "Rajdhani Express", "Shatabdi Express", "Vande Bharat Express", or a highly realistic express train name if it's not a famous number).
3. "currentStation": The station name where the train is currently running near or halted at.
4. "speed": Simulated current speed (e.g., "105 km/h", "0 km/h" if halted).
5. "delay": Current accumulated delay in minutes (number, e.g. 15).
6. "lastUpdated": "2 mins ago" (string).
7. "positionStatus": A highly precise, real-time positional status of the train relative to its upcoming stops, expressing exactly how far it is (e.g. "37 km behind Varanasi Junction" or "12 km ahead of Lucknow Charbagh").
8. "halts": A JSON array representing 4 to 6 scheduled stations along the route. Each station halt object must contain:
   - "stationName": Full name of the station (e.g., "Kanpur Central").
   - "stationCode": 3-4 letter station code (e.g. "CNB").
   - "scheduledArrival": Scheduled arrival time (24h format, e.g., "21:55").
   - "actualArrival": Simulated actual arrival time (24h format, accounting for delay, e.g., "22:10").
   - "status": Must be one of "DEPARTED" (if the train has passed it) or "UPCOMING" (if the train has not reached it yet).
   - "delay": Delay in minutes at that station (number).

Return ONLY the raw parseable JSON object. Do not wrap it in markdown code blocks like \`\`\`json. Do not include any other conversational text or explanation.`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });

      if (response.data && response.data.candidates) {
        let text = response.data.candidates[0].content.parts[0].text.trim();

        if (text.startsWith("```json")) {
          text = text.substring(7);
        } else if (text.startsWith("```")) {
          text = text.substring(3);
        }

        if (text.endsWith("```")) {
          text = text.substring(0, text.length - 3);
        }

        text = text.trim();

        const parsedResult = JSON.parse(text);
        if (parsedResult && parsedResult.trainNo) {
          // Align halts chronologically based on real time
          alignHaltsToCurrentTime(parsedResult);
          console.log(`Successfully fetched live running status for train ${cleanTrainNo} from Gemini prompt.`);
          return res.json(parsedResult);
        }
      }
    } catch (error) {
      console.error("GEMINI LIVE STATUS ERROR (Passing to realistic fallback):", error.response?.data || error.message);
    }
  }

  console.log(`Using simulated live train running status fallback for train ${cleanTrainNo}`);
  const fallback = getFallbackStatus();
  alignHaltsToCurrentTime(fallback);
  return res.json(fallback);
};

