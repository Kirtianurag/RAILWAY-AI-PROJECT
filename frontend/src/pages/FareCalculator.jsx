import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= RATE PER KM (₹) ================= */
const fareRates = {
  "1A": 5.5,
  "2A": 4.0,
  "3A": 2.8,
  "SL": 1.2,
  "CC": 2.0,
};

const FareCalculator = () => {
  const navigate = useNavigate();

  const [distance, setDistance] = useState("");
  const [travelClass, setTravelClass] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [fare, setFare] = useState(null);
  const [error, setError] = useState("");

  const calculateFare = () => {
    setError("");
    setFare(null);

    if (!distance || distance <= 0) {
      setError("Please enter a valid distance");
      return;
    }

    if (!travelClass) {
      setError("Please select a travel class");
      return;
    }

    if (!passengers || passengers <= 0) {
      setError("Please enter valid number of passengers");
      return;
    }

    const basePerPerson = distance * fareRates[travelClass];
    const totalBase = basePerPerson * passengers;
    const gst = totalBase * 0.05;
    const totalFare = Math.round(totalBase + gst);

    setFare({
      perPerson: basePerPerson.toFixed(2),
      base: totalBase.toFixed(2),
      gst: gst.toFixed(2),
      total: totalFare,
    });
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
            <span className="text-white font-black text-lg tracking-wider block leading-none">FARE COMPUTATION NODE</span>
          </div>

        </div>

        {/* 2. MAIN COMPUTATION BOARD */}
        <div className="max-w-xl mx-auto bg-[#172031]/90 border border-slate-800/80 hover:border-emerald-500/35 rounded-3xl p-8 shadow-lg hover:shadow-[0_0_50px_rgba(20,184,166,0.08)] transition-all duration-500 ease-in-out relative select-none">
          
          {/* Left & Right Notches to blend receipt layouts */}
          <div className="absolute left-[-6px] top-[40%] w-3 h-3 bg-[#0e1220] rounded-full border-r border-slate-850 z-10"></div>
          <div className="absolute right-[-6px] top-[40%] w-3 h-3 bg-[#0e1220] rounded-full border-l border-slate-850 z-10"></div>

          {/* INPUT FORM BLOCK */}
          <div className="space-y-5">
            
            <h2 className="text-sm font-black text-cyan-400 tracking-wider uppercase text-center mb-6">
              Fare Calculator
            </h2>

            {/* Distance Input */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Travel Distance</span>
              <input
                type="number"
                placeholder="Distance (in km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold placeholder-slate-500 outline-none"
              />
            </div>

            {/* Travel Class Dropdown */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Traveling Class</span>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold outline-none appearance-none"
              >
                <option value="" className="text-slate-550">Select Class</option>
                <option value="1A">First AC (1A)</option>
                <option value="2A">Second AC (2A)</option>
                <option value="3A">Third AC (3A)</option>
                <option value="SL">Sleeper Class (SL)</option>
                <option value="CC">AC Chair Car (CC)</option>
              </select>
            </div>

            {/* Passenger Count Input */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Passenger Count</span>
              <input
                type="number"
                min="1"
                placeholder="Number of Passengers"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full bg-[#0e1220] border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 transition text-white px-4 py-3 rounded-xl text-sm font-semibold placeholder-slate-500 outline-none"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateFare}
              className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase shadow active:scale-98 cursor-pointer text-center"
            >
              Calculate Fare
            </button>

            {error && (
              <p className="text-rose-500 text-center text-xs font-bold uppercase tracking-wider mt-4">
                {error}
              </p>
            )}

          </div>

          {/* DYNAMIC RECEIPT BREAKDOWN CONTAINER */}
          {fare && (
            <div className="mt-8 pt-6 border-t border-dashed border-slate-800/80 animate-fadeIn">
              
              <h3 className="text-xs font-black text-cyan-400 tracking-widest uppercase text-center mb-4">
                Fare Receipt Summary
              </h3>

              <div className="bg-[#0e1220]/50 border border-slate-850 rounded-2xl p-5 space-y-3 font-semibold text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-455 font-medium">Per Passenger Base</span>
                  <span className="text-slate-200 font-mono">₹{fare.perPerson}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-455 font-medium">Total Passengers Base ({passengers})</span>
                  <span className="text-slate-200 font-mono">₹{fare.base}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-455 font-medium">GST Tax Levy (5%)</span>
                  <span className="text-slate-200 font-mono">₹{fare.gst}</span>
                </div>
                <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center">
                  <span className="text-xs font-black text-white uppercase tracking-wider">Gross Total Fare</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">₹{fare.total}</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3. HELPLINES & TERMS FOOTER */}
      <div className="w-full max-w-4xl mx-auto border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-medium select-none">
        <div className="text-center md:text-left space-y-1.5 max-w-lg">
          <p className="text-slate-400 font-black uppercase tracking-wider text-[9px] flex items-center justify-center md:justify-start gap-1">
            ⚠️ Automated Fare Computation Terms
          </p>
          <p className="leading-relaxed text-slate-500">
            Calculated rates are determined strictly based on Indian Railway tariff guidelines. 
            Base rates per kilometer depend on class classifications (1A, 2A, 3A, SL, CC). 
            GST levy represents official tax parameters governed by government digital travel directives.
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

export default FareCalculator;
