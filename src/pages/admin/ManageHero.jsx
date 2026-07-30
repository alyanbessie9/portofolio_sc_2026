import React, { useState } from "react";

export default function ManageHero() {
  const [hero, setHero] = useState({
    title: "Software Developer",
    subtitle: "Fresh Graduate Teknik Informatika",
  });
  const handleSave = (e) => {
    e.preventDefault();
    alert("Perubahan Slide 1 berhasil disimpan!");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">
        Kelola Slide 1 (Hero & Profil)
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Ubah teks utama dan tajuk profesional yang tampil di bagian paling atas.
      </p>
      <form
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Judul Utama
          </label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Sub-Judul
          </label>
          <input
            type="text"
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
