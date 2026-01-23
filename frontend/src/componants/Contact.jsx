import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  Mail,
  Phone,
  Clock,
  Layers,
  ArrowUpRight,
  FileSpreadsheet,
  User,
  MessageCircle,
  Filter, 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ContactFilter from "./ContactFilter";
import LeadDetailModal from "./LeadDetail";
// import LeadDetailModal from "./LeadDetailModal"; // Import the modal
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Contact() {
  const [isForm, setIsForm] = useState(false);
  const { user } = useAuth();
  const [leadData, setLeadData] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterForm,setFilterForm]=useState(false)
  const filterBtnRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState({ status: [] });
  
  // --- NEW STATE: To track clicked lead ---
  const [selectedLead, setSelectedLead] = useState(null);

  const [taskData, setTaskData] = useState({
    fullname: "",
    email: "",
    phone: "",
    status: "New Leads", 
  });

  const fetchLead = async () => {
    try {
      let res = await fetch(`${API_URL}/api/tasks/fetch-lead`, { credentials: "include" });
      let data = await res.json();
      setLeadData(data);
    } catch (err) { console.error("Fetch failed"); }
  };

  useEffect(() => { fetchLead(); }, []);

  // --- DELETE FUNCTION ---
  const handleDeleteLead = async (id) => {
    if(!window.confirm("Are you sure you want to delete this contact permanently?")) return;

    try {
        let res = await fetch(`${API_URL}/api/tasks/delete-task`, { // Check your backend route for deleting
            method: "DELETE", // Or POST depending on your API
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id }) // Assuming backend expects { id: ... }
        });

        if (res.ok) {
            // Update UI locally
            setLeadData(prev => prev.filter(item => item._id !== id));
            setSelectedLead(null); // Close modal
        } else {
            alert("Failed to delete contact");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await fetch(`${API_URL}/api/tasks/contact-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...taskData, status: "New Leads" }),
    });
    if (res.ok) {
      fetchLead();
      setIsForm(false);
      setTaskData({ fullname: "", email: "", phone: "", status: "New Leads" });
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("leadsFile", file);
    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/api/tasks/upload-leads`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Backend error:", data);
        alert(data.message || "Upload failed");
        return;
      }
      alert("Upload successful");
      setFile(null);
      fetchLead();
    } catch (err) {
      console.error("Network error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const filteredLeads = leadData.filter((ele) => {
    const q = search.toLowerCase();
    const matchData = ele.fullname?.toLowerCase().includes(q) || ele.email?.toLowerCase().includes(q);
    const matchStatus = activeFilters.status.length === 0 || activeFilters.status.includes(ele.status);
    return matchData && matchStatus
  });

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleApplyFilter = (filtered) => {
    setActiveFilters(filtered);
    setFilterForm(false);
  }

  const handleClearFilter = () => {
    setActiveFilters({ status: [] });
  }

  const openGmail = (lead, user) => {
    const to = lead.email;
    const subject = `Regarding your inquiry`;
    const body = `Hello ${lead.fullname},\n\nI am contacting you regarding your inquiry.\nPlease let me know a good time to connect.\n\nRegards,\n${user?.name || "Team"}`;
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailURL, "_blank");
  };

  const getWhatsAppMessage = (lead) => {
    return encodeURIComponent(`Hello ${lead.fullname},\n\nI am contacting you regarding your inquiry.\nPlease let me know a good time to connect.\n\nRegards,\nTeam`);
  };

  return (
    <div className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12 bg-[#E3E4DB] min-h-screen font-sans selection:bg-[#AEA4BF] selection:text-white transition-all duration-500">
      
      {/* ================= MODAL RENDER ================= */}
      {selectedLead && (
        <LeadDetailModal 
            data={selectedLead}
            user={user}
            isAdmin={user?.role === "admin"}
            onClose={() => setSelectedLead(null)}
            onDelete={handleDeleteLead}
        />
      )}

      {/* ================= HEADER SECTION ================= */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#8F6593] font-black text-xs uppercase tracking-[0.3em]">
            <span className="w-8 h-[2px] bg-[#8F6593]"></span>
            <Layers size={14} /> 
            <span>Directory Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#3B252C] tracking-tighter leading-none">
            Contacts<span className="text-[#8F6593]">.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8F6593]/50" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/40 border-2 border-transparent focus:bg-white focus:border-[#AEA4BF] outline-none transition-all shadow-sm text-[#3B252C] font-medium placeholder:text-gray-400"
            />
          </div>
          
          {/* FILTER BUTTON */}
          <button 
            ref={filterBtnRef}
            className="h-16 px-6 rounded-2xl bg-white text-[#3B252C] font-bold flex items-center gap-3 hover:bg-[#8F6593] hover:text-white transition-all shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 group"
            onClick={()=> setFilterForm(!filterForm)}
          >
            <Filter size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Filter</span>
          </button>

          {/* ADMIN ACTIONS */}
          {user?.role === "admin" && (
            <div className="flex gap-3">
              <label className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white text-[#3B252C] hover:bg-[#8F6593] hover:text-white transition-all cursor-pointer shadow-sm group border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
                <FileSpreadsheet size={24} className="group-hover:scale-110 transition-transform" />
                <input type="file" accept=".xlsx,.xls" hidden onChange={(e) => setFile(e.target.files[0])} />
              </label>
              
              <button
                onClick={() => setIsForm(true)}
                className="h-16 px-8 rounded-2xl bg-[#3B252C] text-white font-bold flex items-center gap-3 hover:bg-[#8F6593] transition-all shadow-xl active:scale-95 border-b-4 border-black/20"
              >
                <Plus size={22} strokeWidth={3} /> 
                <span className="hidden sm:inline">Add Lead</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* File Upload Toast */}
      {file && (
        <div className="mb-8 p-5 bg-white rounded-3xl flex flex-col sm:flex-row items-center justify-between border-2 border-[#8F6593] shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-[#E3E4DB] rounded-xl flex items-center justify-center text-[#8F6593]">
                <FileSpreadsheet size={24} />
            </div>
            <div>
              <p className="text-[#3B252C] font-black leading-tight">{file.name}</p>
              <p className="text-xs text-[#8F6593] font-bold uppercase tracking-wider">Ready for import</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setFile(null)} className="flex-1 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">Discard</button>
            <button onClick={handleFileUpload} disabled={uploading} className="flex-1 px-8 py-3 bg-[#8F6593] text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all">
              {uploading ? "Processing..." : "Import Leads"}
            </button>
          </div>
        </div>
      )}

      {filterForm && (
        <ContactFilter 
            formRef={filterBtnRef}
            onclose={() => setFilterForm(false)}
            onApply={handleApplyFilter}
            onclear={handleClearFilter}
        />
      )}

      {/* ================= DATA TABLE ================= */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-[#3B252C]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#8F6593]">Profile</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#8F6593]">Contact Method</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#8F6593]">Status</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#8F6593]">
                  {user?.role === "admin" ? "Verification" : "Quick Actions"}
                </th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#8F6593] text-right">Acquisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((ele) => (
                <tr 
                    key={ele._id} 
                    // --- ROW CLICK HANDLER ---
                    onClick={() => setSelectedLead(ele)}
                    className="group hover:bg-white/80 transition-all cursor-pointer"
                >
                  {/* Profile Column */}
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-[#AEA4BF] flex items-center justify-center text-white font-black text-xl shadow-inner group-hover:rotate-6 transition-transform">
                          {ele.fullname?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8F6593] border-4 border-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="block font-black text-[#3B252C] text-xl tracking-tight leading-none mb-1">{ele.fullname}</span>
                        <span className="text-[10px] font-bold text-[#8F6593] uppercase tracking-widest bg-[#8F6593]/10 px-2 py-0.5 rounded">Lead</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Column */}
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#3B252C] font-bold text-sm">
                        <Mail size={14} className="text-[#8F6593]" />
                        {ele.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                        <Phone size={14} className="text-[#8F6593]/60" />
                        {ele.phone}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border
                      ${ele.status === 'New Leads' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        ele.status === 'Contacted' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                        ele.status === 'Converted' ? 'bg-green-50 text-green-600 border-green-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${ele.status === 'New Leads' ? 'bg-blue-600' : 
                          ele.status === 'Contacted' ? 'bg-yellow-600' :
                          ele.status === 'Converted' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}></span>
                      {ele.status || 'Pending'}
                    </span>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-6">
                    {user?.role !== "admin" ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}> 
                         {/* Stopped propagation so clicking buttons doesn't just open modal */}
                        <a href={`tel:${ele.phone}`} className="p-3 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm group/btn" title="Call">
                          <Phone size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </a>
                        <a
                          href={`https://wa.me/${ele.phone.replace(/\D/g, '')}?text=${getWhatsAppMessage(ele)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm group/btn"
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </a>
                        <button
                          onClick={() => openGmail(ele, user)}
                          className="p-3 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-500 hover:text-white transition-all shadow-sm group/btn"
                          title="Email"
                        >
                          <Mail size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3E4DB] text-[#3B252C] text-xs font-black uppercase tracking-tighter">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Verified
                      </div>
                    )}
                  </td>

                  {/* Time Column */}
                  <td className="px-10 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-sm font-black text-[#3B252C] tracking-tighter">
                        <Clock size={14} className="text-[#8F6593]" />
                        {timeAgo(ele.createdAt)}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">System Generated</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="py-20 text-center">
            <User size={48} className="mx-auto text-[#CDCDCD] mb-4" />
            <h3 className="text-xl font-black text-[#3B252C]">No contacts found</h3>
            <p className="text-[#8F6593] font-medium">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* ================= CREATE LEAD MODAL ================= */}
      {isForm && (
        <div className="fixed inset-0 bg-[#3B252C]/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-12 rounded-[3.5rem] w-full max-w-lg shadow-[0_32px_64px_-12px_rgba(59,37,44,0.3)] relative border border-white"
          >
            <button 
              type="button" 
              onClick={() => setIsForm(false)}
              className="absolute right-10 top-10 p-3 hover:bg-[#E3E4DB] rounded-full transition-all text-[#3B252C]"
            >
              <X size={24} />
            </button>

            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-[#AEA4BF]/20 rounded-3xl flex items-center justify-center text-[#8F6593] mx-auto mb-4">
                <Plus size={32} />
              </div>
              <h2 className="text-4xl font-black text-[#3B252C] tracking-tighter">New Contact</h2>
              <p className="text-[#8F6593] text-xs font-black uppercase tracking-[0.2em] mt-2">Fill in the details below</p>
            </div>

            <div className="space-y-6">
              {[
                { label: "Full Name", name: "fullname", icon: <User size={18} /> },
                { label: "Email Address", name: "email", icon: <Mail size={18} /> },
                { label: "Phone Number", name: "phone", icon: <Phone size={18} /> }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black uppercase text-[#8F6593] tracking-widest mb-2 ml-4">
                    {field.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">{field.icon}</span>
                    <input
                      name={field.name}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      value={taskData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full h-16 bg-[#E3E4DB]/30 border-2 border-transparent focus:border-[#AEA4BF] focus:bg-white rounded-2xl pl-14 pr-6 outline-none transition-all font-bold text-[#3B252C]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full h-20 bg-[#3B252C] text-white rounded-3xl font-black mt-10 flex items-center justify-center gap-3 hover:bg-[#8F6593] transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0">
              Create Lead Entry <ArrowUpRight size={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Contact;