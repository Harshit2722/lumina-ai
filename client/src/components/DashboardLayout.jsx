import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  History, 
  Settings, 
  LogOut, 
  User, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/axios';
import { toast } from 'react-hot-toast';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
        : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} className={`${active ? 'text-on-primary' : 'group-hover:scale-110 transition-transform'}`} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Sparkles, label: 'AI Generator', path: '/generate' },
    { icon: ImageIcon, label: 'Image Studio', path: '/images' },
    { icon: History, label: 'Neural History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex relative overflow-hidden font-inter">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] animate-layer-1" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[160px] animate-layer-2" />
      </div>
      <div className="noise-overlay" />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 h-screen flex-col relative z-20 border-r border-white/5 bg-black/20 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={18} className="text-on-primary" />
          </div>
          <span className="text-xl font-bold font-hanken tracking-tight">Lumina AI</span>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          {/* Credit Card */}
          <div className="glass-panel p-4 rounded-2xl border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Neural Credits</span>
              <Zap size={12} className="text-primary fill-primary" />
            </div>
            <div className="text-2xl font-bold mb-1">2,450</div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_8px_rgba(231,195,101,0.5)]"></div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow h-screen flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-black/10 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-on-surface"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold font-hanken tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.label || 'Neural Workspace'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <Zap size={14} className="text-primary fill-primary" />
              <span className="text-xs font-bold text-white">2.4k <span className="text-on-surface-variant font-medium ml-1">Credits</span></span>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-orange-500 p-[1px]">
              <div className="h-full w-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                <User size={20} className="text-on-surface-variant" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 w-72 h-full bg-surface border-r border-white/10 p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-on-primary" />
                </div>
                <span className="text-xl font-bold font-hanken">Lumina AI</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-on-surface-variant">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  {...item}
                  active={location.pathname === item.path}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
