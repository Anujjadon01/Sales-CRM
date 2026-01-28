import React, { useState, useEffect } from 'react';
import CallOverviewChart from './CallOverview';
import { 
  Users, Phone, Activity, ArrowUpRight, Clock, Settings, 
  BarChart3, CheckCircle2, HelpCircle, LayoutDashboard, Share2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DashboardContent = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [leadStatus, setLeadStatus] = useState({
    newLead: 0, interested: 0, followUp: 0, notReachable: 0, close: 0
  });

  const fetchUsers = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/get-users`);
      let data = await res.json();
      setActiveUser(data); 
    } catch (error) { console.log(error); }
  };

  const fetchLeadsStatus = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/get-leads-status`);
      let data = await res.json();
      setLeadStatus(data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeadsStatus();
  }, []);

  return (
    <div className="p-6 md:p-10 lg:ml-72 min-h-screen bg-[var(--color-crm-bg)] font-sans text-[var(--color-brand-dark)] selection:bg-[var(--color-brand-mint)]/30 transition-all duration-500">
      
      {/* Header section */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard size={16} className="text-[var(--color-brand-mint)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-sage)]">Intelligence Hub</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[var(--color-brand-dark)]">
            Dashboard<span className="text-[var(--color-brand-mint)]">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/60 backdrop-blur-md border border-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--color-brand-dark)] shadow-sm">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Call Overview Chart Section */}
        <div className="col-span-12 lg:col-span-8 bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-2xl font-black text-[var(--color-brand-dark)] tracking-tight">Call Analytics</h3>
               <p className="text-xs font-bold text-[var(--color-brand-sage)] uppercase tracking-widest mt-1">Real-time Performance</p>
             </div>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">+12.5%</span>
             </div>
           </div>
           <div className="w-full h-[350px]">
             <CallOverviewChart connected={696} total={1604} />
           </div>
        </div>

        {/* Right Column: Agent & Tools */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Agent Activity Card */}
          <div className="bg-gradient-to-br from-[var(--color-brand-dark)] to-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-brand-mint)] rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-[var(--color-brand-sage)]">Active Workforce</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-6xl font-black tracking-tighter">{activeUser || 0}</p>
                  <p className="text-sm font-bold text-[var(--color-brand-mint)] mt-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-mint)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-mint)]"></span>
                    </span>
                    Agents Online
                  </p>
                </div>
                <Users size={48} className="opacity-20" />
              </div>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="grid grid-cols-1 gap-4">
            <ToolCard icon={<BarChart3 />} title="Trends" desc="Pattern recognition" />
            <ToolCard icon={<Settings />} title="Workflow" desc="Automation sync" />
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="col-span-12 mt-6">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-sm font-black text-[var(--color-brand-dark)] uppercase tracking-[0.3em]">Pipeline Stages</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard label="New Lead" count={leadStatus.newLead} icon={<Activity />} color="border-indigo-500" />
            <StatCard label="Interested" count={leadStatus.interested} icon={<ArrowUpRight />} color="border-emerald-500" />
            <StatCard label="Follow-Up" count={leadStatus.followUp} icon={<Clock />} color="border-amber-500" />
            <StatCard label="Unreachable" count={leadStatus.notReachable} icon={<HelpCircle />} color="border-rose-500" />
            <StatCard label="Closed" count={leadStatus.close} icon={<CheckCircle2 />} color="border-slate-900" isDark />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tool Card Component
const ToolCard = ({ icon, title, desc }) => (
  <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/80 shadow-sm flex items-center gap-5 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
    <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-[var(--color-brand-dark)] group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="font-black text-[var(--color-brand-dark)] text-sm uppercase tracking-wider">{title}</p>
      <p className="text-[10px] text-[var(--color-brand-sage)] font-black uppercase tracking-widest mt-0.5">{desc}</p>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ label, count, icon, color, isDark }) => (
  <div className={`p-6 rounded-[2.5rem] border-l-8 ${color} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${isDark ? 'bg-[var(--color-brand-dark)] text-white' : 'bg-white/60 backdrop-blur-md border border-white'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-slate-100 text-slate-600'} group-hover:bg-[var(--color-brand-mint)] group-hover:text-white transition-colors`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    </div>
    <p className="text-4xl font-black tracking-tighter">
      {count ? count.toLocaleString() : 0}
    </p>
  </div>
);

export default DashboardContent;