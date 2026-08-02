import React, { useState } from "react";
import {
  User,
  Briefcase,
  Code,
  Share2,
  Mail,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingDateTime from "../../components/FloatingDateTime";

// Impor komponen-komponen manajemen di folder admin
import ManageHero from "./ManageHero";
import ManageAbout from "./ManageAbout";
import ManageSkills from "./ManageSkills";
import ManageSocials from "./ManageSocials";

export default function DashboardOverview() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 w-full relative">
      {/* Widget Waktu dan Tanggal Mengambang di Kanan Atas */}
      <FloatingDateTime />

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-slate-400">Portofolio Manager</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveMenu("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "overview"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard size={18} /> Ringkasan
            </button>
            <button
              onClick={() => setActiveMenu("hero")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "hero"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <User size={18} /> Kelola Hero
            </button>
            <button
              onClick={() => setActiveMenu("about")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "about"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Briefcase size={18} /> Kelola Tentang
            </button>
            <button
              onClick={() => setActiveMenu("skills")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "skills"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Code size={18} /> Kelola Keahlian
            </button>
            <button
              onClick={() => setActiveMenu("socials")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "socials"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Share2 size={18} /> Kelola Sosial
            </button>
            <button
              onClick={() => setActiveMenu("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                activeMenu === "messages"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Mail size={18} /> Kelola Pesan
            </button>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto mt-12 md:mt-0">
        {activeMenu === "overview" && (
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Dasbor Pengelola
            </h1>
            <p className="text-slate-400 mb-8">
              Pilih menu di sebelah kiri untuk mengelola komponen portofolio
              secara terpisah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">
                  TOTAL PESAN MASUK
                </span>
                <h3 className="text-3xl font-bold text-indigo-400 mt-2">12</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">
                  TOTAL PENGALAMAN
                </span>
                <h3 className="text-3xl font-bold text-indigo-400 mt-2">3</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">
                  STATUS WEBSITE
                </span>
                <h3 className="text-3xl font-bold text-emerald-400 mt-2">
                  Aktif
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Render Komponen Berdasarkan Menu yang Dipilih */}
        {activeMenu === "hero" && <ManageHero />}
        {activeMenu === "about" && <ManageAbout />}
        {activeMenu === "skills" && <ManageSkills />}
        {activeMenu === "socials" && <ManageSocials />}
      </main>
    </div>
  );
}
