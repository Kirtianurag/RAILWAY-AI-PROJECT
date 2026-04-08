import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= DYNAMIC TRAIN DATA ================= */

const trainsDB = [
  {
    trainNo: "12953",
    trainName: "August Kranti Rajdhani",
    from: "Delhi",
    to: "Mumbai",
    class: "1A",
    baseSeats: 4,
    fare: 4500,
  },
  {
    trainNo: "12309",
    trainName: "Patna Rajdhani",
    from: "Delhi",
    to: "Patna",
    class: "1A",
    baseSeats: 3,
    fare: 3800,
  },
  {
    trainNo: "15635",
    trainName: "Guwahati Express",
    from: "Delhi",
    to: "Patna",
    class: "SL",
    baseSeats: 20,
    fare: 550,
  },
];

/* ================= STATION LIST ================= */

const stations = ["Delhi", "Mumbai", "Patna"];

/* ================= DYNAMIC AVAILABILITY ================= */

const generateAvailability = (train, selectedDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  const diffDays = Math.floor(
    (selected - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 1) {
    return `WL ${Math.floor(Math.random() * 5) + 1}`;
  } else if (diffDays <= 3) {
    return `RAC ${Math.floor(Math.random() * 3) + 1}`;
  } else {
    return `AVAILABLE ${train.baseSeats}`;
  }
};

/* ================= STATUS COLOR ================= */

const getStatusStyle = (status) => {
  if (!status) return "bg-gray-200 text-gray-700";

  const s = status.toUpperCase();
  if (s.includes("AVAILABLE")) return "bg-green-100 text-green-700";
  if (s.includes("RAC")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("WL")) return "bg-red-100 text-red-700";

  return "bg-gray-200 text-gray-700";
};

const SeatAvailability = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  /* ================= SEARCH ================= */

  const handleSearch = () => {
    setError("");

    if (!from || !to || !date) {
      setError("Please fill all fields");
      return;
    }

    if (from === to) {
      setError("Source and destination cannot be same");
      return;
    }

    const filtered = trainsDB
      .filter((train) => train.from === from && train.to === to)
      .map((train) => ({
        ...train,
        status: generateAvailability(train, date),
      }));

    setResults(filtered);
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
        <h1 className="text-3xl font-bold">
          🪑 Seat Availability
        </h1>
        <p className="text-gray-600 mt-2">
          Check real-time seat status by route and date
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            list="stations"
            placeholder="From Station"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-slate-800 text-white px-4 py-3 rounded-lg"
          />

          <input
            list="stations"
            placeholder="To Station"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-slate-800 text-white px-4 py-3 rounded-lg"
          />

          <datalist id="stations">
            {stations.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 text-white px-4 py-3 rounded-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg"
          >
            Search Trains
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-center mt-4 font-semibold">
            {error}
          </p>
        )}
      </div>

      {/* RESULTS */}
      <div className="max-w-5xl mx-auto space-y-4">
        {results.length === 0 && date && !error && (
          <p className="text-center text-gray-600">
            🚫 No trains found for selected route.
          </p>
        )}

        {results.map((train, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row justify-between items-center hover:scale-[1.02] transition"
          >
            <div>
              <h3 className="font-bold text-lg">
                {train.trainName} ({train.trainNo})
              </h3>
              <p className="text-sm text-gray-600">
                {train.from} → {train.to}
              </p>
              <p className="text-sm mt-1">
                Class: <span className="font-semibold">{train.class}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span
                className={`px-5 py-2 rounded-full font-bold ${getStatusStyle(
                  train.status
                )}`}
              >
                {train.status}
              </span>

              <button
                onClick={() => {
                  if (train.status.startsWith("WL")) {
                    alert("Cannot book ticket. Waiting List only.");
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
                        baseSeats: { [train.class]: train.baseSeats },
                        fare: { [train.class]: train.fare },
                      },
                      from: train.from,
                      to: train.to,
                      date: date,
                    },
                  });
                }}
                disabled={train.status.startsWith("WL")}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  train.status.startsWith("WL")
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatAvailability;
