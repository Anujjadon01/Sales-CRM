import React, { useState, useEffect } from 'react';
import CallOverviewChart from './CallOverview';

import { 
  Users, 
  Phone, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Settings, 
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DashboardContent = () => {
  const [activeUser, setActiveUser] = useState(0); // Assuming this returns a number
  const [leadStatus, setLeadStatus] = useState({
    newLead: 0,
    interested: 0,
    followUp: 0,
    notReachable: 0,
    close: 0
  });

  const fetchUsers = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/get-users`);
      res = await res.json();
      // Assuming API returns array or count. If array: res.length
      setActiveUser(res); 
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLeadsStatus = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/get-leads-status`);
      res = await res.json();
      setLeadStatus(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeadsStatus();
  }, []);

  return (
    <div className="p-6 md:p-8 lg:ml-72 min-h-screen bg-[#E3E4DB] font-sans text-[#3B252C] selection:bg-[#8F6593] selection:text-white transition-all duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#3B252C]">Dashboard</h1>
          <p className="text-[#8F6593] font-medium mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F6593] animate-pulse"></span>
            Overview of your performance today.
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-[#CDCDCD] px-4 py-2 rounded-xl text-sm font-bold text-[#3B252C] shadow-sm">
          {new Date().toDateString()}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Call Overview Chart Section */}
        <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-[#3B252C]">Call Analytics</h3>
             <button className="p-2 bg-[#E3E4DB] rounded-full hover:bg-[#CDCDCD] transition-colors">
               <ArrowUpRight size={20} className="text-[#3B252C]" />
             </button>
           </div>
           {/* Wrapping your chart to ensure it fits the theme */}
           <div className="w-full h-full min-h-[300px]">
             <CallOverviewChart connected={696} total={1604} />
           </div>
        </div>

        {/* Right Column: Agent & Tools */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Agent Activity */}
          <div className="bg-[#3B252C] text-[#E3E4DB] p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8F6593] rounded-full blur-[50px] opacity-50"></div>
            
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <Users size={20} className="text-[#AEA4BF]" /> Agent Status
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8F6593] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8F6593]"></span>
                  </span>
                  <span className="text-sm font-medium text-[#E3E4DB]">Active Agents</span>
                </div>
                <span className="text-2xl font-black text-white">{activeUser || 0}</span>
              </div>

            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-[2rem] border border-[#CDCDCD] shadow-sm flex items-center gap-4 hover:border-[#8F6593] hover:shadow-md transition-all cursor-pointer group">
              <div className="bg-[#E3E4DB] text-[#3B252C] p-3.5 rounded-2xl group-hover:bg-[#3B252C] group-hover:text-white transition-colors">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="font-bold text-[#3B252C] text-sm">User Trends</p>
                <p className="text-xs text-[#8F6593] font-medium">Analyze patterns</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[2rem] border border-[#CDCDCD] shadow-sm flex items-center gap-4 hover:border-[#8F6593] hover:shadow-md transition-all cursor-pointer group">
              <div className="bg-[#E3E4DB] text-[#3B252C] p-3.5 rounded-2xl group-hover:bg-[#8F6593] group-hover:text-white transition-colors">
                <Settings size={24} />
              </div>
              <div>
                <p className="font-bold text-[#3B252C] text-sm">Workflow</p>
                <p className="text-xs text-[#8F6593] font-medium">Automations & API</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads by Stage Section */}
        <div className="col-span-12 mt-4">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-[#3B252C]">Pipeline Stages</h3>
            <div className="h-[1px] flex-1 bg-[#CDCDCD]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
              label="New Lead" 
              count={leadStatus.newLead} 
              icon={<Activity size={18} />}
              color="border-[#8F6593]" // Primary Purple
              textColor="text-[#8F6593]"
            />
            <StatCard 
              label="Interested" 
              count={leadStatus.interested} 
              icon={<ArrowUpRight size={18} />}
              color="border-[#3B252C]" // Dark Brown
              textColor="text-[#3B252C]"
            />
            <StatCard 
              label="Follow-Up" 
              count={leadStatus.followUp} 
              icon={<Clock size={18} />}
              color="border-[#AEA4BF]" // Lavender
              textColor="text-[#AEA4BF]" // Using dark text for readability on follow up
            />
            <StatCard 
              label="Unreachable" 
              count={leadStatus.notReachable} 
              icon={<HelpCircle size={18} />}
              color="border-[#CDCDCD]" // Grey
              textColor="text-gray-500"
            />
             <StatCard 
              label="Closed" 
              count={leadStatus.close} 
              icon={<CheckCircle2 size={18} />}
              color="border-[#3B252C]" 
              textColor="text-[#3B252C]"
              bg="bg-[#E3E4DB]" // Different background for closed
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Component for Lead Cards
const StatCard = ({ label, count, icon, color, textColor, bg = "bg-white" }) => (
  <div className={`${bg} p-5 rounded-[1.5rem] border-b-4 ${color} shadow-sm hover:translate-y-[-4px] transition-transform duration-300`}>
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl bg-[#E3E4DB] ${textColor}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black tracking-widest uppercase text-[#8F6593]">{label}</span>
    </div>
    <p className="text-3xl font-black text-[#3B252C] mt-2">
      {count ? count.toLocaleString() : 0}
    </p>
  </div>
);

export default DashboardContent;