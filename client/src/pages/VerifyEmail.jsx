import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendOTP } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import authBg from '../assets/auth-bg-warm.png';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification link");
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return toast.error("Please enter the complete 6-digit code");
    }

    setLoading(true);
    try {
      const { data } = await verifyEmail({ email, otp: otpString });
      setUser(data.data.user);
      toast.success("Identity verified! Welcome to Lumina AI.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP({ email });
      toast.success("New code sent to your email");
    } catch (error) {
      toast.error("Could not resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden font-inter">
      {/* Background System */}
      <div
        className="absolute inset-0 z-0 animate-slow-pan"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="noise-overlay" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 pb-20">
        <div className="w-full max-w-[420px] glass-panel rounded-[2.5rem] p-10 space-y-8 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-hanken tracking-tight text-white leading-none">Security Check</h1>
            <p className="text-on-surface-variant text-[11px] font-medium leading-relaxed uppercase tracking-widest opacity-80">
              Verification code sent to <br />
              <span className="text-white normal-case tracking-normal">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-white/5 border border-white/10 rounded-2xl text-center text-xl font-bold text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm shadow-2xl shadow-primary/20 group"
            >
              {loading ? "Verifying..." : "Confirm Identity"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center space-y-4">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[11px] font-bold text-on-surface-variant hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {resending ? "RESENDING..." : "Didn't receive code? Resend"}
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-[0.2em]"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 px-6 pt-6 pb-4 flex justify-between items-center text-[10px] font-semibold tracking-widest text-white/50 uppercase">
        <p>© 2026 Lumina AI</p>
        <div className="flex gap-10">
          <span>Secure Channel</span>
          <span>Gateway Verification</span>
        </div>
      </footer>
    </div>
  );
};

export default VerifyEmail;
