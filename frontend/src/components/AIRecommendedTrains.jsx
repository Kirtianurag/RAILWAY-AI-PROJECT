import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AIRecommendedTrains = () => {
  const navigate = useNavigate();
  const [recommendedTrains, setRecommendedTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/recommended`);
        const data = await response.json();
        setRecommendedTrains(data);
      } catch (error) {
        console.error("Failed to fetch recommended trains:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  const getTrainClassesAndAvailability = (trainName, baseFare) => {
    const name = trainName.toLowerCase();
    
    // 1. Vande Bharat, Shatabdi, Tejas (AC Chair Cars)
    if (name.includes("vande bharat") || name.includes("shatabdi") || name.includes("tejas")) {
      const classes = ["CC", "EC"];
      const rawFare = typeof baseFare === "object" ? baseFare : {};
      const cc = Math.round(rawFare["CC"] || (typeof baseFare === "number" ? baseFare : 980));
      const ec = Math.round(rawFare["EC"] || cc * 1.85 || 1800);
      return {
        classes,
        fare: { "CC": cc, "EC": ec },
        availability: {
          "CC": "AVL 42",
          "EC": "AVL 8"
        }
      };
    }
    
    // 2. Rajdhani (AC Sleeper only)
    if (name.includes("rajdhani")) {
      const classes = ["3A", "2A", "1A"];
      const rawFare = typeof baseFare === "object" ? baseFare : {};
      const base3A = Math.round(rawFare["3A"] || (typeof baseFare === "number" ? baseFare : 1600));
      const base2A = Math.round(rawFare["2A"] || base3A * 1.45 || 2300);
      const base1A = Math.round(rawFare["1A"] || base3A * 2.15 || 3400);
      return {
        classes,
        fare: { "3A": base3A, "2A": base2A, "1A": base1A },
        availability: {
          "3A": "AVL 18",
          "2A": "RAC 4",
          "1A": "AVL 2"
        }
      };
    }
    
    // 3. Default Mail / Express (Standard suite)
    const classes = ["SL", "3A", "2A", "1A"];
    const rawFare = typeof baseFare === "object" ? baseFare : {};
    const baseSL = Math.round(rawFare["SL"] || (typeof baseFare === "number" ? baseFare : 480));
    const base3A = Math.round(rawFare["3A"] || baseSL * 2.6 || 1200);
    const base2A = Math.round(rawFare["2A"] || baseSL * 3.7 || 1700);
    const base1A = Math.round(rawFare["1A"] || baseSL * 5.3 || 2400);
    return {
      classes,
      fare: { "SL": baseSL, "3A": base3A, "2A": base2A, "1A": base1A },
      availability: {
        "SL": "AVL 32",
        "3A": "WL 12",
        "2A": "RAC 2",
        "1A": "AVL 3"
      }
    };
  };

  const handleBooking = (train) => {
    const config = getTrainClassesAndAvailability(train.name, train.fare);
    navigate("/book-ticket", {
      state: {
        autoSelect: true,
        train: {
          trainNo: train.trainNo,
          name: train.name,
          from: train.from,
          to: train.to,
          departure: train.departure,
          arrival: train.arrival,
          duration: train.duration || train.time,
          days: train.days,
          fare: config.fare,
          classes: config.classes,
          availability: config.availability
        }
      }
    });
  };

  if (loading) return <div className="mt-20 text-center text-cyan-400 animate-pulse">🤖 AI is creating recommendations...</div>;

  return (
    <div className="mt-20">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-slate-350 select-none">
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 22h14M5 2h14M19 6H5a3 3 0 00-3 3v8a3 3 0 003 3h14a3 3 0 003-3V9a3 3 0 00-3-3zM8 6V4h8v2M8 12a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
        Recommended Trains
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {recommendedTrains.map((train) => {
          const displayFare = typeof train.fare === 'object' 
            ? `Starts at ₹${train.fare["SL"] || train.fare["3A"] || Object.values(train.fare)[0]}` 
            : `₹${train.fare}`;

          return (
          <div
            key={train.trainNo}  
            className="min-w-[300px] max-w-[300px] min-h-[500px] h-auto flex flex-col rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg shadow-xl hover:-translate-y-3 hover:shadow-[0_15px_30px_rgba(6,182,212,0.2)] transition-all duration-300 cursor-pointer border border-transparent hover:border-white/10"
          >
            <img
              src={train.image}
              alt={train.name}
              className="w-full h-48 object-cover shrink-0"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1581008083833-28827eb0d39e?q=80&w=1000&auto=format&fit=crop"; // Fallback realistic Indian Train image
              }}
            />

            <div className="p-5 flex flex-col flex-1">

              <h3 className="text-xl font-bold line-clamp-2">{train.name}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{train.desc}</p>

              <div className="mt-4 space-y-1.5 text-sm text-gray-300">
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Rating:</span> <span className="text-cyan-400">{train.rating}</span></p>
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Fare:</span> <span className="text-green-400 font-bold">{displayFare}</span></p>
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Route:</span> <span className="text-slate-200">{train.from} → {train.to}</span></p>
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Departure:</span> <span className="text-slate-200">{train.departure || "N/A"}</span></p>
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Duration:</span> <span className="text-slate-200">{train.duration || train.time}</span></p>
                <p className="flex items-center gap-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Runs:</span> <span className="text-slate-200">{train.days}</span></p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={() => handleBooking(train)}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendedTrains;
