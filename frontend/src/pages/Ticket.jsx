import { useLocation, useNavigate } from "react-router-dom";

const Ticket = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: read booking, not ticket
  const ticket = state?.booking;

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Ticket not found
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

      <h1 className="text-4xl font-bold text-green-400 mb-8">
        ✅ Ticket Booked Successfully
      </h1>

      <div className="bg-white/10 rounded-2xl p-8 space-y-4">

        <p className="text-xl font-bold">
          {ticket.trainName} ({ticket.trainNo})
        </p>

        <p className="text-gray-400">{ticket.route}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <p>
            PNR: <span className="text-cyan-400">{ticket.pnr}</span>
          </p>
          <p>Date: {ticket.date}</p>
          <p>Class: {ticket.class}</p>
          <p>Status: {ticket.status}</p>
        </div>

        <hr className="border-white/20 my-4" />

        <h2 className="text-xl font-bold">👥 Passenger Details</h2>

        {ticket.passengers.map((p, i) => (
          <div
            key={i}
            className="flex justify-between bg-black/40 p-3 rounded-lg mt-2"
          >
            <span>
              {i + 1}. {p.name} ({p.age} yrs)
            </span>
            <span className="text-cyan-400">
              Seat: {p.seat}
            </span>
          </div>
        ))}

        <hr className="border-white/20 my-4" />

        {ticket.paymentMethod && (
          <p>
            💳 Payment Method:{" "}
            <span className="text-green-400">
              {ticket.paymentMethod}
            </span>
          </p>
        )}

        {ticket.bookedAt && (
          <p>🕒 Booked At: {ticket.bookedAt}</p>
        )}
      </div>
    </div>
  );
};

export default Ticket;
