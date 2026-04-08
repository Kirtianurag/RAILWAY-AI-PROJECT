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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-6 py-10">

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-600 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">💰 Fare Calculator</h1>
        <p className="text-gray-600 mt-2">
          Calculate total journey fare including passengers & tax
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* INPUTS */}
        <div className="space-y-5">

          {/* DISTANCE */}
          <input
            type="number"
            placeholder="Distance (in km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              bg-slate-800 text-white
              placeholder-gray-400
              focus:ring-2 focus:ring-cyan-500
              outline-none
              transition
            "
          />

          {/* CLASS */}
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              bg-slate-800 text-white
              focus:ring-2 focus:ring-cyan-500
              outline-none
            "
          >
            <option value="">Select Class</option>
            <option value="1A" className="bg-white text-black">First AC (1A)</option>
            <option value="2A" className="bg-white text-black">Second AC (2A)</option>
            <option value="3A" className="bg-white text-black">Third AC (3A)</option>
            <option value="SL" className="bg-white text-black">Sleeper (SL)</option>
            <option value="CC" className="bg-white text-black">Chair Car (CC)</option>
          </select>

          {/* PASSENGERS */}
          <input
            type="number"
            min="1"
            placeholder="Number of Passengers"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              bg-slate-800 text-white
              placeholder-gray-400
              focus:ring-2 focus:ring-cyan-500
              outline-none
            "
          />

          {/* BUTTON */}
          <button
            onClick={calculateFare}
            className="
              w-full bg-cyan-600 hover:bg-cyan-700
              text-white py-3 rounded-lg
              font-semibold text-lg
              hover:scale-[1.02]
              transition
            "
          >
            Calculate Fare
          </button>

          {error && (
            <p className="text-red-600 text-center font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* RESULT */}
        {fare && (
          <div
            className="
              mt-8 bg-gradient-to-br from-cyan-50 to-cyan-100
              rounded-xl p-6 text-center
              animate-fadeIn
            "
          >
            <h3 className="text-xl font-bold mb-4 text-cyan-800">
              Fare Details
            </h3>

            <div className="space-y-2 text-gray-700">
              <p>Fare per Passenger: ₹{fare.perPerson}</p>
              <p>Total Base Fare: ₹{fare.base}</p>
              <p>GST (5%): ₹{fare.gst}</p>
              <p className="text-2xl font-bold text-cyan-700">
                Total Fare: ₹{fare.total}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareCalculator;
