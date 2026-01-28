import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Zap, BarChart3, ShieldCheck, TrendingUp, Sparkles, ChevronRight, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lead, setLead] = useState([]);

  let interestedLeads = lead.filter((ele) => ele.status === "Interested");

  const fetchLead = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/fetch-lead`, { credentials: "include" });
      let data = await res.json();
      setLead(data);
    } catch (err) {
      console.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  const stats = [
    {
      label: "Total Leads",
      value: lead.length,
      icon: <Users size={22} />,
      trend: "+12.5%",
      subText: "Total prospects in funnel"
    },
    {
      label: "Interested",
      value: interestedLeads.length,
      icon: <Zap size={22} />,
      trend: "+8.2%",
      subText: "Ready for conversion"
    },
    {
      label: "Win Rate",
      value: lead.length > 0 ? `${Math.round((interestedLeads.length / lead.length) * 100)}%` : "0%",
      icon: <PieChart size={22} />,
      trend: "+4.1%",
      subText: "Efficiency benchmark"
    },
  ];

  return (
    <div className="flex-1 lg:ml-72 min-h-screen bg-[var(--color-crm-bg)] font-sans text-[#3B252C] selection:bg-[#8F6593] selection:text-white">
      
      {/* --- PREMIUM HEADER --- */}
      <header className="sticky top-0 z-40 bg-[var(--color-crm-bg)]/80 backdrop-blur-xl border-b border-[#3B252C]/5 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#3B252C] flex items-center justify-center shadow-lg shadow-[#3B252C]/20">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-[#3B252C]">Nexus Core</h1>
            <p className="text-[10px] font-bold text-[#8F6593] uppercase">Operational Intelligence</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-white/40 p-1.5 rounded-full border border-white/60 shadow-inner">
           <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-2"></div>
           <span className="text-[10px] font-black uppercase tracking-tighter pr-3">Live Feed</span>
        </div>
      </header>

      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        
        {/* --- DYNAMIC HERO --- */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#8F6593]/10 text-[#8F6593] mb-6">
                <Sparkles size={14} className="fill-[#8F6593]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Dashboard v2.1.0</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-[#3B252C] leading-[0.9] tracking-tighter mb-6">
                Welcome, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B252C] via-[#8F6593] to-[#AEA4BF]">
                  {user?.name?.split(' ')[0] || "Strategist"}
                </span>
              </h2>
              <p className="text-lg font-medium text-[#3B252C]/70 leading-relaxed italic">
                Your pipeline is currently optimized. You have <span className="text-[#3B252C] font-bold underline decoration-[#8F6593] decoration-2">{interestedLeads.length} leads</span> waiting for a follow-up action.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button 
                onClick={() => navigate("/contact")}
                className="group px-8 py-5 bg-[#3B252C] text-white rounded-[1.5rem] font-bold shadow-2xl shadow-[#3B252C]/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                Lead Manager <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/pipeline")}
                className="px-8 py-5 bg-white/60 backdrop-blur-sm border border-white rounded-[1.5rem] font-bold text-[#3B252C] hover:bg-white transition-all shadow-sm"
              >
                Pipeline View
              </button>
            </div>
          </div>
        </section>

        {/* --- STATS GRID (GLASS CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="group relative bg-white/50 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              {/* Decorative Circle Background */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#8F6593]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#3B252C] shadow-md border border-[#8F6593]/10">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-[#8F6593] text-[10px] font-black bg-white px-3 py-1.5 rounded-full border border-[#8F6593]/20">
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-[11px] font-black text-[#8F6593] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h4 className="text-6xl font-black text-[#3B252C] tracking-tighter mb-2">{stat.value}</h4>
                <p className="text-xs font-medium text-[#3B252C]/50">{stat.subText}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- ACTION FOOTER --- */}
        <div className="mt-12 p-10 bg-gradient-to-br from-[#3B252C] to-[#8F6593] rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
           <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Automated Insights</h3>
              <p className="text-white/70 max-w-sm font-medium">Nexus Intelligence just identified 4 leads with high-intent behavior. Check your directory now.</p>
           </div>
           <button className="bg-white text-[#3B252C] px-10 py-4 rounded-2xl font-black text-sm hover:bg-[#AEA4BF] transition-colors shadow-lg shadow-black/20">
              View Analysis
           </button>
        </div>

      </main>
    </div>
  );
};

export default Home;