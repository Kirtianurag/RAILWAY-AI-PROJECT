import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first to view your booking history!");
      navigate("/login");
      return;
    }
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(stored);
  }, [navigate]);

  const cancelBooking = (pnr) => {
    const updated = bookings.map((b) =>
      b.pnr === pnr ? { ...b, status: "CANCELLED", cancelled: true } : b
    );

    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

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

  // Metric variables
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => !b.cancelled).length;
  const cancelledBookings = bookings.filter((b) => b.cancelled).length;

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
            <span className="text-white font-black text-lg tracking-wider block leading-none">TRAVEL RECEIPTS HUB</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center md:justify-end gap-1.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse inline-block"></span>
              IRCTC Verified Ledger
            </span>
          </div>

        </div>

        {/* 2. DYNAMIC WORKSPACE METRICS */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-12 w-full select-none">
          <div className="bg-[#172031]/80 border border-slate-800/80 rounded-2xl p-4 text-center shadow-lg hover:border-cyan-500/20 transition-all duration-300">
            <span className="text-[9px] md:text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Total Bookings</span>
            <span className="text-xl md:text-2xl font-black text-cyan-400 font-mono leading-none">{totalBookings}</span>
          </div>
          <div className="bg-[#172031]/80 border border-slate-800/80 rounded-2xl p-4 text-center shadow-lg hover:border-emerald-500/20 transition-all duration-300">
            <span className="text-[9px] md:text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Active Passes</span>
            <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono leading-none">{activeBookings}</span>
          </div>
          <div className="bg-[#172031]/80 border border-slate-800/80 rounded-2xl p-4 text-center shadow-lg hover:border-rose-500/20 transition-all duration-300">
            <span className="text-[9px] md:text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Cancelled Passes</span>
            <span className="text-xl md:text-2xl font-black text-rose-400 font-mono leading-none">{cancelledBookings}</span>
          </div>
        </div>

        {/* 3. BOOKINGS LIST GRID */}
        <div className="w-full max-w-4xl mx-auto space-y-6 mb-16">
          
          {bookings.length === 0 && (
            <div className="bg-[#172031]/50 border border-slate-855 rounded-3xl p-12 text-center shadow-lg max-w-2xl mx-auto select-none">
              <p className="text-slate-400 font-bold text-sm tracking-wide">No travel receipts found in your workspace ledger.</p>
              <button
                onClick={() => navigate("/book-ticket")}
                className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 transition text-white font-bold rounded-xl text-xs tracking-wider uppercase shadow active:scale-98 cursor-pointer"
              >
                Book New Ticket
              </button>
            </div>
          )}

          {bookings.map((b) => {
            const routeParts = b.route ? b.route.split(/➔|→|->/) : [];
            const fromCity = b.from || routeParts[0]?.trim() || "New Delhi";
            const toCity = b.to || routeParts[1]?.trim() || "Varanasi";
            const fromCode = getStationCode(fromCity);
            const toCode = getStationCode(toCity);

            return (
              <div
                key={b.pnr}
                className="bg-[#172031]/90 border border-slate-800/80 hover:border-cyan-500/35 rounded-3xl p-6 shadow-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.08)] transition-all duration-500 ease-in-out relative flex flex-col md:flex-row justify-between items-stretch gap-6 select-none"
              >
                
                {/* Notch Cutout Left & Right to mirror passenger pass receipt styles */}
                <div className="absolute left-[-6px] top-[45%] w-3 h-3 bg-[#0e1220] rounded-full border-r border-slate-850 z-10 hidden md:block"></div>
                <div className="absolute right-[-6px] top-[45%] w-3 h-3 bg-[#0e1220] rounded-full border-l border-slate-850 z-10 hidden md:block"></div>

                {/* Left Block: Trip Parameters */}
                <div className="flex-1 space-y-4">
                  
                  <div>
                    {/* Train Info */}
                    <h2 className="text-base font-black text-cyan-400 tracking-wide uppercase leading-tight">
                      {b.trainNo} {stripEmojis(b.trainName)}
                    </h2>
                    
                    {/* Route badges split */}
                    <div className="flex items-center gap-2.5 my-2.5">
                      <span className="text-[10px] font-black text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                        {fromCode}
                      </span>
                      <span className="text-slate-500 text-xs font-black">➔</span>
                      <span className="text-[10px] font-black text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-wider">
                        {toCode}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize font-bold">
                        ({fromCity} to {toCity})
                      </span>
                    </div>
                  </div>

                  {/* Class and Booking Status */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                    <span>Class: <strong className="text-emerald-400 uppercase font-bold">{b.class}</strong></span>
                    <span className="text-slate-700">•</span>
                    <span>
                      Status:{" "}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                        b.status === "CANCELLED" || b.cancelled
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : (b.status || "").startsWith("AVL")
                          ? "bg-emerald-500/10 text-emerald-405 border-emerald-500/20"
                          : (b.status || "").startsWith("RAC")
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-405 border-emerald-500/20"
                      }`}>
                        {b.cancelled ? "CANCELLED" : (b.status || "CONFIRMED")}
                      </span>
                    </span>
                  </div>

                  {/* Passengers Section */}
                  <div className="pt-3 border-t border-slate-800/50 max-w-md">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mb-2">👤 Passenger Ledger</span>
                    <div className="space-y-1.5">
                      {(b.passengers || []).map((p, i) => (
                        <p key={i} className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>{i + 1}. {stripEmojis(p.name)} ({p.age} yrs)</span>
                          <span className="text-slate-400 text-[10px] font-semibold">
                            Seat: <strong className="text-cyan-400 font-mono font-bold">{stripEmojis(p.seat)}</strong>
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Block: PNR Reference, Travel Date & Actions */}
                <div className="flex flex-col justify-between md:items-end min-w-[200px] border-t md:border-t-0 md:border-l border-slate-800/60 pt-4 md:pt-0 md:pl-6">
                  
                  <div className="space-y-2 text-left md:text-right">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider leading-none mb-1">PNR REFERENCE</span>
                      <span className="text-xs font-black tracking-widest text-cyan-400 font-mono leading-none block">{b.pnr}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider leading-none mb-1">TRAVEL DATE</span>
                      <span className="text-xs text-slate-200 font-bold leading-none block">{b.date}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6 md:mt-0 w-full">
                    <button
                      onClick={() =>
                        navigate("/ticket", {
                          state: { booking: b },
                        })
                      }
                      className="w-full bg-[#1a2333]/90 border border-slate-750/90 hover:bg-[#222e44]/95 hover:border-slate-650 transition text-slate-200 hover:text-white font-bold py-2 rounded-xl text-xs tracking-wider uppercase shadow active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      View Boarding Pass
                    </button>

                    {!b.cancelled && (
                      <button
                        onClick={() => cancelBooking(b.pnr)}
                        className="w-full bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:border-rose-600 transition text-rose-400 hover:text-white font-bold py-2 rounded-xl text-xs tracking-wider uppercase shadow active:scale-98 cursor-pointer text-center"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {b.cancelled && (
                      <div className="text-center bg-rose-950/20 border border-rose-900/30 text-rose-450 font-black py-2 rounded-xl text-[9px] tracking-widest uppercase">
                        Pass Cancelled
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* 4. PROFESSIONAL LEDGER FOOTER */}
      <div className="w-full max-w-4xl mx-auto border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-medium select-none">
        <div className="text-center md:text-left space-y-1.5 max-w-lg">
          <p className="text-slate-400 font-black uppercase tracking-wider text-[9px] flex items-center justify-center md:justify-start gap-1">
            ⚠️ Passenger Cancellation Notices & Regulations
          </p>
          <p className="leading-relaxed text-slate-500">
            Cancellations must be initiated at least 4 hours prior to scheduled train departure. 
            Refunds for cancelled digital tickets are processed within 3-5 business days directly back to the original source wallet. 
            IRCTC verified ledger services are covered under the Digital Rail Directive.
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

export default BookingHistory;
