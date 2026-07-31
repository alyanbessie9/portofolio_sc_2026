import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, PlusCircle, ExternalLink } from "lucide-react";

export default function ManageAbout() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fungsi untuk menyimpan data baru ke Supabase
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
    const { error } = await supabase.from("experiences").insert([formData]);

    if (error) {
      alert(
        "Gagal menambahkan pengalaman: " +
          (error?.message || "Terjadi kesalahan yang tidak diketahui"),
      );
    } else {
      alert("Pengalaman berhasil ditambahkan!");
      setFormData({ role: "", company: "", period: "", desc: "", url: "" });
      fetchExperiences();
    }
    setLoading(false);
  };

  // Fungsi untuk menghapus data berdasarkan ID
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      alert(
        "Gagal menghapus: " +
          (error?.message || "Terjadi kesalahan yang tidak diketahui"),
      );
    } else {
      fetchExperiences();
    }
  };

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-2xl font-bold mb-2 text-slate-100">
        Kelola Slide 2 (About & Experience)
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Tambah, edit, atau hapus kartu pengalaman kerja secara dinamis ke
        database.
      </p>

      {/* Form Tambah Pengalaman */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400 flex items-center gap-2">
          <PlusCircle size={20} /> Tambah Pengalaman Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Posisi / Role
              </label>
              <input
                type="text"
                placeholder="cth: Frontend Developer"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Perusahaan / Institusi
              </label>
              <input
                type="text"
                placeholder="cth: PT Teknologi Solusi"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Periode Waktu
              </label>
              <input
                type="text"
                placeholder="cth: 2025 - Sekarang"
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                URL Tautan (Opsional)
              </label>
              <input
                type="url"
                placeholder="https://perusahaan.com atau link portofolio"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows="3"
              placeholder="Jelaskan deskripsi pekerjaan atau proyek..."
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition shadow-lg shadow-indigo-600/20"
          >
            {loading ? "Menyimpan..." : "Simpan Pengalaman"}
          </button>
        </form>
      </div>

      {/* Daftar Pengalaman yang Tersimpan */}
      <h2 className="text-lg font-semibold mb-4 text-slate-100">
        Daftar Pengalaman Saat Ini
      </h2>
      <div className="space-y-3">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs text-indigo-400 font-semibold">
                  {exp.period}
                </span>
                <h4 className="text-md font-bold text-slate-100 flex items-center gap-2">
                  {exp.role}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    di {exp.company}
                  </span>
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center"
                      title="Kunjungi Link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </h4>
                <p className="text-xs text-slate-300 mt-1">{exp.desc}</p>
              </div>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">
            Belum ada data pengalaman tersimpan.
          </p>
        )}
      </div>
    </div>
  );
}
