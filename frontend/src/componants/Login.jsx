import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import google from "../assets/google2.png";
import authImg from "../assets/LoginImg.png";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login() {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Logic remains exactly the same as requested
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      let result = await res.json();
    if (!res.ok) {
    toast.error(result.message);
  
    }
      navigate("/dashboard");
await checkAuth()
    toast.success("Login successful")
    } catch (error) {
  console.error("LOGIN ERROR:", error);
  toast.error("Login failed");
}

  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    let res = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
      }),
    });

    let data = await res.json();
    if (!res.ok) {
    toast.error(res.message);

    }
      navigate("/dashboard");
await checkAuth()
    toast.success("Login successful");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-10 bg-[#E3E4DB] font-sans selection:bg-[#8F6593] selection:text-white">

      {/* LEFT – FORM (Takes 4 columns on desktop) */}
      <div className="lg:col-span-4 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#AEA4BF]/20 rounded-full blur-3xl opacity-50" />
        
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

          {/* Form Card */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-10 shadow-[0_25px_50px_-12px_rgba(59,37,44,0.08)]">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#3B252C] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[#3B252C]/50 font-bold text-sm mt-2">
                Enter your credentials to access the terminal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40 ml-1">Identity</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEA4BF] group-focus-within:text-[#8F6593] transition-colors">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="mail@identity.com"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B252C]/40">Security</label>
                  <button type="button" className="text-[10px] font-black text-[#8F6593] uppercase tracking-wider hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEA4BF] group-focus-within:text-[#8F6593] transition-colors">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B252C]/20 hover:text-[#8F6593] transition-colors"
                  >
                    {show ? <Eye size={18} strokeWidth={2.5} /> : <EyeOff size={18} strokeWidth={2.5} />}
                  </button>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/60 border border-white focus:bg-white focus:ring-4 focus:ring-[#8F6593]/10 outline-none transition-all font-bold text-[#3B252C] placeholder:text-[#3B252C]/20 shadow-inner"
                  />
                </div>
              </div>

              <button className="w-full h-16 rounded-2xl bg-[#8F6593] text-white font-black shadow-[0_15px_30px_-10px_rgba(143,101,147,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(143,101,147,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                Login <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#CDCDCD]/40"></span></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-[#3B252C]/30 bg-transparent px-4">
                Encryption Protocol
              </div>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full h-14 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center gap-3 font-black text-[#3B252C] text-sm hover:bg-[#CDCDCD]/20 hover:border-[#CDCDCD] transition-all active:scale-95"
            >
              <img src={google} className="w-5" alt="Google" />
              Google SSO
            </button>

            <p className="mt-8 text-center">
              <span className="text-xs font-bold text-[#3B252C]/40 uppercase tracking-widest">New operative? </span>
              <Link to="/" className="text-xs font-black text-[#8F6593] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Register Now
              </Link>
            </p>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-2 text-[#3B252C]/30">
             <ShieldCheck size={16} />
             <span className="text-[9px] font-black uppercase tracking-widest">AES-256 Bit Encrypted Connection</span>
          </div>
        </div>
      </div>

      {/* RIGHT – VISUAL (Takes 6 columns on desktop) */}
      <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative bg-[#CDCDCD]/20 overflow-hidden">
        {/* Geometric Decorative Elements */}
        <div className="absolute top-20 right-20 w-80 h-80 border-[40px] border-white/30 rounded-full blur-sm" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#8F6593]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center space-y-8 p-12">
          <div className="bg-white/40 backdrop-blur-3xl p-4 rounded-[3rem] border border-white/50 shadow-2xl relative">
            <img
              src={authImg}
              alt="CRM analytics illustration"
              className="w-[500px] max-w-full drop-shadow-[0_35px_35px_rgba(59,37,44,0.15)] animate-float"
            />
          </div>
          
          <div className="space-y-4 max-w-sm mx-auto">
             <h3 className="text-3xl font-black text-[#3B252C] tracking-tight">Propelling Sales through Data.</h3>
             <p className="text-[#3B252C]/50 font-bold leading-relaxed">
               Access the next generation of customer relationship management and pipeline optimization.
             </p>
          </div>
        </div>
      </div>

      {/* CSS for custom float animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

export default Login;