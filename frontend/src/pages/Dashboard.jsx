import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HolidaySection from "../components/HolidaySection";
import AIRecommendedTrains from "../components/AIRecommendedTrains";
import TrendingRoutes from "../components/TrendingRoutes";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const aiRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (location.state?.scrollToAI) {
      aiRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* ================= MAIN DASHBOARD ================= */}
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f1d] via-[#0e172a] to-black text-white px-8 pb-20 font-sans">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center py-6 select-none">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/8/83/Indian_Railways.svg"
              className="w-14 h-14 rounded-full border border-cyan-500/25"
              alt="logo"
            />
            <h1 className="text-xl font-black text-cyan-400 tracking-wider uppercase cursor-pointer" onClick={() => navigate("/")}>
              Indian Railway Dashboard
            </h1>
          </div>

          {user ? (
            <button
              onClick={logout}
              className="bg-rose-600/90 border border-rose-500/20 hover:bg-rose-700 transition text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow active:scale-98 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#1a2333]/90 border border-slate-750/90 hover:bg-[#222e44]/95 hover:border-slate-650 transition text-cyan-400 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow active:scale-98 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow active:scale-98 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* ================= WELCOME ================= */}
        <div className="mt-10 select-none">
          <h2 className="text-2xl font-black uppercase tracking-wider">
            Welcome,{" "}
            <span className="text-cyan-400 font-black">{user ? user.name : "Guest"}</span> 👋
          </h2>
          <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-wider">
            Next-Gen Train Booking System
          </p>
        </div>

        {/* ================= QUICK ACTION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <InfoCard
            title="Search Trains"
            desc="Plan your journey instantly. Search schedules, routes, and train options across the entire Indian Railways network."
            icon={
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            onClick={() => navigate("/search-trains")}
          />
          <InfoCard
            title="Book Tickets"
            desc="Reserve your seats securely. Book e-tickets with seamless payment and instant confirmation."
            icon={
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c.621 0 1.125.504 1.125 1.125V17.25c0 .621-.504 1.125-1.125 1.125H7.5A1.125 1.125 0 016.375 17.25V7.125C6.375 6.504 6.879 6 7.5 6z" />
              </svg>
            }
            onClick={() => {
              if (!user) {
                alert("Please login first to book tickets!");
                navigate("/login");
              } else {
                navigate("/book-ticket");
              }
            }}
          />
          <InfoCard
            title="Train Recommendations"
            desc="Get smart suggestions powered by AI. Discover the best trains, timings, and routes customized just for you."
            icon={
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.188.904zM19.006 5.005l-.505 3.158-3.158.505 3.158.505.505 3.158.505-3.158 3.158-.505-3.158-.505-.505-3.158z" />
              </svg>
            }
            onClick={() =>
              navigate("/dashboard", {
                state: { scrollToAI: true },
              })
            }
          />
          <InfoCard
            title="Booking History"
            desc="Manage your travel history. View, download, or track all your past and active e-ticket reservations."
            icon={
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={() => {
              if (!user) {
                alert("Please login first to view your booking history!");
                navigate("/login");
              } else {
                navigate("/booking-history");
              }
            }}
          />
        </div>

        {/* ================= RAILWAY SERVICES ================= */}
        <div className="mt-20">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2 uppercase tracking-widest text-slate-350 select-none">
            🚆 Railway Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceButton
              title="Seat Availability"
              desc="Query dynamic seat numbers by date, class and train."
              icon={
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm0 5h14M5 14h14M10 4v16" />
                </svg>
              }
              onClick={() => navigate("/seat-availability")}
            />

            <ServiceButton
              title="Fare Calculator"
              desc="Calculate e-ticket fare breakdown metrics instantly."
              icon={
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              onClick={() => navigate("/fare-calculator")}
            />

            <ServiceButton
              title="PNR Status"
              desc="Verify ticket reservations with digital CSS boarding stubs."
              icon={
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              onClick={() => navigate("/pnr-status")}
            />
          </div>
        </div>

        {/* ================= OTHER SECTIONS ================= */}
        <div ref={aiRef}> 
          <AIRecommendedTrains />
        </div>
        <HolidaySection />
        <TrendingRoutes />
      </div>

      {/* ================= FOOTER & CHATBOT ================= */}
      <Footer />
      <Chatbot />
    </>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const InfoCard = ({ title, desc, icon, onClick }) => (
  <div
    onClick={onClick} 
    className="bg-[#172031]/80 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-2xl p-6 transition-all duration-300 cursor-pointer select-none hover:scale-105 flex flex-col justify-between h-full min-h-[160px]"
  >
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">{title}</h3>
      </div>
      <p className="text-slate-400 text-xs font-semibold leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ServiceButton = ({ title, desc, icon, onClick }) => (
  <button
    onClick={onClick}
    className="
      relative overflow-hidden
      bg-[#172031]/80
      border border-slate-800/80
      hover:border-cyan-500/50
      hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
      text-white
      rounded-2xl
      p-6
      text-left
      hover:scale-[1.04]
      transition-all duration-300
      focus:outline-none
      cursor-pointer
      select-none
      w-full
    "
  >
    <div className="relative z-10">
      <div className="mb-3 text-cyan-400">{icon}</div>
      <h3 className="text-base font-black uppercase tracking-wider text-white">{title}</h3>
      <p className="text-slate-400 mt-2 text-xs font-semibold leading-relaxed">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
