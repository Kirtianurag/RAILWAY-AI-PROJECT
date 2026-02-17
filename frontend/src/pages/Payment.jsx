import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;

  const [method, setMethod] = useState("");
  const [option, setOption] = useState("");

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No booking data found
      </div>
    );
  }

  const completePayment = () => {
    if (!method || !option) {
      alert("Please select payment method");
      return;
    }

    const finalTicket = {
      ...booking,
      status: booking.status || "CONFIRMED",   // ✅ FIX
      date: booking.date || new Date().toISOString().split("T")[0], // ✅ FIX
      paymentMethod: `${method} - ${option}`,
      bookedAt: new Date().toLocaleString(),
    };

    const history = JSON.parse(localStorage.getItem("bookings")) || [];

    const alreadyExists = history.some(b => b.pnr === finalTicket.pnr);

    if (!alreadyExists) {
      localStorage.setItem(
        "bookings",
        JSON.stringify([...history, finalTicket])
      );
    }

    navigate("/ticket", {
      state: { booking: finalTicket },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#1e1b4b] to-black text-white px-8 py-10">

      <button onClick={() => navigate(-1)} className="text-cyan-400 mb-6">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8">💳 Pay Using</h1>

      {/* BOOKING SUMMARY */}
      <div className="bg-white/10 rounded-xl p-6 mb-8">
        <p className="text-lg font-bold">
          {booking.trainName} ({booking.trainNo})
        </p>
        <p className="text-gray-400">{booking.route}</p>
        <p className="mt-2">Class: {booking.class}</p>
        <p>Passengers: {booking.passengers?.length || 0}</p>
        <p>Date: {booking.date}</p>
        <p>Status: <span className="text-cyan-400">{booking.status}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CARD / NET BANKING */}
        <div className="bg-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">💳 Card / Net Banking</h2>

          {[
            {
              name: "Visa",
              img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
            },
            {
              name: "Mastercard",
              img: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
            },
            {
              name: "RuPay",
              img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/1200px-Rupay-Logo.png?20200811062726",
            },
          ].map((card) => (
            <label
              key={card.name}
              className="flex items-center gap-4 mb-4 cursor-pointer bg-black/40 p-3 rounded-lg hover:bg-black/60"
            >
              <input
                type="radio"
                name="payment"
                onChange={() => {
                  setMethod("Card");
                  setOption(card.name);
                }}
              />
              <img
                src={card.img}
                alt={card.name}
                className="h-8 bg-white p-1 rounded"
              />
              <span>{card.name}</span>
            </label>
          ))}
        </div>

        {/* UPI */}
        <div className="bg-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📱 UPI</h2>

          {[
            {
              name: "PhonePe",
              img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png",
            },
            {
              name: "Razorpay UPI",
              img: "https://razorpay.com/assets/razorpay-logo.svg",
            },
            {
              name: "Amazon Pay",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NrHT4rEeertzPwN7CT7V6DSYqxNq0cWv8g&s",
            },
          ].map((upi) => (
            <label
              key={upi.name}
              className="flex items-center gap-4 mb-4 cursor-pointer bg-black/40 p-3 rounded-lg hover:bg-black/60"
            >
              <input
                type="radio"
                name="payment"
                onChange={() => {
                  setMethod("UPI");
                  setOption(upi.name);
                }}
              />
              <img
                src={upi.img}
                alt={upi.name}
                className="h-8 bg-white p-1 rounded"
              />
              <span>{upi.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={completePayment}
        className="mt-10 w-full bg-green-500 hover:bg-green-600 py-4 rounded-xl font-bold text-lg"
      >
        Pay Now (Mock)
      </button>
    </div>
  );
};

export default Payment;
