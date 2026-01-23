import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, User, Lock, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import google from "../assets/google2.png";

import authImg from "../assets/RightSide.png";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });

  const handleChange = (e) =>
    setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Logic remains unchanged
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    let result = await res.json();
    if (res.ok) {
      setUser(result.user);
      toast.success("Account created");
      navigate("/dashboard");
    } else toast.error(result.message);
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    let res = await fetch(`${API_URL}/api/auth/google/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
      }),
    });

    let data = await res.json();
    if (res.ok) {
      setUser(data.user);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-10 bg-[#E3E4DB] font-sans selection:bg-[#8F6593] selection:text-white">

      {/* LEFT FORM (Takes 4 columns on desktop) */}
      <div className="lg:col-span-4 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Abstract Background Blur */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#AEA4BF]/20 rounded-full blur-3xl opacity-60" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-[#CDCDCD]/30 group-hover:scale-110 transition-transform">
              <img src={logo} className="w-8" alt="Logo" />
            </div>
            <h1 className="text-2xl font-black text-[#3B252C] tracking-tight italic">
              Lead<span className="text-[#8F6593]">Flow</span>
            </h1>
          </div>

          {/* Registration Card */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(59,37,44,0.08)]">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#3B252C] tracking-tight">
                Get Started
              </h2>
              <p className="text-[#3B252C]/50 font-bold text-sm mt-2">
                Join the network and optimize your workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NAME */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEA4BF] group-focus-within:text-[#8F6593] transition-colors" size={18} strokeWidth={2.5} />
                  <input
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEA4BF] group-focus-within:text-[#8F6593] transition-colors" size={18} strokeWidth={2.5} />
                  <input
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                  />
                </div>
              </div>

              {/* PASSWORDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40 ml-1">Password</label>
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B252C]/20 hover:text-[#8F6593] transition-colors z-10"
                    >
                      {show ? <Eye size={16} strokeWidth={2.5} /> : <EyeOff size={16} strokeWidth={2.5} />}
                    </button>
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-13 pl-5 pr-10 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40 ml-1">Confirm</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      name="repassword"
                      value={data.repassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-13 pl-5 pr-4 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <button className="w-full h-16 rounded-2xl bg-[#8F6593] text-white font-black shadow-[0_15px_30px_-10px_rgba(143,101,147,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(143,101,147,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group mt-6">
                Register <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#CDCDCD]/40"></span></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-[#3B252C]/30 bg-transparent px-4">
                Secure SSO
              </div>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full h-14 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center gap-3 font-black text-[#3B252C] text-xs hover:bg-[#CDCDCD]/20 transition-all active:scale-95"
            >
              <img src={google} className="w-5" alt="Google" />
              Continue with Google
            </button>

            <p className="mt-8 text-center">
              <span className="text-xs font-bold text-[#3B252C]/40 uppercase tracking-widest">Part of the fleet? </span>
              <Link to="/login" className="text-xs font-black text-[#8F6593] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[#3B252C]/30">
             <ShieldCheck size={16} />
             <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Data Protocol</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – VISUAL (Takes 6 columns on desktop) */}
      <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative bg-[#CDCDCD]/20 overflow-hidden">
        {/* Floating Background Decorations */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border-[30px] border-white/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[#8F6593]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center space-y-10 p-12">
          <div className="bg-white/30 backdrop-blur-2xl p-6 rounded-[4rem] border border-white/50 shadow-2xl inline-block">
            <img
              src={authImg}
              alt="CRM illustration"
              className="w-[520px] max-w-full drop-shadow-[0_35px_35px_rgba(59,37,44,0.15)] animate-float"
            />
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
             <h3 className="text-4xl font-black text-[#3B252C] tracking-tight">Scale your Potential.</h3>
             <p className="text-[#3B252C]/50 font-bold leading-relaxed">
               Join thousands of teams managing their pipeline with precision and real-time analytical data.
             </p>
          </div>
        </div>
      </div>

      {/* Float Animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

export default Register;