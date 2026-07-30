import React from "react";
import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Tombol Pintasan ke Admin */}
      <div className="absolute top-6 right-6 z-50">
        <Link
          to="/admin"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-sm rounded-lg transition flex items-center gap-2"
        >
          <LayoutDashboard size={16} className="text-indigo-400" /> Masuk Dasbor
          Admin
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
