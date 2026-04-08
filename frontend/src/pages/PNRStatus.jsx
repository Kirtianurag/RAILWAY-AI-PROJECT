import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= BERTH RULES (CORRECT) ================= */
const berthByClass = {
  "1A": ["LB", "UB"],
  "2A": ["LB", "UB", "SL", "SU"],
  "3A": ["LB", "MB", "UB", "SL", "SU"],
  "SL": ["LB", "MB", "UB", "SL", "SU"],
  "CC": ["WINDOW", "AISLE"],
};

/* ================= MOCK PNR DATA ================= */
const pnrData = {
  "1234567890": {
    trainName: "Rajdhani Express",
    trainNo: "12951",
    from: "Delhi",
    to: "Mumbai",
    date: "28 Dec 2025",
    class: "1A",
    passengers: [
      { name: "Rahul Kumar", status: "CONFIRMED", berth: "LB" },
      { name: "Anita Sharma", status: "CONFIRMED", berth: "UB" },
    ],
  },

  "9876543210": {
    trainName: "Patna Rajdhani",
    trainNo: "12309",
    from: "Delhi",
    to: "Patna",
    date: "29 Dec 2025",
    class: "2A",
    passengers: [
      { name: "Amit Singh", status: "RAC", berth: "SL" },
      { name: "Suman Devi", status: "WL 2", berth: "SU" },
    ],
  },

  "4567891230": {
    trainName: "Garib Rath",
    trainNo: "12909",
    from: "Mumbai",
    to: "Ahmedabad",
    date: "30 Dec 2025",
    class: "3A",
    passengers: [
      { name: "Rohit Verma", status: "CONFIRMED", berth: "MB" },
      { name: "Pooja Singh", status: "CONFIRMED", berth: "SU" },
    ],
  },
};

/* ================= STATUS COLOR ================= */
const getStatusStyle = (status) => {
  if (status.includes("CONFIRMED")) return "bg-green-100 text-green-700";
  if (status.includes("RAC")) return "bg-yellow-100 text-yellow-800";
  if (status.includes("WL")) return "bg-red-100 text-red-700";
  return "bg-gray-200 text-gray-700";
};

/* ================= BERTH COLOR ================= */
const getBerthStyle = (berth) => {
  switch (berth) {
    case "LB":
      return "bg-blue-100 text-blue-700";
    case "MB":
      return "bg-purple-100 text-purple-700";
    case "UB":
      return "bg-indigo-100 text-indigo-700";
    case "SL":
      return "bg-teal-100 text-teal-700";
    case "SU":
      return "bg-pink-100 text-pink-700";
    case "WINDOW":
      return "bg-green-100 text-green-700";
    case "AISLE":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

/* ================= VALIDATION ================= */
const isValidBerth = (classType, berth) => {
  return berthByClass[classType]?.includes(berth);
};

const PNRStatus = () => {
  const navigate = useNavigate();

  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkPNR = () => {
    setError("");
    setResult(null);

    if (pnr.length !== 10) {
      setError("PNR must be exactly 10 digits");
      return;
    }

    if (!pnrData[pnr]) {
      setError("PNR not found. Please check and try again.");
      return;
    }

    setResult(pnrData[pnr]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-10">

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-indigo-700 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">📄 PNR Status</h1>
        <p className="text-gray-600 mt-2">
          View booking status, berth & passenger details
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter 10-digit PNR Number"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          maxLength={10}
          className="
            w-full px-4 py-3 rounded-lg
            bg-slate-800 text-white
            placeholder-gray-400
            focus:ring-2 focus:ring-indigo-500
            outline-none transition
          "
        />

        <button
          onClick={checkPNR}
          className="
            w-full mt-4 bg-indigo-600 hover:bg-indigo-700
            text-white py-3 rounded-lg font-semibold text-lg
            hover:scale-[1.02] transition
          "
        >
          Check PNR Status
        </button>

        {error && (
          <p className="text-red-600 text-center font-semibold mt-4">
            {error}
          </p>
        )}

        {/* RESULT */}
        {result && (
          <div className="mt-8 animate-fadeIn">

            <h3 className="text-xl font-bold text-indigo-700">
              {result.trainName} ({result.trainNo})
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              {result.from} → {result.to} | {result.date} | Class: {result.class}
            </p>

            {/* PASSENGERS */}
            <div className="space-y-3">
              {result.passengers.map((p, index) => (
                <div
                  key={index}
                  className="
                    flex justify-between items-center
                    bg-white rounded-lg p-4 shadow
                    hover:shadow-md transition
                  "
                >
                  <span className="font-semibold">{p.name}</span>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusStyle(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        isValidBerth(result.class, p.berth)
                          ? getBerthStyle(p.berth)
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.berth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PNRStatus;
