import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= BERTH RULES (CORRECT) ================= */
const berthByClass = {
  "1A": ["LB", "UB"],
  "2A": ["LB", "UB", "SL", "SU"],
  "3A": ["LB", "MB", "UB", "SL", "SU"],
  "SL": ["LB", "MB", "UB", "SL", "SU"],
  "CC": ["WINDOW", "AISLE"],
};



const PNRStatus = () => {
  const navigate = useNavigate();

  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Emojis stripper utility to clean database values (e.g. seat graphics like 🤾‍♂️)
  const stripEmojis = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
      .trim();
  };

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

  const checkPNR = () => {
    setError("");
    setResult(null);

    const cleanPnr = pnr.trim();

    if (cleanPnr.length !== 10) {
      setError("🚨 Invalid PNR: PNR number must be exactly 10 digits.");
      return;
    }

    // 1. Query dynamic localStorage bookings first
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    const localMatch = stored.find((b) => String(b.pnr).trim() === cleanPnr);

    if (localMatch) {
      const routeParts = localMatch.route ? localMatch.route.split(/➔|→|->/) : [];
      const fromCity = localMatch.from || routeParts[0]?.trim() || "New Delhi";
      const toCity = localMatch.to || routeParts[1]?.trim() || "Varanasi";

      const mappedResult = {
        trainName: localMatch.trainName,
        trainNo: localMatch.trainNo,
        from: fromCity,
        to: toCity,
        route: `${fromCity} → ${toCity}`,
        date: localMatch.date,
        class: localMatch.class,
        pnr: localMatch.pnr,
        cancelled: localMatch.cancelled || localMatch.status === "CANCELLED",
        passengers: (localMatch.passengers || []).map((p) => ({
          name: p.name,
          status: localMatch.cancelled || localMatch.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED",
          berth: p.seat || "UB",
        })),
      };
      setResult(mappedResult);
      return;
    }



    setError("🚨 Invalid PNR: This PNR has not been generated yet. Please enter a valid booked PNR.");
  };

  return (
    <div className="min-h-screen bg-[#0e1220] text-slate-200 px-6 py-12 font-sans flex flex-col justify-between">
      
      <div>
        {/* 1. TOP HEADER ACTION BLOCK */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12 select-none">
          
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
            <span className="text-white font-black text-lg tracking-wider block leading-none">PNR INQUIRY NODE</span>
          </div>

        </div>

        {/* 2. QUERY CONSOLE CARD */}
        <div className="max-w-xl mx-auto bg-[#172031]/90 border border-slate-800/80 rounded-3xl p-6 shadow-lg mb-12 select-none">
          
          <div className="space-y-4">
            
            <h2 className="text-sm font-black text-cyan-400 tracking-wider uppercase text-center mb-4">
              PNR Verification
            </h2>

            <input
              type="text"
              placeholder="Enter 10-digit PNR Number"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold placeholder-slate-500 outline-none text-center font-mono tracking-widest text-lg"
            />

            <button
              onClick={checkPNR}
              className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase shadow active:scale-98 cursor-pointer text-center"
            >
              Check PNR Status
            </button>

            {error && (
              <p className="text-rose-500 text-center text-xs font-bold uppercase tracking-wider mt-2 animate-pulse">
                {error}
              </p>
            )}

          </div>

          {/* 3. ELECTRONIC TICKET STATUS RECEIPT */}
          {result && (
            <div className="mt-8 pt-6 border-t border-dashed border-slate-800/80 relative animate-fadeIn">
              
              {/* Notch cutouts left & right */}
              <div className="absolute left-[-32px] top-[-6px] w-4 h-4 bg-[#0e1220] rounded-full border-r border-slate-850 z-10"></div>
              <div className="absolute right-[-32px] top-[-6px] w-4 h-4 bg-[#0e1220] rounded-full border-l border-slate-850 z-10"></div>

              <div className="bg-[#0e1220]/60 border border-slate-850 hover:border-emerald-500/30 transition rounded-2xl p-5 space-y-4 relative">
                
                {/* Train Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wide leading-tight">
                      {result.trainNo} {stripEmojis(result.trainName)}
                    </h4>
                    <span className="text-[9px] text-slate-450 uppercase font-bold mt-0.5 block">
                      Class: {result.class} • Travel Date: {result.date}
                    </span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    CONFIRMED
                  </span>
                </div>

                {/* Route Badging Acronyms */}
                <div className="flex items-center gap-2.5 py-1">
                  <span className="text-[10px] font-black text-white bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                    {getStationCode(result.from)}
                  </span>
                  <span className="text-slate-500 text-xs font-black">➔</span>
                  <span className="text-[10px] font-black text-white bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                    {getStationCode(result.to)}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-bold truncate">
                    ({result.from} to {result.to})
                  </span>
                </div>

                {/* Passengers List */}
                <div className="space-y-2 pt-2.5 border-t border-slate-850">
                  <span className="text-[9px] text-slate-405 block font-bold uppercase tracking-wider">👤 Passenger Allocations</span>
                  {result.passengers.map((p, index) => {
                    const isConf = p.status.toUpperCase().startsWith("CONF") || p.status.toUpperCase().startsWith("AVL");
                    const isWL = p.status.toUpperCase().startsWith("WL");
                    
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-[#172031]/50 border border-slate-850/60 rounded-xl p-3 text-xs font-bold text-slate-200"
                      >
                        <span>{index + 1}. {stripEmojis(p.name)}</span>
                        <div className="flex gap-2 font-mono text-[9px] uppercase font-black">
                          <span
                            className={`px-2 py-0.5 rounded border ${
                              isConf
                                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                                : isWL
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {p.status}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">
                            {stripEmojis(p.berth)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CSS Barcode */}
                <div className="flex flex-col items-center pt-4 border-t border-slate-850 select-none">
                  <div className="flex items-end h-8 gap-[2px] opacity-65">
                    {[1, 3, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 4, 2, 1].map((w, idx) => (
                      <div
                        key={idx}
                        className="bg-white h-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] tracking-[4px] font-mono text-slate-500 uppercase font-black mt-2">
                    {result.pnr}
                  </span>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* 4. HELPLINES & COMPLIANCE FOOTER */}
      <div className="w-full max-w-4xl mx-auto border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-medium select-none">
        <div className="text-center md:text-left space-y-1.5 max-w-lg">
          <p className="text-slate-400 font-black uppercase tracking-wider text-[9px] flex items-center justify-center md:justify-start gap-1">
            ⚠️ Automated PNR Inquiry Notices
          </p>
          <p className="leading-relaxed text-slate-500">
            Inquiries represent the current official seat allotments processed inside the digital travel ledger. 
            All passenger tickets require valid original identities during inspection. 
            Digital ledger query compliance satisfies guidelines under the Ministry of Railways.
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

export default PNRStatus;
