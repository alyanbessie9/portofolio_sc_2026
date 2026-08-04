import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Trash2,
  PlusCircle,
  ExternalLink,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Loader2,
  Edit3,
} from "lucide-react";

export default function ManageAbout() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // State untuk melacak mode edit atau tambah baru
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    desc: "",
    url: "",
  });

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("id", { ascending: false });

    if (data) setExperiences(data);
    if (error) console.error("Error fetching data:", error?.message || error);
  };

  // Fungsi untuk menyimpan data baru atau memperbarui data yang ada ke Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.role ||
      !formData.company ||
      !formData.period ||
      !formData.desc
    ) {
      alert("Semua field (kecuali URL jika opsional) harus diisi!");
      return;
    }

    setLoading(true);
    setNotification("");

    if (editingId) {
      // Proses Update Data
      const { error } = await supabase
        .from("experiences")
        .update(formData)
        .eq("id", editingId);

      setLoading(false);
      if (error) {
        alert(
          "Gagal memperbarui pengalaman: " +
            (error?.message || "Terjadi kesalahan"),
        );
      } else {
        setNotification("Pengalaman berhasil diperbarui!");
        setFormData({ role: "", company: "", period: "", desc: "", url: "" });
        setEditingId(null);
        fetchExperiences();
        setTimeout(() => setNotification(""), 4000);
      }
    } else {
      // Proses Tambah Data Baru
      const { error } = await supabase.from("experiences").insert([formData]);

      setLoading(false);
      if (error) {
        alert(
          "Gagal menambahkan pengalaman: " +
            (error?.message || "Terjadi kesalahan"),
        );
      } else {
        setNotification("Pengalaman baru berhasil ditambahkan!");
        setFormData({ role: "", company: "", period: "", desc: "", url: "" });
        fetchExperiences();
        setTimeout(() => setNotification(""), 4000);
      }
    }
  };

  // Fungsi untuk memuat data ke form saat tombol edit diklik
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      role: exp.role || "",
      company: exp.company || "",
      period: exp.period || "",
      desc: exp.desc || "",
      url: exp.url || "",
    });
    // Gulir ke atas secara halus agar form terlihat
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ role: "", company: "", period: "", desc: "", url: "" });
  };

  // Fungsi untuk menghapus data berdasarkan ID
  const handleDelete = async (id) => {
    if (
      !window.confirm("Apakah Anda yakin ingin menghapus data pengalaman ini?")
    )
      return;

    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + (error?.message || "Terjadi kesalahan"));
    } else {
      setNotification("Data pengalaman berhasil dihapus.");
      fetchExperiences();
      setTimeout(() => setNotification(""), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-slate-100">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2.5">
            <Briefcase className="text-indigo-400" size={26} />
            Kelola Slide 2 (About & Experience)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tambah, perbarui, atau hapus kartu riwayat pengalaman kerja secara
            dinamis.
          </p>
        </div>
      </div>

      {/* Notifikasi Sukses */}
      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-3 shadow-lg shadow-emerald-950/20">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Form Tambah / Edit Pengalaman */}
      <div className="bg-slate-900/50 border border-slate-800/80 p-6 md:p-8 rounded-2xl mb-10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <PlusCircle className="text-indigo-400" size={20} />
            {editingId ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Baru"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg transition"
            >
              Batalkan Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Posisi / Role
              </label>
              <input
                type="text"
                placeholder="Contoh: Frontend Developer"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Perusahaan / Institusi
              </label>
              <input
                type="text"
                placeholder="Contoh: PT Teknologi Solusi"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Periode Waktu
              </label>
              <input
                type="text"
                placeholder="Contoh: 2025 - Sekarang"
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                URL Tautan (Opsional)
              </label>
              <input
                type="url"
                placeholder="https://perusahaan.com atau tautan proyek"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              Deskripsi Singkat / Uraian Tugas
            </label>
            <textarea
              rows="4"
              placeholder="Jelaskan deskripsi pekerjaan atau pencapaian proyek..."
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>
                  {editingId ? "Perbarui Pengalaman" : "Simpan Pengalaman"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Pengalaman yang Tersimpan */}
      <h2 className="text-lg font-bold mb-4 text-slate-100 flex items-center gap-2">
        <span>Daftar Pengalaman Saat Ini</span>
        <span className="text-xs font-mono bg-slate-800 text-indigo-400 px-2.5 py-0.5 rounded-full">
          {experiences.length}
        </span>
      </h2>

      <div className="space-y-4">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition shadow-md"
            >
              <div className="space-y-1 flex-1">
                <span className="inline-block text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                  {exp.period}
                </span>
                <h4 className="text-base font-bold text-slate-100 flex flex-wrap items-center gap-2 mt-1">
                  {exp.role}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    di {exp.company}
                  </span>
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md transition"
                      title="Kunjungi Tautan"
                    >
                      <span>Link</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  {exp.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-medium transition inline-flex items-center gap-1.5"
                  title="Edit Data"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium transition inline-flex items-center gap-1.5"
                  title="Hapus Data"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-500 text-sm italic">
              Belum ada data pengalaman tersimpan di database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
