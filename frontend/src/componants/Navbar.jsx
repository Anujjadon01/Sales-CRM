import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Contact,
  CircleCheck,
  Settings,
  ChartBar,
  ChartNoAxesColumn,
  Menu,
  X,
  Sparkles,
  Home,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
    ${
      isActive
        ? "bg-[var(--accent-main)] text-white shadow-lg shadow-[var(--accent-main)]/20 translate-x-1"
        : "text-[var(--text-main)]/70 hover:bg-white/50 hover:text-[var(--text-main)] hover:translate-x-1"
    }
  `;

  return (
    <>
      {/* MOBILE TOGGLE - Enhanced with Glass Effect */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-5 left-5 z-40 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-xl text-[var(--accent-main)] active:scale-90 transition-all"
        >
          <Menu size={24} />
        </button>
      )}

      {/* BACKDROP - Modern Blur */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-72 z-50
        bg-[var(--bg-main)]
        border-r border-white/40
        p-6 flex flex-col
        transition-all duration-500 ease-in-out
        ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* HEADER / LOGO */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-main)] rounded-xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Sparkles size={22} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-xl text-[var(--text-main)] tracking-tighter uppercase">
                Lead<span className="text-[var(--accent-main)]">Flow</span>
              </h2>
              <p className="text-[10px] font-bold text-[var(--text-main)]/40 tracking-widest uppercase -mt-1">Enterprise</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 hover:bg-black/5 rounded-full text-[var(--text-main)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION SECTION */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-[var(--text-main)]/30 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          <nav className="flex flex-col gap-2">
            <NavLink to={user?.role=="admin"?"/dashboard":"/home"} className={navLinkClass}>
            {user.role=="admin"?(<>
             <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Dashboard</span>
            </>):(<>
             <Home size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Home</span>
            </>)}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              <Contact size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Contacts</span>
            </NavLink>

{user.role=="user"&&
            <NavLink to="/pipeline" className={navLinkClass}>
              <ChartBar size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Sales Pipeline</span>
            </NavLink>
}
            

          </nav>
        </div>

        {/* FOOTER / USER PROFILE */}
        <div className="mt-auto pt-8 border-t border-black/5 space-y-4">
          <NavLink to="/setting" className={navLinkClass}>
            <Settings size={20} className="group-hover:spin-slow transition-transform" />
            <span className="font-bold text-sm">Settings</span>
          </NavLink>

          {/* User Card - Refined */}
          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm">
            <div className="relative">
              <img
                src={user?.ProfilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-11 h-11 rounded-[14px] object-cover border-2 border-white shadow-sm"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-[var(--text-main)] truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-[10px] font-bold text-[var(--text-main)]/40 uppercase tracking-widest">
                Premium User
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;