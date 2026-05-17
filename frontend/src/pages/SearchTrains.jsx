import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- HELPERS ---------------- */

const enrichTrainForBooking = (train) => {
  const classes = typeof train.fare === 'object' ? Object.keys(train.fare) : ["1A", "2A", "3A", "SL"];
  const availability = {};

  classes.forEach((cls) => {
    availability[cls] =
      Math.random() > 0.6
        ? `WL ${Math.floor(Math.random() * 5) + 1}`
        : `AVL ${Math.floor(Math.random() * 10) + 1}`;
  });

  return {
    ...train,
    classes,
    availability,
  };
};

const isPastDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time
  return selectedDate < today;
};

/* ---------------- COMPONENT ---------------- */

const SearchTrains = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [cls, setCls] = useState("1A");
  const [results, setResults] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Detail panel states
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [aiInsights, setAiInsights] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Autocomplete stations
  useEffect(() => {
    const fetchStations = async () => {
      const q = from.length > 1 ? from : (to.length > 1 ? to : "");
      if (!q) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/stations?q=${q}`);
        const data = await response.json();
        setStations(data);
      } catch (err) {
        console.error("Station fetch error:", err);
      }
    };
    const timer = setTimeout(fetchStations, 300);
    return () => clearTimeout(timer);
  }, [from, to]);

  // Fetch Gemini AI Insights when selected train changes
  useEffect(() => {
    if (!selectedTrain) return;

    const fetchAIInsights = async () => {
      setAiLoading(true);
      setAiInsights("");
      try {
        const prompt = `Provide a concise 3-bullet insight summary about the train "${selectedTrain.name} (${selectedTrain.trainNo})" running from ${selectedTrain.from} to ${selectedTrain.to}. Focus on typical delays, quality of catering/food on-board, and general travel tips for this specific train. Format the response as simple bullet points. Keep it highly professional, clean, and helpful. Do not use AI jargon.`;
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt })
        });
        
        const data = await response.json();
        if (data.reply) {
          setAiInsights(data.reply);
        } else {
          setAiInsights("• Delays: Information unavailable.\n• Food Quality: Standard pantry service.\n• Travel Tip: Keep ticket copy handy.");
        }
      } catch (err) {
        console.error("AI Insight fetch error:", err);
        setAiInsights("• Failed to fetch live AI insights. Please check server connection.");
      } finally {
        setAiLoading(false);
      }
    };

    fetchAIInsights();
  }, [selectedTrain]);

  const searchTrains = async () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }

    if (from === to) {
      alert("Source and destination cannot be same");
      return;
    }

    if (isPastDate(date)) {
      alert("Please select a valid future date");
      return;
    }

    setLoading(true);
    setSelectedTrain(null); // Reset detail panel on new search
    setAiInsights("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/search?from=${from}&to=${to}`);
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || "Invalid search request. Please check your station inputs.");
        setResults([]);
        return;
      }
      
      setResults(data);
      
      // Auto-select first train in results if available
      if (data.length > 0) {
        setSelectedTrain(data[0]);
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to search trains. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 px-6 py-8 font-sans">
      <style>{`
        /* Hide native Chromium datalist drop-down arrows */
        input[list]::-webkit-calendar-picker-indicator {
          display: none !important;
          -webkit-appearance: none;
        }
      `}</style>
      
      {/* HEADER STRIP */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 text-sm font-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Search & Discover Trains
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
          Find schedules, real-time availability, and detailed journey insights for your route.
        </p>
      </div>

      {/* SEARCH FORM BAR */}
      <div className="max-w-7xl mx-auto bg-[#161d30] border border-slate-800 rounded-2xl shadow-xl p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* FROM INPUT */}
          <div className="relative">
            <input
              list="from-stations"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From Station"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
            />
            <datalist id="from-stations">
              {stations.map(s => <option key={s.code} value={s.name} />)}
            </datalist>
          </div>

          {/* TO INPUT */}
          <div className="relative">
            <input
              list="to-stations"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To Station"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
            />
            <datalist id="to-stations">
              {stations.map(s => <option key={s.code} value={s.name} />)}
            </datalist>
          </div>

          {/* DATE PICKER */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-white outline-none focus:border-blue-500 transition-colors text-sm"
          />

          {/* CLASS DROP DOWN */}
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-white outline-none focus:border-blue-500 transition-colors text-sm appearance-none cursor-pointer"
          >
            <option className="bg-[#0b0f19]" value="1A">1A (First AC)</option>
            <option className="bg-[#0b0f19]" value="2A">2A (Second AC)</option>
            <option className="bg-[#0b0f19]" value="3A">3A (Third AC)</option>
            <option className="bg-[#0b0f19]" value="SL">SL (Sleeper Class)</option>
          </select>

          {/* SEARCH BUTTON */}
          <button
            onClick={searchTrains}
            disabled={loading}
            className="w-full rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-98 transition disabled:opacity-50 text-sm py-3 cursor-pointer"
          >
            {loading ? "Searching..." : "Search Trains"}
          </button>
        </div>
      </div>

      {/* CORE BODY: SPLIT VIEW LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT SIDE: RESULTS LIST (5 Columns) ================= */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">
            Search Results ({results.length})
          </h2>

          {results.length === 0 && !loading && (
            <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed font-semibold">
                Enter your departure and arrival stations to find real available trains.
              </p>
            </div>
          )}

          {results.map((train) => {
            const preparedTrain = enrichTrainForBooking(train);
            const isSelected = selectedTrain && selectedTrain.trainNo === train.trainNo;
            const trainClasses = typeof train.fare === 'object' ? Object.keys(train.fare) : ["SL", "3A", "2A", "1A"];
            const activeClass = trainClasses.includes(cls) ? cls : trainClasses[0];
            const displayFare = typeof train.fare === 'object' ? train.fare[activeClass] : train.fare;

            return (
              <div
                key={train.trainNo}
                onClick={() => setSelectedTrain(train)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-center gap-4 ${
                  isSelected
                    ? "bg-[#1f2a45]/80 border-blue-500/80 shadow-md"
                    : "bg-[#161d30] border-slate-800 hover:border-slate-700 hover:bg-[#1a233b]/60"
                }`}
              >
                {/* Minimalist Train Icon Container instead of Image */}
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="16" rx="2" />
                    <path d="M4 11h16" />
                    <path d="M12 3v8" />
                    <path d="M8 15h.01" />
                    <path d="M16 15h.01" />
                    <path d="m6 19-2 2" />
                    <path d="m18 19 2 2" />
                  </svg>
                </div>

                {/* Train Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-base font-bold truncate group-hover:text-blue-400 transition-colors ${
                      isSelected ? "text-blue-400" : "text-slate-100"
                    }`}>
                      {train.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No: {train.trainNo} • {train.days}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      {train.from} → {train.to}
                    </p>
                  </div>
                  
                  {/* Timing & Fare row */}
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Duration: {train.time || train.duration}</span>
                    <span className="text-sm font-bold text-amber-500 normal-case">₹{displayFare || "N/A"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= RIGHT SIDE: DETAILED INSIGHT PANEL (7 Columns) ================= */}
        <div className="lg:col-span-7">
          <h2 className="text-lg font-bold text-white mb-2">
            Train Journey & AI Details
          </h2>

          {selectedTrain ? (
            <div className="bg-[#161d30] border border-slate-800 rounded-2xl overflow-hidden shadow-xl sticky top-6">
              
              {/* Premium Solid Slate Header Panel instead of Train Photo Banner */}
              <div className="bg-[#121827]/40 border-b border-slate-800 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
                    ★ {selectedTrain.rating || "4.8"} Rated Service
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">{selectedTrain.name}</h3>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">Train No: {selectedTrain.trainNo} • Speed-link</p>
                </div>
                <div className="bg-[#0b0f19] px-4 py-2 border border-slate-800 rounded-xl text-center shrink-0 min-w-[120px]">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wide font-semibold">Duration</span>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider mt-0.5 block">
                    {selectedTrain.time || selectedTrain.duration || "8h 15m"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 pb-2">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {selectedTrain.desc || "Daily express service with AC Sleeper coaches. Features direct on-board pantry catering and high punctuality history."}
                </p>
              </div>

              {/* Split Details (Timeline + Amenities & AI) */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800">
                
                {/* Visual Route Timeline showing actual stops */}
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Route Timeline
                  </h4>
                  <div className="relative border-l border-slate-850 pl-4 ml-2 space-y-5">
                    {/* Origin */}
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 bg-blue-500 border-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{selectedTrain.from}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Departure - 08:00 AM (Origin)</p>
                      </div>
                    </div>

                    {/* Dynamic intermediate stops */}
                    {(selectedTrain.halts && selectedTrain.halts.length > 0
                      ? selectedTrain.halts
                      : ["Intermediate Halt A", "Intermediate Halt B"]
                    ).map((haltStation, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 bg-[#161d30] border-slate-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-200">{haltStation}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Stop - 2 min halt</p>
                        </div>
                      </div>
                    ))}

                    {/* Destination */}
                    <div className="relative">
                      <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 bg-blue-500 border-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{selectedTrain.to}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Arrival - {selectedTrain.time || selectedTrain.duration || "06:00 PM"} (Destination)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities & AI Info */}
                <div className="space-y-6">
                  {/* Amenities */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      On-Board Comforts
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#0b0f19] border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 select-none">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697-.056-4.024-.166C6.845 7.91 6 6.908 6 5.737V3.75c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v1.987c0 1.171-.845 2.172-1.976 2.347A42.146 42.146 0 0112 8.25zM12 8.25v1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 11.41 6 12.412 6 13.583v1.987c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125v-1.987c0-1.171-.845-2.172-1.976-2.347A42.146 42.146 0 0112 11.25zm0 0v1.5m0 2.25v3.75m0-3.75H7.5m4.5 0h4.5" />
                        </svg>
                        <span className="text-slate-300">Pantry Car</span>
                      </div>
                      <div className="bg-[#0b0f19] border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 select-none">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m14.5-4.5l-11 9m0-9l11 9" />
                        </svg>
                        <span className="text-slate-300">AC Comfort</span>
                      </div>
                      <div className="bg-[#0b0f19] border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 select-none">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        <span className="text-slate-300">Power Plugs</span>
                      </div>
                      <div className="bg-[#0b0f19] border border-slate-800 p-2.5 rounded-lg flex items-center gap-2 select-none">
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856a9.75 9.75 0 0113.788 0M1.924 8.674a14.25 14.25 0 0120.152 0M12.53 18.22a.75.75 0 11-1.06 0 .75.75 0 011.06 0z" />
                        </svg>
                        <span className="text-slate-300">Wi-Fi Link</span>
                      </div>
                    </div>
                  </div>

                  {/* Gemini Dynamic AI Insights */}
                  <div>
                    <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.188.904zM19.006 5.005l-.505 3.158-3.158.505 3.158.505.505 3.158.505-3.158 3.158-.505-3.158-.505-.505-3.158z" />
                      </svg>
                      Gemini Journey Insights
                    </h4>
                    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4 min-h-[120px] flex flex-col justify-center">
                      {aiLoading ? (
                        <div className="text-center py-4 space-y-2">
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-[11px] text-slate-400 animate-pulse">🤖 AI is reading timetable reviews...</p>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed whitespace-pre-line">
                          {aiInsights || "• Select this train to fetch dynamic comfort analyses, meal suggestions, and timing statistics."}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Booking Trigger Strip */}
              <div className="bg-[#121827] px-6 py-4 flex justify-between items-center border-t border-slate-800">
                {(() => {
                  const trainClasses = typeof selectedTrain.fare === 'object' ? Object.keys(selectedTrain.fare) : ["SL", "3A", "2A", "1A"];
                  const activeDetailClass = trainClasses.includes(cls) ? cls : trainClasses[0];
                  return (
                    <>
                      <div>
                        <span className="text-xs text-slate-400 block">Class Fare ({activeDetailClass})</span>
                        <span className="text-xl font-bold text-amber-500">
                          ₹{typeof selectedTrain.fare === 'object' ? selectedTrain.fare[activeDetailClass] : selectedTrain.fare}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const preparedTrain = enrichTrainForBooking(selectedTrain);
                          const resolvedClass = preparedTrain.classes.includes(cls) ? cls : preparedTrain.classes[0];
                          navigate("/book-ticket", {
                            state: {
                              train: preparedTrain,
                              from: selectedTrain.from || from,
                              to: selectedTrain.to || to,
                              date,
                              cls: resolvedClass,
                              source: "search",
                            },
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition shadow-lg shadow-green-600/10 cursor-pointer text-sm"
                      >
                        Book Tickets Now →
                      </button>
                    </>
                  );
                })()}
              </div>

            </div>
          ) : (
            <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-center mb-4 text-slate-400">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="16" rx="2" />
                  <path d="M4 11h16" />
                  <path d="M12 3v8" />
                  <path d="M8 15h.01" />
                  <path d="M16 15h.01" />
                  <path d="m6 19-2 2" />
                  <path d="m18 19 2 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-200">No Train Selected</h3>
              <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                Click on any train card from your search results to inspect halts, ratings, and AI journey facts.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default SearchTrains;
