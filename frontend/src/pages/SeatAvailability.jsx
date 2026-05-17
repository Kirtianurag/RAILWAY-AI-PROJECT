import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SeatAvailability = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Debounced Station Autocomplete for From input
  useEffect(() => {
    if (from.trim().length < 2) {
      setFromSuggestions([]);
      return;
    }
    const fetchFromStations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/stations?q=${from}`);
        const data = await response.json();
        setFromSuggestions(data);
      } catch (err) {
        console.error("From station autocomplete error:", err);
      }
    };
    const timer = setTimeout(fetchFromStations, 250);
    return () => clearTimeout(timer);
  }, [from]);

  // Debounced Station Autocomplete for To input
  useEffect(() => {
    if (to.trim().length < 2) {
      setToSuggestions([]);
      return;
    }
    const fetchToStations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/stations?q=${to}`);
        const data = await response.json();
        setToSuggestions(data);
      } catch (err) {
        console.error("To station autocomplete error:", err);
      }
    };
    const timer = setTimeout(fetchToStations, 250);
    return () => clearTimeout(timer);
  }, [to]);

  // Exhaustive Dynamic Indian Railway Station Code Dictionary
  const getStationCode = (city) => {
    if (!city) return "STN";
    const c = city.toLowerCase().trim();
    
    const codes = {
      "delhi": "NDLS",
      "new delhi": "NDLS",
      "varanasi": "BSB",
      "patna": "PNBE",
      "pana": "PNBE",
      "mumbai": "MMCT",
      "bombay": "MMCT",
      "bangalore": "SBC",
      "bengaluru": "SBC",
      "chennai": "MAS",
      "kolkata": "HWH",
      "howrah": "HWH",
      "pune": "PUNE",
      "hyderabad": "HYB",
      "secunderabad": "SC",
      "lucknow": "LKO",
      "kanpur": "CNB",
      "agra": "AGC",
      "jaipur": "JP",
      "ahmedabad": "ADI",
      "surat": "ST",
      "bhopal": "BPL",
      "indore": "INDB",
      "nagpur": "NGP",
      "chandigarh": "CDG",
      "amritsar": "ASR",
      "ludhiana": "LDH",
      "jammu": "JAT",
      "guwahati": "GHY",
      "bhubaneswar": "BBS",
      "ranchi": "RNC",
      "raipur": "R",
      "visakhapatnam": "VSKP",
      "vijayawada": "BZA",
      "coimbatore": "CBE",
      "kochi": "ERS",
      "trivandrum": "TVC",
      "madurai": "MDU",
      "goa": "MAO",
      "gorakhpur": "GKP",
      "allahabad": "PRYJ",
      "prayagraj": "PRYJ",
      "gaya": "GAYE",
      "dehradun": "DDN",
      "haridwar": "HW",
    };

    if (codes[c]) return codes[c];

    for (const key in codes) {
      if (c.includes(key) || key.includes(c)) {
        return codes[key];
      }
    }

    return city.substring(0, Math.min(4, city.length)).toUpperCase();
  };

  /* ================= SEARCH API ================= */
  const handleSearch = async () => {
    setError("");
    setResults([]);

    if (!from || !to || !date) {
      setError("Please fill all fields to query availability");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError("Source and destination stations cannot be identical");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trains/availability?from=${from}&to=${to}&date=${date}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch seat availability");
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1220] text-slate-200 px-6 py-12 font-sans flex flex-col justify-between">
      
      <div>
        {/* 1. TOP HEADER ACTION BLOCK */}
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12 select-none">
          
          {/* Left Side: Back to Dashboard */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#1a2333]/90 border border-slate-750/90 hover:bg-[#222e44]/95 hover:border-slate-650 transition text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs shadow active:scale-98 cursor-pointer"
            >
              <span>← Back to Dashboard</span>
            </button>
          </div>

          {/* Right Side: Professional Branding */}
          <div className="space-y-1 text-center md:text-right">
            <span className="text-white font-black text-lg tracking-wider block leading-none">SEAT AVAILABILITY CORE</span>
          </div>

        </div>

        {/* 2. GLASSMORPHIC SEARCH PANEL */}
        <div className="max-w-5xl mx-auto bg-[#172031]/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl mb-12 relative z-50">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* From Station Input with Autocomplete */}
            <div className="relative">
              <input
                type="text"
                placeholder="From Station"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold placeholder-slate-500 outline-none"
              />
              {fromSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-[#172031] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto no-scrollbar">
                  {fromSuggestions.map((s) => (
                    <li
                      key={s.code}
                      onClick={() => {
                        setFrom(s.name);
                        setFromSuggestions([]);
                      }}
                      className="px-4 py-2.5 hover:bg-[#222e44] text-xs font-bold text-slate-300 cursor-pointer flex justify-between items-center transition"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider">{s.code}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* To Station Input with Autocomplete */}
            <div className="relative">
              <input
                type="text"
                placeholder="To Station"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold placeholder-slate-500 outline-none"
              />
              {toSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-[#172031] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto no-scrollbar">
                  {toSuggestions.map((s) => (
                    <li
                      key={s.code}
                      onClick={() => {
                        setTo(s.name);
                        setToSuggestions([]);
                      }}
                      className="px-4 py-2.5 hover:bg-[#222e44] text-xs font-bold text-slate-300 cursor-pointer flex justify-between items-center transition"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider">{s.code}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Input */}
            <div>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold outline-none"
              />
            </div>

            {/* Search Action Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 transition text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Querying Gemini...</span>
                </>
              ) : (
                <span>Check Availability</span>
              )}
            </button>

          </div>

          {error && (
            <p className="text-rose-500 text-center mt-4 text-xs font-bold uppercase tracking-wider">
              {error}
            </p>
          )}

        </div>

        {/* 3. DYNAMIC CARD RESULTS GRID */}
        <div className="w-full max-w-5xl mx-auto space-y-6 mb-16 relative z-10">
          
          {results.length === 0 && !loading && (
            <div className="bg-[#172031]/50 border border-slate-850 rounded-3xl p-12 text-center shadow-lg max-w-2xl mx-auto select-none">
              <span className="text-slate-500 text-3xl font-black block mb-4">🪑</span>
              <p className="text-slate-400 font-bold text-sm tracking-wide">
                No active seat availability queries queried. Enter source, destination, and traveling schedule above to fetch real-time status.
              </p>
            </div>
          )}

          {results.map((train, index) => {
            const fromCode = getStationCode(train.from);
            const toCode = getStationCode(train.to);
            const statusUpper = (train.status || "").toUpperCase();
            
            const isWL = statusUpper.startsWith("WL");
            const isRAC = statusUpper.startsWith("RAC");
            const isAvailable = statusUpper.startsWith("AVAILABLE");

            return (
              <div
                key={index}
                className="bg-[#172031]/90 border border-slate-800/80 hover:border-emerald-500/35 rounded-3xl p-6 shadow-lg hover:shadow-[0_0_40px_rgba(52,211,153,0.08)] transition-all duration-500 ease-in-out relative flex flex-col md:flex-row justify-between items-stretch gap-6 select-none"
              >
                
                {/* Left & Right notches */}
                <div className="absolute left-[-6px] top-[45%] w-3 h-3 bg-[#0e1220] rounded-full border-r border-slate-850 z-10 hidden md:block"></div>
                <div className="absolute right-[-6px] top-[45%] w-3 h-3 bg-[#0e1220] rounded-full border-l border-slate-850 z-10 hidden md:block"></div>

                {/* Left Info Column */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-black text-cyan-400 tracking-wide uppercase leading-tight">
                      {train.trainName} ({train.trainNo})
                    </h3>
                    
                    {/* Visual Station Acronym badging */}
                    <div className="flex items-center gap-2.5 my-2.5">
                      <span className="text-[10px] font-black text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                        {fromCode}
                      </span>
                      <span className="text-slate-500 text-xs font-black">➔</span>
                      <span className="text-[10px] font-black text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                        {toCode}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize font-bold">
                        ({train.from} to {train.to})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                    <span>Traveling Class: <strong className="text-emerald-400 uppercase font-bold">{train.class}</strong></span>
                    <span className="text-slate-700">•</span>
                    <span>Fare: <strong className="text-cyan-400">₹{train.fare}</strong></span>
                  </div>
                </div>

                {/* Right Status Badge and Action Column */}
                <div className="flex flex-col justify-between md:items-end min-w-[220px] border-t md:border-t-0 md:border-l border-slate-800/60 pt-4 md:pt-0 md:pl-6">
                  
                  <div className="flex flex-col md:items-end gap-1.5 select-none">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider leading-none">REAL-TIME STATUS</span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border text-center ${
                        isAvailable
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : isRAC
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {train.status}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (isWL) {
                        alert("Waitlisted tickets cannot be reserved in current allocation quota.");
                        return;
                      }

                      navigate("/book-ticket", {
                        state: {
                          train: {
                            trainNo: train.trainNo,
                            name: train.trainName,
                            from: train.from,
                            to: train.to,
                            classes: [train.class],
                            baseSeats: { [train.class]: 5 },
                            fare: { [train.class]: train.fare },
                          },
                          from: train.from,
                          to: train.to,
                          date: date,
                        },
                      });
                    }}
                    disabled={isWL}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow transition-all duration-300 ${
                      isWL
                        ? "bg-[#172031] text-slate-500 border border-slate-800 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white hover:text-white cursor-pointer active:scale-98"
                    }`}
                  >
                    {isWL ? "Locked (WL)" : "Reserve Seats"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* 4. OFFICIAL TRAVEL NOTICE & HELPLINES FOOTER */}
      <div className="w-full max-w-5xl mx-auto border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-medium select-none">
        <div className="text-center md:text-left space-y-1.5 max-w-xl">
          <p className="text-slate-400 font-black uppercase tracking-wider text-[9px] flex items-center justify-center md:justify-start gap-1">
            ⚠️ Automated AI Seat Availability Terms
          </p>
          <p className="leading-relaxed text-slate-500">
            Seat allocations shown are calculated using real-time API routes and travel dates verified by Ministry guidelines. 
            Availability may change rapidly due to current train load schedules. 
            RAC bookings are eligible for passenger travel with partial seat sharing compliance.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1.5 font-bold text-slate-400 text-[9px] tracking-wider uppercase">
          <span>📞 General Inquiry Helpline: <strong className="text-emerald-450 font-black font-mono text-xs">139</strong></span>
          <span>🛡️ Security Helpline: <strong className="text-cyan-405 font-black font-mono text-xs">182</strong></span>
          <span>📧 Digital Support: <span className="text-slate-500 font-normal font-sans text-[10px] lowercase tracking-normal">etickets@irctc.co.in</span></span>
        </div>
      </div>

    </div>
  );
};

export default SeatAvailability;
