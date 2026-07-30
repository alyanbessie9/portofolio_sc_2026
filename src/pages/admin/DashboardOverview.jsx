import React from "react";

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dasbor Pengelola</h1>
      <p className="text-slate-400 text-sm mb-8">
        Pilih menu di sebelah kiri untuk mengelola komponen portofolio secara
        terpisah.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-xs font-semibold uppercase">
            Total Pesan Masuk
          </h3>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">12</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-xs font-semibold uppercase">
            Total Pengalaman
          </h3>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">3</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-xs font-semibold uppercase">
            Status Website
          </h3>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">Aktif</p>
        </div>
      </div>
    </div>
  );
}
