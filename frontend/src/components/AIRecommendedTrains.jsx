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

  const handleBooking = (train) => {
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
          duration: train.duration,
          days: train.days,
          fare: train.fare,
          classes: ["1A", "2A", "3A", "SL"],
          availability: {
            "1A": "AVL 2",
            "2A": "RAC 3",
            "3A": "WL 4",
            "SL": "AVL 6",
          }
        }
      }
    });
  };

  if (loading) return <div className="mt-20 text-center text-cyan-400 animate-pulse">🤖 AI is curating recommendations...</div>;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🚂 Recommended Trains
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {recommendedTrains.map((train) => {
          const displayFare = typeof train.fare === 'object' 
            ? `Starts at ₹${train.fare["SL"] || train.fare["3A"] || Object.values(train.fare)[0]}` 
            : `₹${train.fare}`;

          return (
          <div
            key={train.trainNo}  
            className="min-w-[300px] max-w-[300px] min-h-[500px] h-auto flex flex-col rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg shadow-xl"
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

              <div className="mt-4 space-y-1 text-sm text-gray-300">
                <p>⭐ Rating: <span className="text-cyan-400">{train.rating}</span></p>
                <p>💰 Fare: <span className="text-green-400">{displayFare}</span></p>
                <p>📍 Route: {train.from} → {train.to}</p>
                <p>🕒 Departure: {train.departure || "N/A"}</p>
                <p>⏱ Duration: {train.duration || train.time}</p>
                <p>📅 Runs: {train.days}</p>
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
