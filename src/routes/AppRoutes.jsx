import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/admin/Login";

import DashboardOverview from "../pages/admin/DashboardOverview";
import ManageHero from "../pages/admin/ManageHero";
import ManageAbout from "../pages/admin/ManageAbout";
import ManageSkills from "../pages/admin/ManageSkills";
import ManageSocials from "../pages/admin/ManageSocials";
import ManageMessages from "../pages/admin/ManageMessages";

// Komponen Pelindung dengan pengecekan string "true" yang ketat
function ProtectedRoute() {
  const isAuth = localStorage.getItem("isAuthenticated");
  return isAuth === "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Halaman Publik */}
      <Route path="/" element={<Home />} />

      {/* Halaman Login Admin */}
      <Route path="/admin/login" element={<Login />} />

      {/* Grup Halaman Admin yang Dilindungi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashboardOverview />} />
        <Route path="/admin/hero" element={<ManageHero />} />
        <Route path="/admin/about" element={<ManageAbout />} />
        <Route path="/admin/skills" element={<ManageSkills />} />
        <Route path="/admin/socials" element={<ManageSocials />} />
        <Route path="/admin/messages" element={<ManageMessages />} />
      </Route>

      {/* Redirect otomatis jika akses /admin langsung */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Halaman 404 / Redirect jika rute tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
