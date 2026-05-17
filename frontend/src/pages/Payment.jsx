import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;

  const [method, setMethod] = useState("Card"); // default active panel to Card
  const [option, setOption] = useState("PhonePe"); // default active UPI option to PhonePe
  
  // Custom mock input states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0e1220]">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-slate-400 font-semibold">No booking data found</p>
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 rounded-lg text-sm text-white font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Fare calculations matching mockup
  const passengersCount = booking.passengers?.length || 1;
  const singleFare = booking.fare || 450;
  const baseFareTotal = singleFare * passengersCount;
  const superfastCharge = 30 * passengersCount; // Mockup: ₹30.00
  const convenienceFee = 20; // Mockup: ₹20.00
  const totalFare = baseFareTotal + superfastCharge + convenienceFee;

  const completePayment = () => {
    if (method === "Card") {
      if (!cardNumber || !cardCvv) {
        alert("Please enter secure card details to proceed");
        return;
      }
    } else {
      if (!upiId) {
        alert("Please enter your UPI Address to continue");
        return;
      }
    }

    const finalTicket = {
      ...booking,
      status: booking.status || "CONFIRMED",
      date: booking.date || new Date().toISOString().split("T")[0],
      paymentMethod: `${method} (${option})`,
      bookedAt: new Date().toLocaleString(),
    };

    const history = JSON.parse(localStorage.getItem("bookings")) || [];
    const alreadyExists = history.some(b => b.pnr === finalTicket.pnr);

    if (!alreadyExists) {
      localStorage.setItem("bookings", JSON.stringify([...history, finalTicket]));
    }

    navigate("/ticket", {
      state: { booking: finalTicket },
    });
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans grid grid-cols-1 md:grid-cols-12 bg-[#121829]">
      
      {/* ================= LEFT COLUMN: SECURE PAYMENT (7 Columns) ================= */}
      <div className="md:col-span-7 bg-[#121829] px-8 md:px-16 py-12 flex flex-col justify-between min-h-screen">
        
        {/* Top Header back navigation */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <div className="w-full space-y-6">
          <h2 className="text-[20px] font-black tracking-wider text-slate-100 uppercase">
            SECURE PAYMENT
          </h2>

          <div className="space-y-4">
            
            {/* 1. CREDIT/DEBIT CARD PANEL */}
            <div className="bg-[#172031] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setMethod("Card")}
                className="w-full px-6 py-4.5 flex items-center justify-between text-slate-100 font-bold hover:bg-[#1c273a] transition-colors"
              >
                <span className="flex items-center gap-3 text-sm tracking-wide font-black">
                  <span className="text-emerald-400 text-base">💳</span> Credit/Debit Card
                </span>
                <span className={`text-slate-400 text-[10px] transform transition-transform ${method === "Card" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {method === "Card" && (
                <div className="p-6 pt-0 border-t border-slate-800/50 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="xxxx xxxx xxxx xxxe"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#111625] border border-slate-700 text-white placeholder-slate-650 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(52,211,153,0.25)] transition-all text-sm font-semibold tracking-widest"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="absolute right-3.5 top-3.5 h-4 w-auto"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="EYPY / EYV"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-750 text-white placeholder-slate-650 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(52,211,153,0.25)] transition-all text-sm text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-755 text-white placeholder-slate-650 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(52,211,153,0.25)] transition-all text-sm text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. UPI PAYMENT PANEL */}
            <div className="bg-[#172031] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setMethod("UPI")}
                className="w-full px-6 py-4.5 flex items-center justify-between text-slate-100 font-bold hover:bg-[#1c273a] transition-colors"
              >
                <span className="flex items-center gap-3 text-sm tracking-wide font-black">
                  <img 
                    src="https://play-lh.googleusercontent.com/B5cNBA15IxjCT-8UTXEWgiPcGkJ1C07iHKwm2Hbs8xR3PnJvZ0swTag3abdC_Fj5OfnP" 
                    alt="UPI" 
                    className="h-5 w-auto rounded object-contain bg-white px-0.5 py-0.5" 
                  />
                  UPI Payment
                </span>
                <span className={`text-slate-400 text-[10px] transform transition-transform ${method === "UPI" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {method === "UPI" && (
                <div className="p-6 pt-0 border-t border-slate-800/50 space-y-5">
                  
                  {/* UPI Selector Grid matching mockup icons */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        id: "PhonePe",
                        label: "PhonePe",
                        img: "https://e7.pngegg.com/pngimages/332/615/png-clipart-phonepe-india-unified-payments-interface-india-purple-violet.png",
                      },
                      {
                        id: "Razorpay",
                        label: "Razorpay",
                        img: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png",
                      },
                      {
                        id: "Amazon Pay",
                        label: "Amazon Pay",
                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKMIAlQeY5jFr8rjj6bV8QT9RAvnViGp0CBw&s",
                      },
                      {
                        id: "UPI-Pal",
                        label: "UPI-Pal",
                        img: "https://play-lh.googleusercontent.com/B5cNBA15IxjCT-8UTXEWgiPcGkJ1C07iHKwm2Hbs8xR3PnJvZ0swTag3abdC_Fj5OfnP",
                      },
                    ].map((item) => {
                      const isSel = option === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setOption(item.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer h-20 ${
                            isSel
                              ? "border-emerald-400 bg-emerald-500/5 text-white shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                              : "border-slate-800/80 bg-[#111625] text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="h-7 flex items-center justify-center mb-2">
                            <img
                              src={item.img}
                              alt={item.label}
                              className="h-6 w-auto object-contain bg-white px-1.5 py-0.5 rounded shadow-sm"
                            />
                          </div>
                          <span className="text-[9px] font-black tracking-wider text-slate-300 block">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">
                      Enter UPI Address (VPA)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. kirtianurag@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-400 focus:shadow-[0_0_12px_rgba(52,211,153,0.25)] transition-all text-sm font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* PAY NOW BUTTON PLACED IN THE LEFT COLUMN FOOTER */}
        <div className="mt-12 space-y-4">
          <button
            onClick={completePayment}
            className="w-full py-4 rounded-2xl font-black text-emerald-400 bg-transparent border border-emerald-400/80 hover:bg-emerald-500/5 active:scale-98 transition shadow-[0_0_20px_rgba(52,211,153,0.15)] cursor-pointer text-[15px] tracking-wide text-center block"
          >
            Pay Now
          </button>
          <span className="text-center block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Already with Vercel & Stripe
          </span>
        </div>

      </div>

      {/* ================= RIGHT COLUMN: ORDER SUMMARY (5 Columns) ================= */}
      <div className="md:col-span-5 bg-[#0b0f19] px-8 md:px-12 py-12 flex flex-col justify-center min-h-screen border-l border-slate-900">
        
        <div className="w-full max-w-sm mx-auto space-y-6">
          <h2 className="text-[20px] font-black tracking-wider text-slate-100 uppercase">
            ORDER SUMMARY
          </h2>

          {/* GLASSMORPHIC RECEIPT CARD */}
          <div className="bg-[#172031]/90 border-t border-white/5 border-x border-b border-slate-800/85 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl relative">
            
            {/* Header Title inside receipt card */}
            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-white tracking-widest uppercase">
                RECEIPT
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider">
                Receipt
              </p>
            </div>

            {/* Dash border divider */}
            <div className="border-t border-dashed border-slate-800/60 my-4"></div>

            {/* Route row matching mockup styling */}
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-semibold">Train Route</span>
                <span className="text-[10px] font-bold text-slate-500 block">({booking.trainNo || "TRC-109"})</span>
              </div>
              <div className="text-emerald-400 font-bold text-lg select-none">
                ➔
              </div>
              <div className="text-right space-y-1">
                <span className="text-xs text-slate-200 block font-bold truncate max-w-[125px]">{booking.to}</span>
                <span className="text-[10px] font-bold text-slate-500 block">(MIN-2AR)</span>
              </div>
            </div>

            {/* Details table rows */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Travel Class</span>
                <span className="text-emerald-400 font-black uppercase tracking-wider text-[11px]">
                  {booking.class === "CC" ? "AC Chair Car" : booking.class === "EC" ? "Executive Chair Car" : booking.class === "3A" ? "AC 3 Tier" : booking.class}
                </span>
              </div>

              {/* TWO LINE BOOKING STATUS DESIGN FROM MOCKUP */}
              <div className="space-y-1 pt-1">
                <span className="text-xs text-slate-400 block font-semibold">Booking Status</span>
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-white">Status</span>
                  <span className="text-emerald-400 uppercase tracking-wider text-[11px]">
                    Booking
                  </span>
                </div>
              </div>
            </div>

            {/* Dash divider */}
            <div className="border-t border-dashed border-slate-800/60 my-4"></div>

            {/* Fare Breakdown Detail list */}
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Ticket Fare</span>
                <span className="text-slate-200">₹{baseFareTotal}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Superfast Fee</span>
                <span className="text-slate-200">₹{superfastCharge}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Convenience Charge</span>
                <span className="text-slate-200">₹{convenienceFee}.00</span>
              </div>
            </div>

            {/* Dashed divider with Left & Right Cutout Ticket Notches blending into #0b0f19 column background */}
            <div className="relative my-6 mx-[-24px]">
              {/* Left Notch */}
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0b0f19] rounded-full z-10"></div>
              {/* Right Notch */}
              <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0b0f19] rounded-full z-10"></div>
              {/* Dashed Line */}
              <div className="border-t border-dashed border-slate-700/60 w-full"></div>
            </div>

            {/* Total Grand Payable amount row */}
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-sm font-bold text-slate-300">Total Payable</span>
              <span className="text-lg font-black text-white">₹{totalFare}.00</span>
            </div>

            {/* Badges capsule list at the bottom of the receipt */}
            <div className="flex items-center gap-3 pt-6 justify-center">
              <div className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full select-none">
                🔒 SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full select-none">
                ✓ IRCTC Verified
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Payment;
