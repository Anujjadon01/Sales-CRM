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
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ContactFilter from "./ContactFilter";
import LeadDetailModal from "./LeadDetail";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Contact() {
  const [isForm, setIsForm] = useState(false);
  const { user } = useAuth();
  const [leadData, setLeadData] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterForm, setFilterForm] = useState(false);
  const filterBtnRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState({ status: [] });
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
      if (res.ok) {
        alert("Leads imported successfully!");
        setFile(null);
        fetchLead();
      }
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  // Logic for Filter and Search
  const filteredLeads = leadData.filter((ele) => {
    const q = search.toLowerCase();
    const matchData = ele.fullname?.toLowerCase().includes(q) || ele.email?.toLowerCase().includes(q) || ele.phone?.includes(q);
    const matchStatus = activeFilters.status.length === 0 || activeFilters.status.includes(ele.status);
    return matchData && matchStatus;
  });

  const handleApplyFilter = (filters) => {
    setActiveFilters(filters);
    setFilterForm(false);
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12 bg-[var(--color-crm-bg)] min-h-screen font-sans transition-all duration-500">
      
      {selectedLead && (
        <LeadDetailModal 
            data={selectedLead}
            user={user}
            isAdmin={user?.role === "admin"}
            onClose={() => setSelectedLead(null)}
            onDelete={() => fetchLead()}
        />
      )}

      {/* HEADER WITH ALL ACTIONS */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[var(--color-brand-sage)] font-black text-xs uppercase tracking-[0.3em]">
            <span className="w-8 h-[2px] bg-[var(--color-brand-sage)]"></span>
            <Layers size={14} /> <span>Directory Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--color-brand-dark)] tracking-tighter leading-none">
            Contacts<span className="text-[var(--color-brand-mint)]">.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-brand-sage)]/50" size={20} />
            <input 
              type="text" 
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/40 border-2 border-transparent focus:bg-white focus:border-[var(--color-brand-mint)] outline-none transition-all shadow-sm"
            />
          </div>
          
          {/* FILTER BUTTON */}
          <button 
            ref={filterBtnRef}
            className={`h-16 px-6 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-sm border-b-4 active:border-b-0 active:translate-y-1 ${
              activeFilters.status.length > 0 ? 'bg-[var(--color-brand-dark)] text-white' : 'bg-white text-[var(--color-brand-dark)] border-gray-200'
            }`}
            onClick={()=> setFilterForm(!filterForm)}
          >
            <Filter size={20} />
            <span className="hidden md:inline">Filter</span>
          </button>

          {/* ADMIN ACTIONS: FILE & ADD LEAD */}
          {user?.role === "admin" && (
            <div className="flex gap-3">
              <label className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-sage)] hover:text-white transition-all cursor-pointer shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
                <FileSpreadsheet size={24} />
                <input type="file" accept=".xlsx,.xls" hidden onChange={(e) => setFile(e.target.files[0])} />
              </label>
              
              <button
                onClick={() => setIsForm(true)}
                className="h-16 px-8 rounded-2xl bg-[var(--color-brand-dark)] text-white font-bold flex items-center gap-3 hover:bg-[var(--color-brand-sage)] transition-all shadow-xl active:scale-95 border-b-4 border-black/20"
              >
                <Plus size={22} strokeWidth={3} /> 
                <span className="hidden sm:inline">Add Lead</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* FILE UPLOAD BOX */}
      {file && (
        <div className="mb-8 p-5 bg-white rounded-3xl flex items-center justify-between border-2 border-[var(--color-brand-mint)] shadow-xl">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="text-[var(--color-brand-sage)]" />
            <span className="font-bold text-[var(--color-brand-dark)]">{file.name}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setFile(null)} className="px-4 py-2 text-red-500 font-bold">Discard</button>
            <button onClick={handleFileUpload} className="px-6 py-2 bg-[var(--color-brand-dark)] text-white rounded-xl font-bold">
              {uploading ? "Uploading..." : "Upload Now"}
            </button>
          </div>
        </div>
      )}

      {filterForm && (
        <ContactFilter 
          formRef={filterBtnRef}
          onclose={() => setFilterForm(false)}
          onApply={handleApplyFilter}
          onclear={() => setActiveFilters({ status: [] })}
        />
      )}

      {/* DATA TABLE */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-brand-sage)]">Lead Details</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-brand-sage)]">Status</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-brand-sage)]">Verification</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-brand-sage)] text-right">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((ele) => (
                <tr 
                  key={ele._id} 
                  onClick={() => setSelectedLead(ele)}
                  className="group hover:bg-white/80 transition-all cursor-pointer"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-mist)] flex items-center justify-center text-[var(--color-brand-dark)] font-black">
                        {ele.fullname?.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-black text-[var(--color-brand-dark)] text-lg leading-tight">{ele.fullname}</span>
                        <span className="text-xs text-[var(--color-brand-sage)] font-bold">{ele.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white border border-gray-100 shadow-sm text-[var(--color-brand-dark)]">
                      {ele.status || "New Lead"}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-brand-mint)]/10 text-[var(--color-brand-dark)] text-[10px] font-black uppercase border border-[var(--color-brand-mint)]/20 w-fit">
                      <CheckCircle size={14} className="text-[var(--color-brand-mint)]" />
                      Verified
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-[var(--color-brand-dark)] text-sm">
                    {timeAgo(ele.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE LEAD MODAL */}
      {isForm && (
        <div className="fixed inset-0 bg-[var(--color-brand-dark)]/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] w-full max-w-lg relative shadow-2xl">
            <button type="button" onClick={() => setIsForm(false)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full transition-all">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-[var(--color-brand-dark)] mb-8 tracking-tighter">Add New Lead</h2>
            <div className="space-y-5">
              {['fullname', 'email', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-black uppercase text-[var(--color-brand-sage)] mb-2 ml-2">{field}</label>
                  <input
                    name={field}
                    onChange={handleChange}
                    required
                    className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-[var(--color-brand-mint)] rounded-xl px-5 outline-none font-bold"
                    placeholder={`Enter ${field}...`}
                  />
                </div>
              ))}
            </div>
            <button className="w-full h-16 bg-[var(--color-brand-dark)] text-white rounded-2xl font-black mt-8 hover:bg-[var(--color-brand-sage)] transition-all shadow-lg">
              Save Lead
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Contact;