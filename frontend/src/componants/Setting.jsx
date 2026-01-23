import {
  LogOut,
  Camera,
  User,
  Mail,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Settings2,
  Sparkles,
  Briefcase,
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

  // ❌ REMOVED picture state (BUG SOURCE)

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

      let res = await fetch(
        `${API_URL}/api/auth/update-profile-picture`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      // ✅ FIX: update GLOBAL auth user immediately
      setUser((prev) => ({
        ...prev,
        ProfilePicture: data.image,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="flex-1 lg:ml-64 p-6 md:p-12 bg-[var(--bg-main)] min-h-screen font-sans selection:bg-[var(--accent-soft)]">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="relative">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-main)] flex items-center justify-center text-white shadow-[0_10px_25px_-5px] shadow-[var(--accent-main)] transition-transform group-hover:rotate-12">
              <Settings2 size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">
                System Settings
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[var(--text-main)]/40 font-bold text-[10px] uppercase tracking-[0.2em]">
                  Live Profile Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 h-12 px-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-red-200 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl shadow-red-500/5 active:scale-95"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-7xl mx-auto">
        {/* --- LEFT: PROFILE INFOGRAPHIC CARD --- */}
        <div className="xl:col-span-4 space-y-8">
          <div className="relative bg-white/60 backdrop-blur-2xl border border-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-[var(--accent-main)]">
              <Sparkles size={80} />
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-dashed border-[var(--accent-soft)]/30 rounded-[3rem] animate-[spin_20s_linear_infinite]" />

                <div className="w-44 h-44 rounded-[2.8rem] border-8 border-white shadow-2xl overflow-hidden bg-[var(--bg-muted)] transition-all duration-500 hover:scale-105 hover:-rotate-3">
                  {imgLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-main)]">
                      <div className="w-12 h-12 border-[6px] border-[var(--accent-main)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={
                        user?.ProfilePicture ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  )}
                </div>

                <label
                  htmlFor="profileImg"
                  className="absolute -bottom-2 -right-2 p-4 bg-[var(--accent-main)] text-white rounded-2xl shadow-2xl cursor-pointer hover:scale-110 active:scale-90 transition-all border-4 border-white"
                >
                  <Camera size={20} />
                </label>
                <input
                  type="file"
                  id="profileImg"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files[0] &&
                    updateProfilePicture(e.target.files[0])
                  }
                />
              </div>

              <div className="mt-10 space-y-2">
                <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">
                  {profile.fullname}
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-main)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-main)]/20">
                  <ShieldCheck size={12} /> Verified Member
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="p-4 rounded-3xl bg-white/50 border border-white/80">
                <p className="text-[10px] font-black text-[var(--text-main)]/30 uppercase tracking-widest mb-1">
                  Email Linked
                </p>
                <p className="text-sm font-bold text-[var(--text-main)]/70">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE FORM (UNCHANGED) --- */}
       <div className="xl:col-span-8">
          <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-6 mb-16">
               <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--accent-soft)]/20 flex items-center justify-center text-[var(--accent-main)] shadow-inner">
                  <User size={32} />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Personal Identity</h2>
                  <p className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-[0.3em]">Identity & Communication</p>
               </div>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Input 1 */}
                <div className="group space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]/30 ml-2 transition-colors group-focus-within:text-[var(--accent-main)]">
                    <User size={14} /> Full Legal Name
                  </label>
                  <input
                    name="fullname"
                    value={profile.fullname}
                    onChange={handleChange}
                    className="w-full h-16 rounded-2xl bg-white/80 border border-white/50 px-6 font-bold text-lg text-[var(--text-main)] shadow-[0_4px_15px_rgba(0,0,0,0.02)] focus:shadow-xl focus:shadow-[var(--accent-soft)]/10 focus:ring-0 focus:border-[var(--accent-soft)] outline-none transition-all placeholder:text-[var(--text-main)]/10"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Input 2 */}
                <div className="group space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]/30 ml-2 transition-colors group-focus-within:text-[var(--accent-main)]">
                    <Mail size={14} /> Recovery Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full h-16 rounded-2xl bg-white/80 border border-white/50 px-6 font-bold text-lg text-[var(--text-main)] shadow-[0_4px_15px_rgba(0,0,0,0.02)] focus:shadow-xl focus:shadow-[var(--accent-soft)]/10 focus:ring-0 focus:border-[var(--accent-soft)] outline-none transition-all placeholder:text-[var(--text-main)]/10"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="group space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]/30 ml-2">
                  <Briefcase size={14} /> Professional Description
                </label>
                <textarea
                  placeholder="Describe your role or company..."
                  className="w-full h-44 rounded-[2.5rem] bg-white/80 border border-white/50 p-8 font-medium text-lg text-[var(--text-main)] shadow-inner focus:shadow-xl focus:shadow-[var(--accent-soft)]/10 focus:ring-0 focus:border-[var(--accent-soft)] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button Section */}
              <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--text-main)]/5">
                <p className="text-[10px] font-bold text-[var(--text-main)]/30 max-w-[280px] leading-relaxed italic">
                    All changes are synced across your workspace automatically upon saving.
                </p>
                <button
                  onClick={updateProfileInfo}
                  disabled={updateProfile}
                  className={`relative overflow-hidden h-16 px-14 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white transition-all
                    ${updateProfile ? "bg-gray-400" : "bg-[var(--accent-main)] hover:shadow-[0_15px_30px_-5px] hover:shadow-[var(--accent-main)]/40 hover:-translate-y-1 active:scale-95"}`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    {updateProfile ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Encrypting...
                        </>
                    ) : (
                        <>
                        <CheckCircle2 size={18} /> Sync Changes
                        </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
