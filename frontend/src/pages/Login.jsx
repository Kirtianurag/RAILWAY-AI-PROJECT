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

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-black/20 backdrop-blur-2xl backdrop-saturate-150 p-10 rounded-[2rem] w-full max-w-md shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
        <h2 className="text-4xl font-bold text-center mb-8 text-white tracking-wide">
          RailConnect
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-6 bg-red-900/40 p-3 rounded-lg border border-red-500/50">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-black/40 transition-all backdrop-blur-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-black/40 transition-all backdrop-blur-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all"
          >
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
