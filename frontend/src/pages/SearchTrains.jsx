import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- HELPER ---------------- */

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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trains/search?from=${from}&to=${to}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to search trains. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1b4b,#020617)] text-white px-6 py-10">

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-400 hover:text-cyan-300 transition mb-6"
      >
        ← Back to Dashboard
      </button>

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          Search Trains
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time train discovery for your journey
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-6">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <div className="relative">
            <input
              list="from-stations"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From Station"
              className="w-full px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white placeholder-gray-400 outline-none"
            />
            <datalist id="from-stations">
              {stations.map(s => <option key={s.code} value={s.name} />)}
            </datalist>
          </div>

          <div className="relative">
            <input
              list="to-stations"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To Station"
              className="w-full px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white placeholder-gray-400 outline-none"
            />
            <datalist id="to-stations">
              {stations.map(s => <option key={s.code} value={s.name} />)}
            </datalist>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white outline-none"
          />

          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white outline-none"
          >
            <option className="bg-black" value="1A">1A</option>
            <option className="bg-black" value="2A">2A</option>
            <option className="bg-black" value="3A">3A</option>
            <option className="bg-black" value="SL">SL</option>
          </select>

          <button
            onClick={searchTrains}
            disabled={loading}
            className="rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-6xl mx-auto mt-12 space-y-6">

        {results.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            Enter stations and click search to see real trains
          </p>
        )}

        {results.map((train) => {
          const preparedTrain = enrichTrainForBooking(train);
          const displayFare = typeof train.fare === 'object' ? train.fare[cls] : train.fare;

          return (
            <div
              key={train.trainNo}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-cyan-400">
                  {train.name} ({train.trainNo})
                </h3>
                <p className="text-gray-400">
                  {train.from} → {train.to} • ⏱ {train.duration}
                </p>
                <p>Class: {cls}</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold text-cyan-400">
                  ₹{displayFare || "N/A"}
                </p>
                <button
                  onClick={() =>
                    navigate("/book-ticket", {
                      state: {
                        train: preparedTrain,
                        from,
                        to,
                        date,
                        cls,
                        source: "search",
                      },
                    })
                  }
                  className="mt-3 px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchTrains;
