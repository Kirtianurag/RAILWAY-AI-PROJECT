import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Welcome = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://blog-content.ixigo.com/wp-content/uploads/2024/09/train-northeast.jpg')",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative text-center text-white px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
          Intelligent Railway Booking System
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Experience the future of railway travel — smart train search, AI-powered recommendations, quick bookings, and seamless voice assistant support. Your journey begins here.
        </p>

        <button
          onClick={() => navigate("/login")}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-10 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-all duration-300"
        >
          {hovered ? "Welcome" : "Get Started"}
        </button>
      </div>

      {/* FOOTER STRIP */}
      <div className="absolute bottom-0 w-full text-center text-gray-300 text-sm py-4 bg-black/30">
        © 2025 Intelligent Railway Booking System — Made by KIRTI ANURAG 
      </div>
    </div>
  );
};

export default Welcome;
