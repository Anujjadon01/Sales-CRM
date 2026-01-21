import React from "react";
import { X, Phone, Mail, MessageCircle, User, Hash, Globe, Trash2 } from "lucide-react";

const LeadDetailModal = ({ data, onClose, user, onDelete, isAdmin }) => {
  if (!data) return null;

  // --- TIME CALCULATION LOGIC ---
  const timeAgo = (date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleCall = () => window.location.href = `tel:${data.phone}`;
  
  const handleEmail = () => {
    const to = data.email;
    const subject = `Regarding your inquiry`;
    const body = `Hello ${data.fullname},\n\nI am contacting you regarding your inquiry.\n\nRegards,\n${user?.name || "Team"}`;
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailURL, "_blank");
  };

  const handleWhatsApp = () => {
    const message = `Hello ${data.fullname},\n\nI am contacting you regarding your inquiry.`;
    const whatsappURL = `https://wa.me/${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#3B252C]/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="w-full max-w-2xl bg-[#E3E4DB] rounded-3xl shadow-2xl border border-[#CDCDCD] overflow-hidden text-[#3B252C] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#CDCDCD]/50 flex justify-between items-start bg-[#E3E4DB]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#3B252C] flex items-center justify-center text-3xl font-black text-[#E3E4DB] shadow-lg">
              {data.fullname.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#3B252C]">{data.fullname}</h2>
              <div className="flex gap-2 mt-2">
                <span className="bg-[#8F6593] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                  {data.status || "New"}
                </span>
                {/* --- UPDATED TIME SECTION --- */}
                <span className="bg-[#AEA4BF]/30 text-[#3B252C] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-[#AEA4BF]/50">
                   Created: {timeAgo(data.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Delete Button (Only for Admin) */}
            {isAdmin && (
                <button 
                  onClick={() => onDelete(data._id)}
                  className="p-2 bg-red-100 hover:bg-red-500 hover:text-white rounded-full transition-all text-red-600"
                  title="Delete Contact"
                >
                  <Trash2 size={20} />
                </button>
            )}
            <button 
                onClick={onClose}
                className="p-2 bg-[#AEA4BF]/20 hover:bg-[#8F6593] hover:text-white rounded-full transition-all text-[#3B252C]"
            >
                <X size={20} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar bg-[#F2F2EF]">
          
          <div className="bg-white p-6 rounded-2xl border border-[#CDCDCD]/60 shadow-sm">
            <h3 className="text-xs font-black text-[#8F6593] uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={14} /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group cursor-pointer" onClick={handleCall}>
                <p className="text-[10px] text-[#AEA4BF] font-bold uppercase tracking-wider mb-1">Phone Number</p>
                <div className="flex items-center gap-2 text-lg font-bold text-[#3B252C] group-hover:text-[#8F6593] transition-colors">
                  {data.phone}
                  <Phone size={16} className="text-[#AEA4BF]" />
                </div>
              </div>

              <div className="group cursor-pointer" onClick={handleEmail}>
                <p className="text-[10px] text-[#AEA4BF] font-bold uppercase tracking-wider mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-lg font-bold text-[#3B252C] group-hover:text-[#8F6593] transition-colors">
                  <span className="truncate">{data.email}</span>
                  <Mail size={16} className="text-[#AEA4BF]" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#CDCDCD]/60 shadow-sm">
               <p className="text-[10px] text-[#AEA4BF] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Globe size={12} /> Assigned Agent
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#AEA4BF] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0) : "U"}
                 </div>
                 <span className="font-bold text-sm">{user?.name || "Team Member"}</span>
               </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#CDCDCD]/60 shadow-sm">
               <p className="text-[10px] text-[#AEA4BF] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Hash size={12} /> System ID
               </p>
               <span className="font-mono text-[#3B252C] font-bold text-sm tracking-wider">
                 #{data._id.slice(-8).toUpperCase()}
               </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#E3E4DB] border-t border-[#CDCDCD] flex gap-4">
          <button onClick={handleCall} className="flex-1 py-3.5 rounded-xl bg-[#3B252C] hover:bg-[#5a3a44] text-[#E3E4DB] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
            <Phone size={18} /> CALL
          </button>
          <button onClick={handleEmail} className="flex-1 py-3.5 rounded-xl bg-[#8F6593] hover:bg-[#a67aa9] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
            <Mail size={18} /> EMAIL
          </button>
          <button onClick={handleWhatsApp} className="flex-1 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
            <MessageCircle size={18} /> CHAT
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeadDetailModal;