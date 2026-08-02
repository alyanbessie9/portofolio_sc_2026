import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, PlusCircle } from "lucide-react";

export default function ManageArchives() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    category: "Paper",
    description: "",
    content: "",
    url: "",
  });

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    const { data, error } = await supabase
      .from("archives")
      .select("*")
      .order("id", { ascending: false });

    if (data) setArchives(data);
    if (error) console.error("Error fetching archives:", error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.title || !formData.description) {
      alert("Tanggal, Judul, dan Deskripsi wajib diisi!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("archives").insert([formData]);

    if (error) {
      alert("Gagal menyimpan arsip: " + error.message);
    } else {
      alert("Arsip berhasil ditambahkan!");
      setFormData({
        date: "",
        title: "",
        category: "Paper",
        description: "",
        content: "",
        url: "",
      });
      fetchArchives();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus arsip ini?")) return;

    const { error } = await supabase.from("archives").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      fetchArchives();
    }
  };

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-2xl font-bold mb-2 text-slate-100">
        Kelola Slide 3 (Archives & Paper)
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Tambah atau hapus rekam jejak aktivitas, riset, atau paper akademik
        Anda.
      </p>

      {/* Form Tambah Arsip */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400 flex items-center gap-2">
          <PlusCircle size={20} /> Tambah Arsip Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Tanggal / Waktu
              </label>
              <input
                type="text"
                placeholder="cth: 1 November 2025"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Paper">Paper / Skripsi</option>
                <option value="Project">Project</option>
                <option value="Aktivitas">Aktivitas / Sertifikasi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Judul Arsip / Paper
            </label>
            <input
              type="text"
              placeholder="cth: Penerapan Metode Crawling untuk Rekomendasi Buku"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Deskripsi Singkat (Tampil di Timeline)
            </label>
            <textarea
              rows="2"
              placeholder="Ringkasan singkat aktivitas..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Konten Lengkap / Isi Paper (Tampil di Modal Popup)
            </label>
            <textarea
              rows="4"
              placeholder="Tulis penjelasan lengkap, abstrak, atau dokumentasi di sini..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Link Eksternal (Opsional - PDF/GitHub)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition"
          >
            {loading ? "Menyimpan..." : "Simpan Arsip"}
          </button>
        </form>
      </div>

      {/* List Arsip */}
      <h2 className="text-lg font-semibold mb-4 text-slate-100">
        Daftar Arsip Tersimpan
      </h2>
      <div className="space-y-3">
        {archives.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4"
          >
            <div>
              <span className="text-xs text-indigo-400 font-semibold">
                {item.date} • {item.category}
              </span>
              <h4 className="text-md font-bold text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{item.description}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
