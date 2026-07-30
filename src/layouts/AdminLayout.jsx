import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code,
  Share2,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h1 className="font-bold text-lg text-indigo-400">Admin Panel</h1>
          <Link
            to="/"
            title="Ke Halaman Utama"
            className="text-slate-400 hover:text-white"
          >
            <Home size={20} />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <LayoutDashboard size={18} /> Ringkasan
          </Link>
          <Link
            to="/admin/hero"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <User size={18} /> Slide 1: Hero
          </Link>
          <Link
            to="/admin/about"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Briefcase size={18} /> Slide 2: About & Experience
          </Link>
          <Link
            to="/admin/skills"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Code size={18} /> Slide 3: Skills
          </Link>
          <Link
            to="/admin/socials"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Share2 size={18} /> Slide 4: Socials & Paper
          </Link>
          <Link
            to="/admin/messages"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <MessageSquare size={18} /> Slide 5: Pesan Masuk
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
