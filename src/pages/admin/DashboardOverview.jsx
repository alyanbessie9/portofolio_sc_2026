import React, { useState } from "react";
import {
  User,
  Briefcase,
  Code,
  Share2,
  Mail,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/admin/login");
  };

  const menuItems = [
    { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { id: "hero", label: "Kelola Hero", icon: User },
    { id: "about", label: "Kelola Tentang", icon: Briefcase },
    { id: "skills", label: "Kelola Keahlian", icon: Code },
    { id: "socials", label: "Kelola Sosial", icon: Share2 },
    { id: "messages", label: "Kelola Pesan", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 w-full relative">
      {/* Widget Waktu dan Tanggal Mengambang di Kanan Atas */}
      <FloatingDateTime />

      {/* TOMBOL HAMBURGER MOBILE (Hanya tampil di layar kecil) */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 shadow-lg"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* OVERLAY MOBILE SIDEBAR */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-OUT SIDEBAR */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base">Admin Panel</h2>
                <p className="text-xs text-slate-400">Portofolio Manager</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                    activeMenu === item.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} /> {item.label}
                </button>
              );
            })}
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
      </div>

      {/* SIDEBAR DESKTOP */}
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
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                    activeMenu === item.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} /> {item.label}
                </button>
              );
            })}
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
      <main className="flex-1 p-6 md:p-8 overflow-y-auto mt-16 md:mt-0">
        {activeMenu === "overview" && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Dasbor Pengelola
            </h1>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Pilih menu di sebelah kiri untuk mengelola komponen portofolio
              secara terpisah.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sm:col-span-2 md:col-span-1">
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
