import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Contact,
  Settings,
  ChartBar,
  Menu,
  X,
  Sparkles,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Updated logic to use your brand colors
  const navLinkClass = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
    ${
      isActive
        ? "bg-[var(--color-crm-accent)] text-[var(--color-brand-dark)] shadow-lg shadow-[var(--color-brand-mint)]/30 translate-x-1"
        : "text-[var(--color-brand-dark)]/70 hover:bg-[var(--color-brand-sage)]/20 hover:text-[var(--color-brand-dark)] hover:translate-x-1"
    }
  `;

  return (
    <>
      {/* MOBILE TOGGLE */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-5 left-5 z-40 p-3 rounded-2xl bg-[var(--color-brand-white)]/80 backdrop-blur-md border border-[var(--color-brand-white)]/40 shadow-xl text-[var(--color-crm-accent)] active:scale-90 transition-all"
        >
          <Menu size={24} />
        </button>
      )}

      {/* BACKDROP */}
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
        bg-[var(--color-crm-bg)]
        border-r border-[var(--color-brand-sage)]/30
        p-6 flex flex-col
        transition-all duration-500 ease-in-out
        ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* HEADER / LOGO */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-crm-accent)] rounded-xl flex items-center justify-center text-[var(--color-brand-dark)] shadow-lg rotate-3">
              <Sparkles size={22} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-xl text-[var(--color-brand-dark)] tracking-tighter uppercase">
                Lead<span className="text-[var(--color-brand-sage)]">Flow</span>
              </h2>
              <p className="text-[10px] font-bold text-[var(--color-brand-dark)]/40 tracking-widest uppercase -mt-1">Enterprise</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 hover:bg-black/5 rounded-full text-[var(--color-brand-dark)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION SECTION */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-[var(--color-brand-dark)]/30 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          <nav className="flex flex-col gap-2">
            <NavLink to={user?.role === "admin" ? "/dashboard" : "/home"} className={navLinkClass}>
              {user?.role === "admin" ? (
                <>
                  <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="font-bold text-sm">Dashboard</span>
                </>
              ) : (
                <>
                  <Home size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="font-bold text-sm">Home</span>
                </>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              <Contact size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Contacts</span>
            </NavLink>

            {user?.role === "user" && (
              <NavLink to="/pipeline" className={navLinkClass}>
                <ChartBar size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-sm">Sales Pipeline</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* FOOTER / USER PROFILE */}
        <div className="mt-auto pt-8 border-t border-[var(--color-brand-dark)]/10 space-y-4">
          <NavLink to="/setting" className={navLinkClass}>
            <Settings size={20} className="group-hover:spin-slow transition-transform" />
            <span className="font-bold text-sm">Settings</span>
          </NavLink>

          <div className="flex items-center gap-3 bg-[var(--color-brand-white)]/40 backdrop-blur-md p-3 rounded-2xl border border-[var(--color-brand-white)]/60 shadow-sm">
            <div className="relative">
              <img
                src={user?.ProfilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-11 h-11 rounded-[14px] object-cover border-2 border-[var(--color-brand-white)] shadow-sm"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-brand-mint)] border-2 border-[var(--color-brand-white)] rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-[var(--color-brand-dark)] truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-[10px] font-bold text-[var(--color-brand-dark)]/40 uppercase tracking-widest">
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