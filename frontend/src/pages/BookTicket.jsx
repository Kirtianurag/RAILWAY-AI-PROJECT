import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BookTicket = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first to access the booking page!");
      navigate("/login");
    }
  }, [navigate]);

  const passedTrain = state?.train;

  const [selectedTrain, setSelectedTrain] = useState(passedTrain || null);
  const [cls, setCls] = useState(state?.cls || "");
  const [passengers, setPassengers] = useState(1);
  const [details, setDetails] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState("No Preference");

  // Reset coach preference whenever traveling class changes
  useEffect(() => {
    setSelectedCoach("No Preference");
  }, [cls]);

  // Read date of journey passed from search page (default to tomorrow if not set)
  const journeyDate = state?.date || new Date(Date.now() + 86400000).toISOString().split("T")[0];

  /* ✅ FIX 1: If no train passed, prevent blank crash */
  useEffect(() => {
    if (passedTrain) {
      setSelectedTrain(passedTrain);
    }
  }, [passedTrain]);

  // Ensure travelling class is valid for the loaded train
  useEffect(() => {
    if (selectedTrain) {
      const classes = selectedTrain.classes || ["SL", "3A", "2A", "1A"];
      if (!cls || !classes.includes(cls)) {
        setCls(classes[0]);
      }
    }
  }, [selectedTrain, cls]);

  /* ✅ FIX 2: Always regenerate passenger detail fields with Berth & Gender preferences */
  useEffect(() => {
    const newDetails = Array.from({ length: passengers }, (_, i) => ({
      name: details[i]?.name || "",
      age: details[i]?.age || "",
      gender: details[i]?.gender || "Male",
      berth: details[i]?.berth || "No Preference"
    }));
    setDetails(newDetails);
  }, [passengers]);

  // Dynamic receipt calculations
  const singleFare = typeof selectedTrain?.fare === "object"
    ? selectedTrain.fare[cls || "SL"] || selectedTrain.fare["SL"] || 450
    : selectedTrain?.fare || 1500;

  const baseFareTotal = singleFare * passengers;
  const reservationFee = 60 * passengers;
  const superfastCharge = 45 * passengers;
  const convenienceFee = 15; // flat
  const totalFare = baseFareTotal + reservationFee + superfastCharge + convenienceFee;

  const handleProceedToPayment = () => {
    if (!selectedTrain) {
      alert("No train selected");
      return;
    }

    if (!cls) {
      alert("Please select class");
      return;
    }

    if (details.some((p) => !p.name || !p.age)) {
      alert("Please fill name and age for all passengers");
      return;
    }

    const status = selectedTrain.availability?.[cls] || "AVL 10";
    const isConfirmed = status.startsWith("AVL") || status === "CONFIRMED";

    const enrichedPassengers = details.map((p, index) => {
      let assignedSeat = "";
      if (isConfirmed) {
         const coachOptions = getCoachOptions(cls);
         const coach = selectedCoach === "No Preference"
           ? (coachOptions[0] || "S1")
           : selectedCoach;
         assignedSeat = `${coach}-${Math.floor(Math.random() * 60) + 1} (${p.berth})`;
      } else {
         const [type, num] = status.split(" ");
         assignedSeat = `${type} ${parseInt(num || "1") + index}`;
      }
      return { ...p, seat: assignedSeat };
    });

    const bookingData = {
      trainName: selectedTrain.name,
      trainNo: selectedTrain.trainNo,
      route: `${selectedTrain.from} → ${selectedTrain.to}`,
      class: cls,
      passengers: enrichedPassengers,
      fare: singleFare,
      status: status,
      date: journeyDate,
      pnr: Math.floor(1000000000 + Math.random() * 9000000000),
    };

    navigate("/payment", {
      state: { booking: bookingData },
    });
  };

  /* ✅ FIX 3: If user comes directly from dashboard (no train passed) */
  if (!selectedTrain) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center font-sans">
        <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-12 text-center max-w-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-850 flex items-center justify-center mb-4 text-slate-400">
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
          <h2 className="text-xl font-bold text-white mb-2">No Train Selected</h2>
          <p className="text-slate-400 text-xs mb-6 text-center leading-relaxed">
            Please search for available trains on our console and select one to proceed with your booking.
          </p>
          <button
            onClick={() => navigate("/search-trains")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/10 cursor-pointer text-sm"
          >
            Search Trains
          </button>
        </div>
      </div>
    );
  }

  const getCoachOptions = (ticketClass) => {
    switch (ticketClass) {
      case "1A":
        return ["H1", "H2"];
      case "2A":
        return ["A1", "A2", "A3"];
      case "3A":
        return ["B1", "B2", "B3", "B4", "B5"];
      case "SL":
        return ["S1", "S2", "S3", "S4", "S5", "S6"];
      case "CC":
        return ["C1", "C2", "C3", "C4", "C5"];
      case "EC":
        return ["E1", "E2"];
      default:
        return ["C1", "C2"];
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 px-6 py-8 font-sans">
      
      {/* HEADER STRIP */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate("/search-trains")}
          className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          ← Back to Search
        </button>
      </div>

      {/* CHECKOUT STEPPER PROGRESS */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#161d30] border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs md:text-sm font-semibold">
        <div className="flex items-center gap-2 text-blue-400">
          <span className="w-6 h-6 rounded-full bg-blue-500 text-[#0b0f19] flex items-center justify-center font-bold text-xs">1</span>
          <span>Journey Review</span>
        </div>
        <div className="h-0.5 bg-slate-800 flex-1 mx-4 hidden md:block"></div>
        <div className="flex items-center gap-2 text-slate-100">
          <span className="w-6 h-6 rounded-full bg-blue-500 text-[#0b0f19] flex items-center justify-center font-bold text-xs">2</span>
          <span>Passenger Details</span>
        </div>
        <div className="h-0.5 bg-slate-800 flex-1 mx-4 hidden md:block"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs">3</span>
          <span>Secure Payment</span>
        </div>
      </div>

      {/* MAIN CHECKOUT SPLIT LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: FORMS & TRAIN CARD (8 Columns) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Minimalist Train Summary Panel instead of Photograph Card */}
          <div className="bg-[#161d30] border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                ⭐ {selectedTrain.rating || "4.8"} Rated Service
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">{selectedTrain.name}</h2>
              <p className="text-xs text-blue-400 font-semibold">Train No: {selectedTrain.trainNo} • Speed-Link</p>
              <p className="text-sm text-slate-300 font-bold pt-1">
                {selectedTrain.from} → {selectedTrain.to}
              </p>
            </div>
            
            <div className="bg-[#0b0f19] px-5 py-3.5 border border-slate-800 rounded-xl text-center min-w-[140px] shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Date of Journey</span>
              <span className="text-sm font-bold text-slate-200 block mt-1">{journeyDate}</span>
            </div>
          </div>

          {/* Form Preferences */}
          <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              🛠️ Ticket Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Select Class */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Class of Ticket</label>
                <select
                  value={cls}
                  onChange={(e) => setCls(e.target.value)}
                  className="w-full p-3 bg-[#0b0f19] border border-slate-800 text-white rounded-xl outline-none focus:border-blue-500 transition-colors text-sm font-semibold appearance-none cursor-pointer"
                >
                  {selectedTrain.classes?.map((c) => (
                    <option className="bg-[#0b0f19]" key={c} value={c}>{c}</option>
                  )) || (
                    <>
                      <option value="SL">SL (Sleeper)</option>
                      <option value="3A">3A (Third AC)</option>
                      <option value="2A">2A (Second AC)</option>
                      <option value="1A">1A (First AC)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Number of Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full p-3 bg-[#0b0f19] border border-slate-800 text-white rounded-xl outline-none focus:border-blue-500 transition-colors text-sm font-semibold appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option className="bg-[#0b0f19]" key={n} value={n}>
                      {n} {n === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coach Preference */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Preferred Coach</label>
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="w-full p-3 bg-[#0b0f19] border border-slate-800 text-white rounded-xl outline-none focus:border-blue-500 transition-colors text-sm font-semibold appearance-none cursor-pointer"
                >
                  <option className="bg-[#0b0f19]" value="No Preference">No Preference (Any)</option>
                  {getCoachOptions(cls).map((cOption) => (
                    <option className="bg-[#0b0f19]" key={cOption} value={cOption}>
                      Coach {cOption}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Passenger Information */}
          <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              👤 Passenger Details
            </h3>

            {details.map((p, i) => (
              <div key={i} className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <h4 className="text-xs font-bold text-blue-400">Passenger #{i + 1}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Seat {i+1} Selection</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Name field */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                    <input
                      value={p.name}
                      placeholder="Enter passenger name"
                      className="w-full px-3 py-2 bg-[#161d30] border border-slate-800 rounded-lg text-white placeholder-slate-600 outline-none focus:border-blue-500 transition text-sm font-semibold"
                      onChange={(e) => {
                        const updated = [...details];
                        updated[i].name = e.target.value;
                        setDetails(updated);
                      }}
                    />
                  </div>

                  {/* Age field */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Age</label>
                    <input
                      value={p.age}
                      placeholder="Age"
                      type="number"
                      min="1"
                      max="120"
                      className="w-full px-3 py-2 bg-[#161d30] border border-slate-800 rounded-lg text-white placeholder-slate-600 outline-none focus:border-blue-500 transition text-sm font-semibold"
                      onChange={(e) => {
                        const updated = [...details];
                        updated[i].age = e.target.value;
                        setDetails(updated);
                      }}
                    />
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Gender</label>
                    <select
                      value={p.gender}
                      onChange={(e) => {
                        const updated = [...details];
                        updated[i].gender = e.target.value;
                        setDetails(updated);
                      }}
                      className="w-full px-3 py-2 bg-[#161d30] border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer"
                    >
                      <option value="Male" className="bg-[#161d30]">Male</option>
                      <option value="Female" className="bg-[#161d30]">Female</option>
                      <option value="Other" className="bg-[#161d30]">Other</option>
                    </select>
                  </div>
                </div>

                {/* Berth Preference dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Berth (Seat) Preference</label>
                    <select
                      value={p.berth}
                      onChange={(e) => {
                        const updated = [...details];
                        updated[i].berth = e.target.value;
                        setDetails(updated);
                      }}
                      className="w-full px-3 py-2 bg-[#161d30] border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer"
                    >
                      <option value="No Preference" className="bg-[#161d30]">No Preference</option>
                      <option value="Lower Berth 🪟" className="bg-[#161d30]">Lower Berth (Window preferred)</option>
                      <option value="Middle Berth 🛌" className="bg-[#161d30]">Middle Berth</option>
                      <option value="Upper Berth 🧗" className="bg-[#161d30]">Upper Berth</option>
                      <option value="Side Lower 🎒" className="bg-[#161d30]">Side Lower</option>
                      <option value="Side Upper 🧗" className="bg-[#161d30]">Side Upper</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ================= RIGHT COLUMN: FARE BREAKDOWN & CHECKOUT (4 Columns) ================= */}
        <div className="lg:col-span-4">
          <div className="bg-[#161d30] border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6 space-y-6">
            
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>🧾 Fare Summary</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase font-bold">Receipt</span>
            </h3>

            {/* Price List */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Base Ticket Fares ({passengers} pax)</span>
                <span className="font-semibold text-slate-200">₹{baseFareTotal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Reservation Fee</span>
                <span className="font-semibold text-slate-200">₹{reservationFee}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Superfast Surcharges</span>
                <span className="font-semibold text-slate-200">₹{superfastCharge}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>IRCTC Convenience Flat Fee</span>
                <span className="font-semibold text-slate-200">₹{convenienceFee}</span>
              </div>
              
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-base font-bold text-white">
                <span>Total Payable Amount</span>
                <span className="text-amber-500 text-xl">₹{totalFare}</span>
              </div>
            </div>

            {/* Travel Insurance Banner */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
              <span className="text-lg">🛡️</span>
              <div>
                <p className="text-xs font-bold text-slate-200">Travel Insurance Included</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Complimentary ₹10 Lakhs accident coverage included automatically.</p>
              </div>
            </div>

            {/* Checkout Trigger */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleProceedToPayment}
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition shadow-lg shadow-green-600/10 hover:shadow-green-600/20 active:scale-98 cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment</span>
                <span>→</span>
              </button>

              {/* Padlock Secure Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <span>🔒</span>
                <span>SSL Secure Encrypted Transaction</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default BookTicket;
