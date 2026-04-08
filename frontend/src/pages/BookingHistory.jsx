import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(stored);
  }, []);

  const cancelBooking = (pnr) => {
    const updated = bookings.map((b) =>
      b.pnr === pnr ? { ...b, status: "CANCELLED", cancelled: true } : b
    );

    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#1e1b4b] to-black text-white px-8 py-10">

      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-400 mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold text-cyan-400 mb-10">
        📜 Booking History
      </h1>

      {bookings.length === 0 && (
        <p className="text-gray-400 text-center">
          No bookings found
        </p>
      )}

      {bookings.map((b) => (
        <div
          key={b.pnr}
          className="bg-white/10 rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-cyan-400">
              {b.trainName} ({b.trainNo})
            </h2>
            <p className="text-gray-400">{b.route}</p>

            <p className="mt-2">
              Class: <span className="text-cyan-400">{b.class}</span>
            </p>

            <p>
              Status:{" "}
              <span
                className={
                  b.status === "CANCELLED"
                    ? "text-red-400"
                    : (b.status || "").startsWith("AVL")
                    ? "text-green-400"
                    : (b.status || "").startsWith("RAC")
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {b.status || "CONFIRMED"}
              </span>
            </p>

            <div className="mt-3">
              <p className="font-semibold mb-1">👤 Passengers</p>
              {(b.passengers || []).map((p, i) => (
                <p key={i} className="text-sm text-gray-300">
                  {p.name} | Age: {p.age} | Seat: {p.seat}
                </p>
              ))}
            </div>
          </div>

          <div className="text-right mt-4 md:mt-0">
            <p className="text-sm text-gray-400">PNR</p>
            <p className="text-green-400 font-bold">{b.pnr}</p>
            <p className="text-sm text-gray-400 mt-1">
              Date: {b.date}
            </p>

            <button
              onClick={() =>
                navigate("/ticket", {
                  state: { booking: b },
                })
              }
              className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-semibold"
            >
              🎫 View Ticket
            </button>

            {!b.cancelled && (
              <button
                onClick={() => cancelBooking(b.pnr)}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                ❌ Cancel Ticket
              </button>
            )}

            {b.cancelled && (
              <p className="mt-4 text-red-400 font-semibold">
                ❌ Ticket Cancelled
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
