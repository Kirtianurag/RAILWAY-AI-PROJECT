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
  const [cls, setCls] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [details, setDetails] = useState([]);

  /* ✅ FIX 1: If no train passed, prevent blank crash */
  useEffect(() => {
    if (passedTrain) {
      setSelectedTrain(passedTrain);
    }
  }, [passedTrain]);

  /* ✅ FIX 2: Always regenerate passenger detail fields properly */
  useEffect(() => {
    const newDetails = Array.from({ length: passengers }, (_, i) => ({
      name: details[i]?.name || "",
      age: details[i]?.age || "",
    }));
    setDetails(newDetails);
  }, [passengers]);

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
      alert("Please fill passenger details");
      return;
    }

    const status = selectedTrain.availability?.[cls] || "AVL 10";
    const isConfirmed = status.startsWith("AVL") || status === "CONFIRMED";

    const enrichedPassengers = details.map((p, index) => {
      let assignedSeat = "";
      if (isConfirmed) {
         const coach = cls === "1A" ? "H1" : cls === "2A" ? "A1" : cls === "3A" ? "B1" : "S1";
         assignedSeat = `${coach}-${Math.floor(Math.random() * 60) + 1}`;
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
      fare:
        typeof selectedTrain.fare === "object"
          ? selectedTrain.fare[cls]
          : selectedTrain.fare || 1500,
      status: status,
      date: new Date().toISOString().split("T")[0],
      pnr: Math.floor(1000000000 + Math.random() * 9000000000),
    };

    navigate("/payment", {
      state: { booking: bookingData },
    });
  };

  /* ✅ FIX 3: If user comes directly from dashboard (no train passed) */
  if (!selectedTrain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#1e1b4b] to-black text-white flex items-center justify-center">
        <div>
          <p className="mb-6 text-xl">No train selected</p>
          <button
            onClick={() => navigate("/search-trains")}
            className="bg-cyan-500 px-6 py-3 rounded-lg"
          >
            Search Trains
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#1e1b4b] to-black text-white px-8 py-10">

      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-400 mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        🎟 Book Ticket
      </h1>

      <div className="bg-white/10 p-6 rounded-xl">

        <h2 className="text-2xl font-bold">
          {selectedTrain.name} ({selectedTrain.trainNo})
        </h2>

        <p className="mb-4">
          {selectedTrain.from} → {selectedTrain.to}
        </p>

        {/* CLASS */}
        <select
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          className="p-3 bg-black rounded w-full mb-4"
        >
          <option value="">Select Class</option>
          {selectedTrain.classes?.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* PASSENGER COUNT */}
        <select
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          className="p-3 bg-black rounded w-full mb-6"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} Passenger
            </option>
          ))}
        </select>

        {/* PASSENGER DETAILS */}
        {details.map((p, i) => (
          <div key={i} className="mb-4">
            <h3>Passenger {i + 1}</h3>

            <input
              value={p.name}
              placeholder="Name"
              className="p-2 bg-black/50 rounded w-full mb-2"
              onChange={(e) => {
                const updated = [...details];
                updated[i].name = e.target.value;
                setDetails(updated);
              }}
            />

            <input
              value={p.age}
              placeholder="Age"
              type="number"
              className="p-2 bg-black/50 rounded w-full"
              onChange={(e) => {
                const updated = [...details];
                updated[i].age = e.target.value;
                setDetails(updated);
              }}
            />
          </div>
        ))}

        <button
          onClick={handleProceedToPayment}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold"
        >
          Proceed to Payment
        </button>

      </div>
    </div>
  );
};

export default BookTicket;
