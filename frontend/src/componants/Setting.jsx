import {
  LogOut, Camera, User, Mail, CheckCircle2, ShieldCheck, 
  Settings2, Sparkles, Briefcase, Zap, Globe, Fingerprint 
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Setting() {
  const navigate = useNavigate();
  const { user, setUser, checkAuth } = useAuth();

  const [imgLoading, setImgLoading] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({ fullname: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((pre) => ({ ...pre, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfileInfo = async () => {
    try {
      setUpdateProfile(true);
      let res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        checkAuth();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateProfile(false);
    }
  };

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setImgLoading(true);
      let res = await fetch(`${API_URL}/api/auth/update-profile-picture`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      setUser((prev) => ({
        ...prev,
        ProfilePicture: data.image,
      }));
      toast.success("Avatar updated!");
    } catch (error) {
      console.log(error);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-14 bg-[var(--color-crm-bg)] min-h-screen font-sans selection:bg-indigo-100">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Settings2 size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Security & Profile</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] text-slate-900">
            Settings<span className="text-indigo-600">.</span>
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 h-14 px-8 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm active:scale-95"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-7xl mx-auto">
        
        {/* --- LEFT: AVATAR CARD --- */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden group">
            <div className="relative flex flex-col items-center z-10">
              <div className="relative group/avatar">
                {/* Decorative Ring */}
                <div className="absolute -inset-4 border-2 border-dashed border-indigo-100 rounded-[3.5rem] group-hover/avatar:rotate-45 transition-transform duration-1000" />
                
                <div className="w-44 h-44 rounded-[2.8rem] bg-white p-1 relative overflow-hidden shadow-2xl transition-transform group-hover/avatar:scale-[1.02]">
                  {imgLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-md z-20">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={user?.ProfilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-full h-full object-cover rounded-[2.5rem]"
                    alt="Profile"
                  />
                </div>

                <label
                  htmlFor="profileImg"
                  className="absolute -bottom-2 -right-2 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl cursor-pointer hover:bg-indigo-600 hover:scale-110 active:scale-90 transition-all border-4 border-white"
                >
                  <Camera size={20} />
                </label>
                <input type="file" id="profileImg" accept="image/*" hidden onChange={(e) => e.target.files[0] && updateProfilePicture(e.target.files[0])} />
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {profile.fullname || "User Name"}
                </h3>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                  <ShieldCheck size={12} /> Verified Member
                </div>
              </div>

              <div className="w-full mt-12 space-y-3">
                <div className="p-5 rounded-3xl bg-white/40 border border-white flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Auth</span>
                  <Fingerprint size={16} className="text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: FORM CARD --- */}
        <div className="xl:col-span-8">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[3.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[1.8rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Zap size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Hub</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile & Communication Node</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                  <User size={12} /> Legal Identity
                </label>
                <input
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleChange}
                  className="w-full h-16 bg-white/50 border border-slate-100 rounded-2xl px-6 font-bold text-lg text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={12} /> Data Sync Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full h-16 bg-white/50 border border-slate-100 rounded-2xl px-6 font-bold text-lg text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3 mb-12">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Briefcase size={12} /> Professional Summary
              </label>
              <div className="relative">
                <textarea
                  placeholder="Mission statement or role description..."
                  className="w-full h-44 bg-white/50 border border-slate-100 rounded-[2.5rem] p-8 font-medium text-lg text-slate-700 focus:bg-white focus:border-indigo-600 outline-none transition-all resize-none shadow-sm"
                />
                <Sparkles className="absolute bottom-8 right-8 text-indigo-100" size={32} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Globe size={24} className="animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 max-w-[220px] leading-tight uppercase tracking-widest">
                  Changes will be propagated across the system.
                </p>
              </div>
              
              <button
                onClick={updateProfileInfo}
                disabled={updateProfile}
                className={`h-20 px-14 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-2xl
                  ${updateProfile 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-2 active:scale-95 shadow-indigo-100"}`}
              >
                {updateProfile ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {updateProfile ? "Synchronizing..." : "Authorize Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;