import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stationsPath = path.join(__dirname, "../Data/stations.json");
const trainsPath = path.join(__dirname, "../Data/trains.json");

const getStations = () => JSON.parse(fs.readFileSync(stationsPath, "utf-8"));
const getTrains = () => JSON.parse(fs.readFileSync(trainsPath, "utf-8"));

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

// 3. Search Trains between stations
export const searchTrainsBetweenStations = (req, res) => {
  const { from, to } = req.query;
  const trains = getTrains();

  // If we find exact matches in our database, show them
  // Otherwise, simulate realistic trains for the route
  const found = trains.filter(t => t.from === from && t.to === to);

  if (found.length > 0) {
    return res.json(found);
  }

  // SIMULATION: If no exact train exists in our small DB, generate 3 realistic ones
  const simulated = [
    {
      trainNo: Math.floor(10000 + Math.random() * 90000).toString(),
      name: "Exp " + from + "-" + to,
      from, to,
      duration: "12h 45m",
      fare: { "1A": 3200, "2A": 2100, "3A": 1500, "SL": 450 }
    },
    {
      trainNo: Math.floor(10000 + Math.random() * 90000).toString(),
      name: "Superfast " + to + " Mail",
      from, to,
      duration: "10h 30m",
      fare: { "2A": 2300, "3A": 1650, "SL": 520 }
    }
  ];

  res.json(simulated);
};
