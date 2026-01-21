import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Zap, BarChart, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user} = useAuth();
  const navigate = useNavigate();
const [lead,setLead]=useState([])

let data=lead.filter((ele)=>ele.status=="Interested")



   const fetchLead = async () => {
      try {
        let res = await fetch("http://localhost:3000/api/tasks/fetch-lead", { credentials: "include" });
        let data = await res.json();
        setLead(data);
        
      } catch (err) { console.error("Fetch failed"); }
    };
  
    useEffect(() => { fetchLead(); }, []);

  const stats = [
    {
      label: "Total Leads",
      value:`${lead.length}`,
      icon: <Users size={22} />,
      // Theme: Purple (#8F6593)
      theme: {
        text: "text-[#8F6593]",
        bg: "bg-[#8F6593]",
        lightBg: "bg-[#8F6593]/10",
        border: "border-[#8F6593]/20"
      },
      trend: "+12%"
    },
    {
      label: "Interested Leads",
      value: `${data.length}`,
      icon: <Zap size={22} />,
      // Theme: Dark Brown (#3B252C)
      theme: {
        text: "text-[#3B252C]",
        bg: "bg-[#3B252C]",
        lightBg: "bg-[#3B252C]/10",
        border: "border-[#3B252C]/20"
      },
      trend: "+5%"
    },
    {
      label: "Conversion",
      value: "64%",
      icon: <BarChart size={22} />,
      // Theme: Lavender (#AEA4BF)
      theme: {
        text: "text-[#AEA4BF]",
        bg: "bg-[#AEA4BF]",
        lightBg: "bg-[#AEA4BF]/20",
        border: "border-[#AEA4BF]/40"
      },
      trend: "+8%"
    },
  ];



  return (
    // Main Background changed to #E3E4DB
    <div className="flex-1 lg:ml-72 min-h-screen bg-[#E3E4DB] font-sans text-[#3B252C] flex flex-col transition-all duration-500 overflow-x-hidden">

      {/* --- TOP HEADER --- */}
      <header className="sticky top-0 z-40 flex justify-between items-center bg-[#E3E4DB]/80 backdrop-blur-md px-6 md:px-10 py-4 border-b border-[#CDCDCD]/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8F6593] to-[#3B252C] shadow-lg flex items-center justify-center">
            <ShieldCheck size={22} className="text-[#E3E4DB]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xs font-black uppercase tracking-widest text-[#8F6593] mb-0.5">Nexus CRM</h1>
            <p className="text-[10px] font-bold text-[#3B252C]/50 uppercase">Enterprise Dashboard</p>
          </div>
        </div>

        
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 p-6 md:p-12 relative flex flex-col items-center">
        {/* Abstract Background Elements - Updated to Palette Colors */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8F6593]/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#AEA4BF]/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-6xl">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 rounded-full bg-white/80 border border-[#CDCDCD] shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#8F6593] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B252C]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B252C]/70 flex items-center gap-2">
                <Sparkles size={12} className="text-[#AEA4BF]" />
                Live Market Sync Active
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#3B252C] tracking-tight leading-[0.9] mb-8">
              Empower Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F6593] via-[#AEA4BF] to-[#3B252C]">
                Sales Engine.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#3B252C]/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Hello, <span className="text-[#8F6593] font-bold">{user?.name || "Rahul"}</span>.
              Ready to crush your targets today? Here's what's happening.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              onClick={() => navigate("/contact")}
              // Button Primary: Dark Brown Background
              className="group w-full sm:w-auto bg-[#3B252C] text-[#E3E4DB] px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_10px_30px_-10px_rgba(59,37,44,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(59,37,44,0.6)] hover:bg-[#2A1A1F] transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Access Contacts
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-[#AEA4BF]" />
            </button>

            <button
              onClick={() => navigate("/pipeline")}
              // Button Secondary: Light with border
              className="w-full sm:w-auto bg-white text-[#3B252C] border border-[#CDCDCD] hover:border-[#8F6593] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#E3E4DB]/50 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
            >
              View Pipeline
            </button>
          </div>

          {/* Stats Grid - Redesigned to strict palette */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className={`group bg-white p-8 rounded-[2.5rem] border ${stat.theme.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}>
                
                {/* Subtle colorful background blob on hover */}
                <div className={`absolute -right-10 -top-10 w-40 h-40 ${stat.theme.bg} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`${stat.theme.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-[#E3E4DB] shadow-md group-hover:rotate-6 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className={`flex items-center gap-1 ${stat.theme.text} text-xs font-black ${stat.theme.lightBg} px-3 py-1.5 rounded-full`}>
                      <TrendingUp size={12} />
                      {stat.trend}
                    </div>
                </div>

                <div className="relative z-10">
                  <p className={`text-xs font-bold ${stat.theme.text} uppercase tracking-widest mb-2 opacity-80`}>{stat.label}</p>
                  <h4 className="text-5xl font-black text-[#3B252C]">{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;