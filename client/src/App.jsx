import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Toaster } from "react-hot-toast";
import { logoutUser } from './api/axios';
import { useAuth } from './context/AuthContext';
import {toast} from 'react-hot-toast';



// Dummy component for Dashboard
const Dashboard = () => {
  const {setUser} = useAuth();

   const logout = async function(){
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ||"Logout failed");
    }
  }

  return (
    <div className="min-h-screen bg-surface p-8 relative overflow-hidden font-inter">
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Subtle Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-layer-1" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[160px] animate-layer-2" />
      </div>

      <div className="flex justify-between items-center mb-12 relative z-10">
        <h1 className="text-3xl font-bold font-hanken tracking-tight text-on-surface">Dashboard</h1>
        <button 
          onClick={logout} 
          className="btn-secondary !rounded-full border-primary/20 text-primary hover:bg-primary/10"
        >
          Logout
        </button>
      </div>

      <div className="glass-panel p-12 rounded-2xl relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold font-hanken">Initialize Complete</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Welcome to the protected Lumina AI workspace. Your neural gateway is now active. 
          The dashboard implementation is coming in Phase 2.
        </p>
      </div>
    </div>
  )
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position='top-right'/>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
            />
        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;
