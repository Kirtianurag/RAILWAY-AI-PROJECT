import { useEffect,useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";

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
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

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
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-black text-white px-8 pb-20">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/1200px-Indian_Railways.svg.png"
              className="w-14 h-14 rounded-full border-2 border-cyan-400"
              alt="logo"
            />
            <h1 className="text-2xl font-bold text-cyan-400">
              Indian Railway AI Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* ================= WELCOME ================= */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-cyan-400">{user?.name}</span> 👋
          </h2>
          <p className="text-gray-400 mt-2">
            AI-powered railway booking system
          </p>
        </div>

        {/* ================= QUICK ACTION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <InfoCard
            title="🔍 Search Trains"
            desc="Find fastest & cheapest trains"
            onClick={() => navigate("/search-trains")}
          />
          <InfoCard
            title="🎟 Book Tickets"
            desc="Smart booking with availability"
            onClick={() => navigate("/book-ticket")}
          />
          <InfoCard
            title="🤖 AI Recommendations"
            desc="Best trains for your journey"
            onClick={() =>
              navigate("/dashboard", {
                state: { scrollToAI: true },
              })
            }
          />
          <InfoCard
  title="📜 Booking History"
  desc="View your past ticket bookings"
  onClick={() => navigate("/booking-history")}
/>
        </div>


        {/* ================= RAILWAY SERVICES ================= */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            🚆 Railway Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceButton
              title="Seat Availability"
              desc="Check seats by date, train & class"
              icon="🪑"
              onClick={() => navigate("/seat-availability")}
            />

            <ServiceButton
              title="Fare Calculator"
              desc="Estimate ticket fare easily"
              icon="💰"
              onClick={() => navigate("/fare-calculator")}
            />

            <ServiceButton
              title="PNR Status"
              desc="Track booking & confirmation status"
              icon="📄"
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

const InfoCard = ({ title, desc, onClick }) => (
  <div
  onClick={onClick} 
  className="bg-white/10 p-6 rounded-xl hover:scale-105 transition">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-400 mt-2">{desc}</p>
  </div>
);

/* 🔥 UPDATED SERVICE BUTTON (GRADIENT) */
const ServiceButton = ({ title, desc, icon, onClick }) => (
  <button
    onClick={onClick}
    className="
      relative overflow-hidden
      bg-white/10
      text-white
      rounded-2xl
      p-6
      text-left
      shadow-xl
      hover:scale-[1.04]
      hover:shadow-2xl
      transition-all duration-300
      focus:outline-none
    "
  >
    {/* Glass overlay */}
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

    {/* Content */}
    <div className="relative z-10">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-white/90 mt-2 text-sm">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
