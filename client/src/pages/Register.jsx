import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/axios';
import { toast } from 'react-hot-toast';
import authBg from '../assets/auth-bg-warm.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      const { user } = data.data;
      setUser(user);
      toast.success("Welcome to Lumina AI!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-surface flex flex-col relative overflow-hidden font-inter text-on-surface">
      {/* Dynamic Background System */}
      <div
        className="absolute inset-0 z-0 animate-slow-pan"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Moving Ethereal Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[140px] animate-layer-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-orange-500/5 rounded-full blur-[160px] animate-layer-2" />
      </div>

      {/* Noise Texture */}
      <div className="noise-overlay" />

      {/* Top Nav */}
      <nav className="relative z-10 px-8 py-4">
        <div className="flex items-center">
          <span className="text-xl font-bold font-hanken tracking-tight">Lumina AI</span>
        </div>
      </nav>

      {/* Main Form Container */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 pb-8">
        <div className="w-full max-w-[440px] glass-panel rounded-[2rem] pt-7 pb-8 px-10 space-y-7 animate-in fade-in zoom-in duration-500">
          
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold font-heading tracking-tight leading-none text-white">Initialize Gateway</h1>
            <p className="text-on-surface-variant text-[11px] font-medium opacity-100">Create your gateway to boundless intelligence.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Full Name</label>
                <div className="h-[1px] flex-grow mx-4 bg-white/10"></div>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field !py-3"
                />
                {errors.name && <p className="text-[9px] text-primary font-bold ml-4">{errors.name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Email Address</label>
                <div className="h-[1px] flex-grow mx-4 bg-white/10"></div>
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="input-field !py-3"
                />
                {errors.email && <p className="text-[9px] text-primary font-bold ml-4">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">PassKey</label>
                <div className="h-[1px] flex-grow mx-4 bg-white/10"></div>
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field !py-3"
                />
                {errors.password && <p className="text-[9px] text-primary font-bold ml-4">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm shadow-xl shadow-primary/5 mt-1"
            >
              {loading ? "Initializing..." : "Create Account"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </form>

          <div className="space-y-5 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 text-[9px] font-bold text-outline tracking-[0.3em] bg-[#1a181e]">OR CONTINUE WITH</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" x2="12" y1="8" y2="8" /><line x1="3.95" x2="8.54" y1="6.06" y2="14.03" /><line x1="10.88" x2="15.46" y1="21.94" y2="14" /></svg>
                Google
              </button>
              <button className="btn-secondary py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                GitHub
              </button>
            </div>

            <div className="text-center text-[12px]">
              <span className="text-on-surface-variant/60 font-medium">Already part of the network? </span>
              <Link to="/login" className="font-bold text-primary hover:text-white transition-colors underline underline-offset-4">Log In</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="relative z-10 px-8 py-5 flex justify-between items-center text-[10px] font-medium tracking-widest text-outline-variant/40 uppercase">
        <p>© 2026 Lumina AI. Boundless Intelligence.</p>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-on-surface transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-on-surface transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
};

export default Register;
