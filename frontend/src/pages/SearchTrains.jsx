import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- MOCK DATA ---------------- */

const stations = [
  "Delhi",
  "Mumbai",
  "Patna",
  "Kolkata",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Varanasi",
];

const trains = [
  {
    trainNo: "12951",
    name: "Rajdhani Express",
    from: "Delhi",
    to: "Mumbai",
    duration: "15h 30m",
    fare: { "1A": 4500, "2A": 3200, "3A": 2300 },
  },
  {
    trainNo: "12953",
    name: "August Kranti Rajdhani",
    from: "Delhi",
    to: "Mumbai",
    duration: "16h 00m",
    fare: { "1A": 4700, "2A": 3300, "3A": 2400 },
  },
  {
    trainNo: "12309",
    name: "Patna Rajdhani",
    from: "Delhi",
    to: "Patna",
    duration: "12h 10m",
    fare: { "1A": 3800, "2A": 2600, "3A": 1900 },
  },
  {
    trainNo: "15647",
    name: "Lokmanya Express",
    from: "Delhi",
    to: "Mumbai",
    duration: "23h 40m",
    fare: { "1A": 3900, "2A": 2500, "3A": 1800, "SL": 520 },
  },
  {
    trainNo: "19019",
    name: "Dehradun Express",
    from: "Delhi",
    to: "Mumbai",
    duration: "24h 10m",
    fare: { "1A": 3600, "2A": 2300, "3A": 1600, "SL": 480 },
  },
  {
    trainNo: "14224",
    name: "Budhpurnima Express",
    from: "Varanasi",
    to: "Patna",
    duration: "4h 10m",
    fare: { "2A": 1300, "3A": 700, "SL": 350 },
  },
  {
    trainNo: "19021",
    name: "Saramjeevi Express",
    from: "Delhi",
    to: "Varanasi",
    duration: "13h 25m",
    fare: { "1A": 2770, "2A": 1665, "3A": 1190, "SL": 480 },
  },
];

/* ---------------- HELPER ---------------- */

const enrichTrainForBooking = (train) => {
  const classes = Object.keys(train.fare);
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

  const searchTrains = () => {
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

    if (!stations.includes(from) || !stations.includes(to)) {
      alert("Please select a valid station");
      return;
    }

    const filtered = trains.filter(
      (t) =>
        t.from === from &&
        t.to === to &&
        t.fare[cls] !== undefined
    );

    setResults(filtered);
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
          AI powered train discovery for your journey
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] p-6">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <input
            list="stations"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From Station"
            className="px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white placeholder-gray-400 outline-none"
          />

          <input
            list="stations"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To Station"
            className="px-4 py-3 rounded-xl bg-[#020617]/80 border border-white/10 text-white placeholder-gray-400 outline-none"
          />

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
            className="rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:scale-105 transition"
          >
            Search
          </button>
        </div>

        <datalist id="stations">
          {stations.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {/* RESULTS */}
      <div className="max-w-6xl mx-auto mt-12 space-y-6">

        {results.length === 0 && date && (
          <p className="text-center text-yellow-400">
            No trains available with <strong>{cls}</strong> class
          </p>
        )}

        {results.map((train) => {
          const preparedTrain = enrichTrainForBooking(train);

          return (
            <div
              key={train.trainNo}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-cyan-400">
                  {train.name}
                </h3>
                <p className="text-gray-400">
                  {train.from} → {train.to} • ⏱ {train.duration}
                </p>
                <p>Class: {cls}</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold text-cyan-400">
                  ₹{train.fare[cls]}
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
