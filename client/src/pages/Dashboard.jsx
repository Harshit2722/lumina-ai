import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Zap, Image as ImageIcon, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const QuickAction = ({ icon: Icon, title, description, color }) => (
  <button className="glass-panel p-6 rounded-3xl text-left hover:scale-[1.02] transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity`} />
    <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <h3 className="text-lg font-bold font-hanken mb-2 text-white">{title}</h3>
    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{description}</p>
    <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">
      Initialize <ArrowRight size={14} />
    </div>
  </button>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      toast.success(`Neural Gateway Synchronized. Welcome back, ${user?.name?.split(' ')[0] || 'Explorer'}!`);
      // Remove the query param from URL without refreshing
      searchParams.delete('login');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, user]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-surface-container to-[#1a181e] p-10 border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase">
            <Sparkles size={12} /> Neural Gateway Active
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-hanken tracking-tight leading-tight text-white">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Explorer'}</span>.
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Your neural workspace is synchronized. What intelligence would you like to manifest today?
          </p>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-hanken px-2">Neural Workspace Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction 
            icon={MessageSquare}
            title="Text Synthesis"
            description="Generate high-precision content, code, or creative writing with neural logic."
            color="bg-primary"
          />
          <QuickAction 
            icon={ImageIcon}
            title="Visual Manifestation"
            description="Transform your concepts into high-fidelity digital art and visual assets."
            color="bg-purple-500"
          />
          <QuickAction 
            icon={Zap}
            title="Rapid Optimization"
            description="Analyze and refine your existing data with boundless AI processing power."
            color="bg-orange-500"
          />
        </div>
      </section>

      {/* Stats/Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-[2rem] space-y-6">
          <h3 className="text-lg font-bold font-hanken">System Analytics</h3>
          <div className="space-y-4">
            {[
              { label: 'Neural Efficiency', value: '98.4%' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Response Latency', value: '240ms' }
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-on-surface-variant">{stat.label}</span>
                <span className="text-sm font-bold text-white tracking-tight">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] bg-primary/5 border-primary/10 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 animate-pulse">
            <Zap size={32} className="fill-primary" />
          </div>
          <h3 className="text-xl font-bold font-hanken">Unlock Boundless Potential</h3>
          <p className="text-sm text-on-surface-variant max-w-[280px]">
            Upgrade to the Pro tier for unlimited generations and priority model access.
          </p>
          <button className="btn-primary py-2 px-8 text-sm mt-2">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
