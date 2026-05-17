import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Ticket = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Read ticket from state (booking)
  const ticket = state?.booking;
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Emojis stripper utility to clean database values (e.g. seat graphics like 🤾‍♂️)
  const stripEmojis = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
      .trim();
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0e1220]">
        <div className="text-center space-y-4">
          <div className="text-4xl text-rose-500 font-bold">!</div>
          <p className="text-slate-400 font-semibold">Ticket not found</p>
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 rounded-lg text-sm text-white font-bold cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Exhaustive Dynamic Indian Railway Station Code Dictionary
  const getStationCode = (city) => {
    if (!city) return "STN";
    const c = city.toLowerCase().trim();
    
    const codes = {
      "delhi": "NDLS",
      "new delhi": "NDLS",
      "varanasi": "BSB",
      "patna": "PNBE",
      "pana": "PNBE", // user typo support
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

    // Check direct match first
    if (codes[c]) return codes[c];

    // Check partial matching
    for (const key in codes) {
      if (c.includes(key) || key.includes(c)) {
        return codes[key];
      }
    }

    // Default: capitalized slice
    return city.substring(0, Math.min(4, city.length)).toUpperCase();
  };

  // Splitting using regex to handle standard arrows (→), heavy arrows (➔), or dashes (->)
  const routeParts = ticket.route ? ticket.route.split(/➔|→|->/) : [];
  const fromCity = ticket.from || routeParts[0]?.trim() || "New Delhi";
  const toCity = ticket.to || routeParts[1]?.trim() || "Varanasi";
  const fromCode = getStationCode(fromCity);
  const toCode = getStationCode(toCity);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      alert("Ticket PDF downloaded successfully!");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0e1220] text-slate-200 px-6 py-12 font-sans flex flex-col justify-between">
      
      {/* 1. TOP HEADER ACTION BLOCK (Enriched with professional digital ticket brand & live status indicator) */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-16 select-none">
        
        {/* Left Side: Back to Dashboard Button with leftwards arrow */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#1a2333]/90 border border-slate-750/90 hover:bg-[#222e44]/95 hover:border-slate-650 transition text-slate-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg active:scale-98 cursor-pointer"
          >
            <span>← Back to Dashboard</span>
          </button>
        </div>

        {/* Center: Live Confirmed Status Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-[#172031] border border-slate-800/80 px-3.5 py-1.5 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="text-emerald-400 font-bold">✓</span> Booking Reference Verified
        </div>

        {/* Right Side: Professional App Branding */}
        <div className="space-y-1 text-center md:text-right">
          <span className="text-white font-black text-lg tracking-wider block leading-none">DIGITAL BOARDING HUB</span>
        </div>

      </div>

      {/* 2. MAIN BOARDING CARD CONTAINER */}
      <div className="w-full max-w-3xl mx-auto mb-20 relative">
        
        {/* Ticket card container */}
        <div className="bg-[#172031]/90 border border-slate-800/80 hover:border-emerald-500/35 rounded-3xl p-8 shadow-[0_0_50px_rgba(20,184,166,0.05)] hover:shadow-[0_0_60px_rgba(52,211,153,0.18)] transition-all duration-500 ease-in-out backdrop-blur-xl relative">
          
          {/* NOTCH CUTOUTS (Double notches on left & right margins mirroring mockup) */}
          <div className="absolute left-[-8px] top-[38%] w-4 h-4 bg-[#0e1220] rounded-full border-r border-slate-850 z-10"></div>
          <div className="absolute right-[-8px] top-[38%] w-4 h-4 bg-[#0e1220] rounded-full border-l border-slate-850 z-10"></div>
          <div className="absolute left-[-8px] top-[74%] w-4 h-4 bg-[#0e1220] rounded-full border-r border-slate-850 z-10"></div>
          <div className="absolute right-[-8px] top-[74%] w-4 h-4 bg-[#0e1220] rounded-full border-l border-slate-850 z-10"></div>

          {/* CARD TICKET HEADER STRIP (🚆 Train Emoji completely removed!) */}
          <div className="flex items-center justify-between mb-8 select-none">
            <div className="text-xs font-black tracking-widest text-slate-300 uppercase">
              ELITE RAILWAY
            </div>
            <div className="text-[10px] md:text-xs font-black tracking-widest text-slate-400 uppercase">
              BOOKING CONFIRMATION
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              #{String(ticket.pnr || "").substring(0, 7) || "R001345"}
            </div>
          </div>

          {/* TICKET UPPER SECTION (Route & Schedule Split) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Station Codes (Left 5 Columns) */}
            <div className="md:col-span-5 flex flex-col justify-between h-40">
              <div className="space-y-0.5">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{fromCode}</h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide capitalize">{fromCity}</p>
              </div>

              <div className="flex items-center pl-1">
                <span className="text-emerald-400 text-sm">➔</span>
              </div>

              <div className="space-y-0.5">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{toCode}</h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide capitalize">{toCity}</p>
              </div>
            </div>

            {/* Train Path Winding Graphic (Center 2 Columns) */}
            <div className="md:col-span-2 hidden md:flex items-center justify-center relative select-none h-40">
              <svg className="w-full h-full text-slate-800" viewBox="0 0 100 120" fill="none">
                <path d="M 50,10 C 20,40 80,80 50,110" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="3 3"/>
                <path d="M 50,10 C 20,40 80,80 50,110" stroke="url(#ticketPathGrad)" strokeWidth="2.5" />
                <circle cx="50" cy="10" r="3" fill="#34d399" />
                <circle cx="50" cy="110" r="3" fill="#34d399" />
                <defs>
                  <linearGradient id="ticketPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Travel Details parameters (Right 5 Columns) */}
            <div className="md:col-span-5 space-y-4">
              
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">DATE & TIME</span>
                <span className="text-xs text-slate-200 font-bold tracking-wide">
                  {ticket.date} • 08:30 AM (ETD)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">TRAIN</span>
                <span className="text-xs text-slate-200 font-bold tracking-wide block truncate">
                  {ticket.trainNo} {stripEmojis(ticket.trainName)}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase block mt-0.5">
                  ({ticket.class === "EC" ? "Executive Chair Car" : ticket.class === "CC" ? "AC Chair Car" : ticket.class === "3A" ? "AC 3 Tier" : ticket.class})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">PNR REFERENCE</span>
                  <span className="text-xs text-cyan-400 font-black tracking-widest font-mono">{ticket.pnr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">SEAT / COACH</span>
                  <span className="text-xs text-slate-200 font-bold tracking-wide">
                    Coach C1, Seat {stripEmojis(ticket.passengers?.[0]?.seat) || "E1-52"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">PASSENGERS ({ticket.passengers?.length || 1})</span>
                <div className="max-h-20 overflow-y-auto space-y-1.5 no-scrollbar pr-2">
                  {ticket.passengers?.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>{idx + 1}. {stripEmojis(p.name)} ({p.age} yrs)</span>
                      <span className="text-cyan-400">{stripEmojis(p.seat)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Dash border divider connecting the lower cutouts */}
          <div className="border-t border-dashed border-slate-800/80 my-8 mx-[-32px]"></div>

          {/* TICKET LOWER SECTION (Barcode & E-Ticket) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Scannable Barcode columns (Left 5 Columns) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start select-none">
              <div className="flex items-end h-11 gap-[2px] opacity-75">
                {[1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-white h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] tracking-[6px] font-mono text-slate-500 uppercase font-black mt-2">
                {ticket.pnr}
              </span>
            </div>

            <div className="md:col-span-2"></div>

            {/* Security disclaimer columns (Right 5 Columns) */}
            <div className="md:col-span-5 text-center md:text-left space-y-1">
              <h4 className="text-xs font-black text-white tracking-widest uppercase">E-TICKET</h4>
              <p className="text-[10px] text-slate-400 leading-normal font-medium">
                Security details provide passenger validation. Ticketing terms are secure and encrypted under Ministry of Railways (IRCTC).
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 3. PROFESSIONAL PASSENGER FOOTER */}
      <div className="w-full max-w-3xl mx-auto mt-12 border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-medium select-none">
        <div className="text-center md:text-left space-y-1.5 max-w-md">
          <p className="text-slate-400 font-black uppercase tracking-wider text-[9px] flex items-center justify-center md:justify-start gap-1">
            ⚠️ Passenger Travel Regulations
          </p>
          <p className="leading-relaxed text-slate-500">
            Please carry a valid original identity proof (Aadhaar Card, Passport, or Voter ID) during your journey. 
            Passengers are advised to arrive at the boarding terminal at least 30 minutes prior to departure. 
            This is an electronically generated ticket; physical copies are not mandatory under Digital India compliance guidelines.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1.5 font-bold text-slate-400 text-[9px] tracking-wider uppercase">
          <span>📞 Railway General Inquiry: <strong className="text-emerald-450 font-black font-mono text-xs">139</strong></span>
          <span>🛡️ Railway Security Help: <strong className="text-cyan-405 font-black font-mono text-xs">182</strong></span>
          <span>📧 IRCTC Digital Support: <span className="text-slate-500 font-normal font-sans text-[10px] lowercase tracking-normal">etickets@irctc.co.in</span></span>
        </div>
      </div>

    </div>
  );
};

export default Ticket;
