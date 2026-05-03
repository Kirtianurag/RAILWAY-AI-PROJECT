import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const slides = [
  "https://images.unsplash.com/photo-1637995735729-c43250f1ef47?q=80&w=1176&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639494095806-1680b909cb33?q=80&w=1203&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1757841239542-c29c68d4b130?q=80&w=1330&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1777556368890-66d79835c4e0?q=80&w=1172&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1726747062988-cd0b86c814e0?q=80&w=1212&auto=format&fit=crop",
  "https://blog-content.ixigo.com/wp-content/uploads/2024/09/train-northeast.jpg"
];

const Welcome = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      
      {/* Background Slideshow */}
      {slides.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${url}')` }}
        />
      ))}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center text-white px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
          RailConnect
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Bringing people closer with every journey — explore trains easily, book faster, and travel without hassle.
Because every trip connects a story....
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-10 px-8 py-3 bg-cyan-500 text-black font-bold hover:bg-cyan-400 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
        >
          {hovered ? "Welcome" : "Get Started"}
        </button>
      </div>

      {/* FOOTER STRIP */}
      <div className="absolute bottom-0 w-full text-center text-gray-300 text-sm py-4 bg-black/30 backdrop-blur-sm z-10">
        © 2025 RailConnect — Made by KIRTI ANURAG 
      </div>
    </div>
  );
};

export default Welcome;
