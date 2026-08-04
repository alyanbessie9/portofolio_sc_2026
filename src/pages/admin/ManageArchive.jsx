import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  Calendar,
  Tag,
  Link as LinkIcon,
  Image,
  Sparkles,
  X,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ManageArchive() {
  const [archives, setArchives] = useState([]);
  const [form, setForm] = useState({
    id: null,
    date: "",
    title: "",
    category: "",
    description: "",
    content: "",
    image_url: "",
    url: "",
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const fetchArchives = useCallback(async () => {
    const { data, error } = await supabase
      .from("archives")
      .select("*")
      .order("id", { ascending: false });
    if (data) setArchives(data);
    if (error) console.error("Error fetching archives:", error.message);
  }, []);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;

    const payload = {
      date: form.date,
      title: form.title,
      category: form.category,
      description: form.description,
      content: form.content,
      image_url: form.image_url,
      url: form.url,
    };

    if (form.id) {
      const { error } = await supabase
        .from("archives")
        .update(payload)
        .eq("id", form.id);
      if (error) alert("Gagal update: " + error.message);
      else alert("Arsip berhasil diperbarui!");
    } else {
      const { error } = await supabase.from("archives").insert([payload]);
      if (error) alert("Gagal tambah: " + error.message);
      else alert("Arsip baru berhasil ditambahkan!");
    }

    resetForm();
    fetchArchives();
  };

  const handleEdit = (item) => {
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      id: null,
      date: "",
      title: "",
      category: "",
      description: "",
      content: "",
      image_url: "",
      url: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus arsip ini?")) {
      const { error } = await supabase.from("archives").delete().eq("id", id);
      if (error) alert("Gagal hapus: " + error.message);
      else fetchArchives();
    }
  };

  return (
    <div className="text-slate-100 max-w-6xl mx-auto pb-12">
      {/* Tambahan Style Khusus untuk Memperbesar dan Mencerahkan Editor */}
      <style>{`
        .quill-light-editor .ql-container {
          min-height: 350px !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          font-size: 1rem !important;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
        .quill-light-editor .ql-toolbar {
          background-color: #f8fafc !important;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          border-color: #cbd5e1 !important;
        }
        .quill-light-editor .ql-container.ql-snow {
          border-color: #cbd5e1 !important;
        }
        .quill-light-editor .ql-editor.ql-blank::before {
          color: #64748b !important;
          font-style: normal !important;
        }
      `}</style>

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <Sparkles size={13} /> Panel Manajemen Konten
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">
            Kelola Arsip & Dokumentasi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Buat, edit, dan kelola artikel atau dokumentasi lengkap bergaya
            dokumen profesional.
          </p>
        </div>
      </div>

      {/* Form Input / Edit Card */}
      <form
        onSubmit={handleSave}
        className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-3xl mb-12 space-y-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <FileText className="text-indigo-400" size={20} />
            {form.id ? "Edit Artikel / Arsip" : "Tambah Artikel / Arsip Baru"}
          </h2>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              <X size={14} /> Batalkan Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" /> Tanggal /
              Periode
            </label>
            <input
              type="text"
              placeholder="Contoh: NOV 22 2025"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag size={14} className="text-indigo-400" /> Kategori
            </label>
            <input
              type="text"
              placeholder="Contoh: RED TEAMING, TOOLS"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Judul Artikel / Dokumentasi
          </label>
          <input
            type="text"
            placeholder="Tulis judul utama artikel di sini..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition font-bold text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Ringkasan Singkat (Excerpt)
          </label>
          <textarea
            placeholder="Tulis deskripsi pendek yang akan tampil di kartu pratinjau..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Konten Lengkap (Format Dokumen Rich Text)
          </label>
          <div className="rounded-2xl overflow-hidden shadow-inner quill-light-editor">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              modules={modules}
              placeholder="Tulis dokumentasi atau artikel lengkap secara mendalam di sini..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image size={14} className="text-indigo-400" /> URL Gambar Banner
              / Logo (Opsional)
            </label>
            <input
              type="text"
              placeholder="https://example.com/banner.jpg"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-indigo-400" /> URL Tautan
              Eksternal / Lanjutan (Opsional)
            </label>
            <input
              type="text"
              placeholder="https://github.com/..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl px-8 py-4 text-sm transition shadow-xl shadow-indigo-600/30 transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            {form.id ? "Perbarui Dokumentasi Arsip" : "Simpan Dokumentasi Baru"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Daftar Tabel Arsip */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-200">
            Daftar Arsip Tersimpan
          </h3>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-400">
            Total: {archives.length} Arsip
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4.5 font-semibold">Tanggal</th>
                <th className="p-4.5 font-semibold">Judul Artikel</th>
                <th className="p-4.5 font-semibold">Kategori</th>
                <th className="p-4.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {archives.length > 0 ? (
                archives.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition"
                  >
                    <td className="p-4.5 text-teal-400 font-medium whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="p-4.5 text-slate-100 font-bold">
                      {item.title}
                      {item.description && (
                        <p className="text-xs text-slate-400 font-normal truncate max-w-md mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4.5">
                      {item.category ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-xs">
                          Tanpa Kategori
                        </span>
                      )}
                    </td>
                    <td className="p-4.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-medium transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-slate-500 italic"
                  >
                    Belum ada arsip tersimpan di dalam database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
