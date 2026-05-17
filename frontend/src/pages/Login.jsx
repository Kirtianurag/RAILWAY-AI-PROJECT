import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const slides = [
  "https://images.unsplash.com/photo-1637995735729-c43250f1ef47?q=80&w=1176&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639494095806-1680b909cb33?q=80&w=1203&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1757841239542-c29c68d4b130?q=80&w=1330&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1777556368890-66d79835c4e0?q=80&w=1172&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1726747062988-cd0b86c814e0?q=80&w=1212&auto=format&fit=crop"
];

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const previousSlide = (currentSlide - 1 + slides.length) % slides.length;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

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

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-slate-950/45 z-10"></div>

      {/* BACK TO WELCOME SCREEN BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-black cursor-pointer bg-slate-955/80 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md shadow-lg"
        >
          ← Home
        </button>
      </div>

      {/* REGISTER SHORTCUT TOP RIGHT */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => navigate("/register")}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-black transition text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
        >
          Sign Up
        </button>
      </div>

      {/* GORGEOUS FROSTED GLASS LOGIN CARD */}
      <div className="relative z-20 bg-slate-950/80 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] mx-4">
        
        {/* Emblem */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/8/83/Indian_Railways.svg"
            className="w-16 h-16 rounded-full border border-cyan-400/30 p-1 bg-slate-900/90 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            alt="Indian Railways"
          />
        </div>

        <h2 className="text-3xl font-black text-center mb-1 text-white tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
          RailConnect
        </h2>
        <p className="text-[9px] text-center font-black text-cyan-400 tracking-widest uppercase mb-8">
          Sign In to Travel Console
        </p>

        {error && (
          <p className="text-rose-400 text-xs font-semibold text-center mb-6 bg-rose-950/60 p-3 rounded-xl border border-rose-500/30 leading-relaxed">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Address with Left Icon */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
              <svg className="w-5 h-5 text-slate-350" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/20 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-950/80 transition-all font-semibold text-sm"
            />
          </div>

          {/* Password with Left Icon */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
              <svg className="w-5 h-5 text-slate-350" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/20 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-950/80 transition-all font-semibold text-sm"
            />
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer hover:scale-102 active:scale-98 ${
              loading
                ? "bg-slate-700 cursor-not-allowed text-slate-400"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In Now"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-white font-semibold">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
