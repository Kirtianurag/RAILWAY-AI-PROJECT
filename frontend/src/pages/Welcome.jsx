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

  const previousSlide = (currentSlide - 1 + slides.length) % slides.length;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Slideshow: Dual-Layered Crossfade (Zero Dimming or Hiding Flashes) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${slides[previousSlide]}')` }}
      />
      {slides.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{ backgroundImage: `url('${url}')` }}
        />
      ))}

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-slate-950/40 z-10"></div>

      {/* TOP FLOATING HEADER ACTIONS */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900/90 border border-white/20 text-white font-bold transition text-xs uppercase tracking-wider cursor-pointer shadow-lg backdrop-blur-md"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-black transition text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
        >
          Create Account
        </button>
      </div>

      {/* GORGEOUS FROSTED GLASS CONSOLE */}
      <div className="relative z-20 max-w-xl w-full mx-4 bg-slate-950/80 backdrop-blur-xl border border-white/20 p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col text-center">
        
        {/* Glowing Indian Railways Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/8/83/Indian_Railways.svg"
            className="w-20 h-20 rounded-full border-2 border-cyan-400/40 p-1 bg-slate-900/90 shadow-[0_0_25px_rgba(6,182,212,0.35)] animate-pulse"
            alt="Indian Railways Logo"
          />
        </div>

        {/* Title Brand */}
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(6,182,212,0.3)]">
          RailConnect
        </h1>

        {/* Subtitle Accent */}
        <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mt-3.5 select-none">
          Next-Generation Railway Assistant
        </p>

        {/* Description / Slogan (Pure white for 100% crystal-clear readability) */}
        <p className="mt-6 text-sm md:text-base text-white font-bold leading-relaxed max-w-md mx-auto filter drop-shadow-sm">
          "Bringing people closer with every journey — explore trains easily, book faster, and travel without hassle. Because every trip connects a story."
        </p>

        {/* Interactive Slideshow Indicators inside Console */}
        <div className="flex justify-center gap-2 mt-8 select-none">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? "bg-cyan-400 w-8 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                  : "bg-white/30 hover:bg-white/50 w-2.5"
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full sm:w-auto px-10 py-4 bg-cyan-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:bg-cyan-400 hover:scale-105 active:scale-98 cursor-pointer"
          >
            {hovered ? "Welcome Aboard" : "Get Started Now →"}
          </button>
        </div>

      </div>

      {/* FOOTER STRIP */}
      <div className="absolute bottom-0 w-full text-center text-white text-xs py-4 bg-black/60 backdrop-blur-md border-t border-slate-900/80 z-20 select-none font-bold uppercase tracking-wider">
        © 2025 RailConnect — Made by KIRTI ANURAG 
      </div>
    </div>
  );
};

export default Welcome;
