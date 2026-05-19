import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/axios';
import { toast } from 'react-hot-toast';
import authBg from '../assets/auth-bg-warm.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }


    if (!formData.password) {
      newErrors.password = "PassKey is required";
    } 
    else if (formData.password.length < 8) {
      newErrors.password = "PassKey must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { data } = await loginUser(formData);
      const { user } = data.data;
      setUser(user);
      toast.success("Welcome back to Lumina AI");
      navigate('/dashboard');
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || 'Failed to login');
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
      <nav className="relative z-10 px-6 py-5">
        <div className="flex items-center">
          <span className="text-xl font-bold font-hanken tracking-tight">Lumina AI</span>
        </div>
      </nav>

      {/* Main Form Container */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 pb-32">
        <div className="w-full max-w-[440px] glass-panel rounded-[2rem] pt-7 pb-8 px-10 space-y-7 animate-in fade-in zoom-in duration-500">
          
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold font-heading tracking-tight leading-none text-white">Welcome back</h1>
            <p className="text-on-surface-variant text-[11px] font-medium opacity-100">Secure access to your neural workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Email Address</label>
                <div className="h-[1px] flex-grow mx-4 bg-white/10"></div>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
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
                <Link to="#" className="text-[10px] font-bold text-primary hover:text-white transition-all">FORGOT?</Link>
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
              {loading ? "Authenticating..." : "Sign In"}
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

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
                className="btn-secondary !px-0" title="Google"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
              </button>
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
                className="btn-secondary !px-0" title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </button>
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`}
                className="btn-secondary !px-0 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/10 transition-all" title="Discord"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6533-.2455-1.2743-.5415-1.8749-.8836a.0776.0776 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8814.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              </button>
            </div>

            <div className="text-center text-xs">
              <span className="text-on-surface-variant/60">New to the frontier? </span>
              <Link to="/register" className="font-bold text-primary hover:text-white transition-colors">Create account</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="absolute bottom-0 w-full z-10 px-6 pt-6 pb-4 flex justify-between items-center text-[10px] font-semibold tracking-widest text-white/50 uppercase">
        <p>© 2026 Lumina AI. Boundless Intelligence.</p>
        <div className="flex gap-10">
          <Link to="#" className="text-white/70 hover:text-white transition-colors">Privacy</Link>
          <Link to="#" className="text-white/70 hover:text-white transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
};

export default Login;
