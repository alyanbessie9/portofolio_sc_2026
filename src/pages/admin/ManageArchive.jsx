import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  Calendar,
  Tag,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  X,
  Save,
  Eye,
  ExternalLink,
  Search,
  BookOpen,
  Clock,
  Hash,
  Type,
  RotateCcw,
} from "lucide-react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ManageArchive() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  /*
  ============================================================
  QUILL TOOLBAR
  ============================================================
  */

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],

        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        ["bold", "italic", "underline", "strike"],

        [{ color: [] }, { background: [] }],

        [{ script: "sub" }, { script: "super" }],

        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],

        [{ align: [] }],

        ["blockquote", "code-block"],

        ["link", "image", "video"],

        ["clean"],
      ],

      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  /*
  ============================================================
  FETCH DATA
  ============================================================
  */

  const fetchArchives = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("archives")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching archives:", error.message);
      alert("Gagal mengambil data arsip: " + error.message);
    }

    if (data) {
      setArchives(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  /*
  ============================================================
  FORM HANDLER
  ============================================================
  */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
  ============================================================
  SAVE / UPDATE
  ============================================================
  */

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Judul artikel wajib diisi.");
      return;
    }

    if (!form.date.trim()) {
      alert("Tanggal / periode wajib diisi.");
      return;
    }

    setLoading(true);

    const payload = {
      date: form.date.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      content: form.content || "",
      image_url: form.image_url.trim(),
      url: form.url.trim(),
    };

    try {
      if (form.id) {
        const { error } = await supabase
          .from("archives")
          .update(payload)
          .eq("id", form.id);

        if (error) {
          throw error;
        }

        alert("Arsip berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("archives").insert([payload]);

        if (error) {
          throw error;
        }

        alert("Arsip baru berhasil ditambahkan!");
      }

      resetForm();
      await fetchArchives();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan arsip: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  EDIT
  ============================================================
  */

  const handleEdit = (item) => {
    setForm({
      id: item.id ?? null,
      date: item.date ?? "",
      title: item.title ?? "",
      category: item.category ?? "",
      description: item.description ?? "",
      content: item.content ?? "",
      image_url: item.image_url ?? "",
      url: item.url ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  ============================================================
  RESET FORM
  ============================================================
  */

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

  /*
  ============================================================
  DELETE
  ============================================================
  */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus arsip ini?\n\nData yang sudah dihapus tidak dapat dikembalikan.",
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("archives").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus arsip: " + error.message);
    } else {
      alert("Arsip berhasil dihapus.");
      await fetchArchives();
    }

    setLoading(false);
  };

  /*
  ============================================================
  WORD / CHARACTER COUNTER
  ============================================================
  */

  const plainTextContent = useMemo(() => {
    if (!form.content) return "";

    const temp = document.createElement("div");
    temp.innerHTML = form.content;

    return temp.textContent || temp.innerText || "";
  }, [form.content]);

  const wordCount = useMemo(() => {
    return plainTextContent.trim().split(/\s+/).filter(Boolean).length;
  }, [plainTextContent]);

  const characterCount = plainTextContent.length;

  /*
  ============================================================
  FILTER ARCHIVES
  ============================================================
  */

  const filteredArchives = useMemo(() => {
    if (!searchTerm.trim()) {
      return archives;
    }

    const search = searchTerm.toLowerCase();

    return archives.filter((item) => {
      return (
        item.title?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.date?.toLowerCase().includes(search)
      );
    });
  }, [archives, searchTerm]);

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <div className="min-h-screen text-slate-100 max-w-7xl mx-auto pb-16">
      {/* =====================================================
          CUSTOM CSS
      ===================================================== */}

      <style>{`
        /* =====================================================
           ARCHIVE EDITOR
        ===================================================== */

        .archive-editor-wrapper {
          border: 1px solid #1e293b;
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* TOOLBAR */

        .archive-editor-wrapper .ql-toolbar {
          position: sticky;
          top: 0;
          z-index: 30;

          background: #f8fafc !important;

          border: none !important;
          border-bottom: 1px solid #cbd5e1 !important;

          padding: 12px 14px !important;

          box-shadow:
            0 3px 12px rgba(15, 23, 42, 0.08);
        }

        .archive-editor-wrapper .ql-toolbar .ql-formats {
          margin-right: 12px;
        }

        .archive-editor-wrapper .ql-toolbar button:hover {
          color: #4f46e5 !important;
        }

        .archive-editor-wrapper .ql-toolbar button.ql-active {
          color: #4f46e5 !important;
        }

        .archive-editor-wrapper .ql-toolbar .ql-picker-label:hover {
          color: #4f46e5 !important;
        }

        .archive-editor-wrapper .ql-toolbar .ql-picker-options {
          z-index: 100;
        }

        /* CONTAINER */

        .archive-editor-wrapper .ql-container {
          border: none !important;

          height: 560px !important;
          max-height: 560px !important;

          overflow-y: auto !important;

          background: #ffffff !important;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* EDITOR */

        .archive-editor-wrapper .ql-editor {
          min-height: 560px;

          padding: 32px 38px !important;

          color: #0f172a !important;

          font-size: 16px !important;

          line-height: 1.85 !important;

          max-width: 100%;

          word-break: break-word;
        }

        .archive-editor-wrapper .ql-editor:focus {
          outline: none;
        }

        .archive-editor-wrapper .ql-editor.ql-blank::before {
          color: #64748b !important;
          font-style: normal !important;
          left: 38px !important;
          right: 38px !important;
        }

        /* HEADINGS */

        .archive-editor-wrapper .ql-editor h1 {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.25;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .archive-editor-wrapper .ql-editor h2 {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 1.4rem;
          margin-bottom: 0.8rem;
        }

        .archive-editor-wrapper .ql-editor h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-top: 1.2rem;
          margin-bottom: 0.7rem;
        }

        /* CODE */

        .archive-editor-wrapper .ql-editor pre.ql-syntax {
          background: #0f172a !important;
          color: #e2e8f0 !important;

          border-radius: 12px;

          padding: 18px;

          font-family:
            "JetBrains Mono",
            "Fira Code",
            Consolas,
            monospace;

          overflow-x: auto;
        }

        /* BLOCKQUOTE */

        .archive-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #6366f1;

          background: #f8fafc;

          padding: 12px 18px;

          border-radius: 0 10px 10px 0;

          color: #475569;

          margin: 18px 0;
        }

        /* IMAGE */

        .archive-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;

          border-radius: 12px;

          margin: 15px 0;

          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.15);
        }

        /* LINK */

        .archive-editor-wrapper .ql-editor a {
          color: #4f46e5;
          text-decoration: underline;
        }

        /* SCROLLBAR */

        .archive-editor-wrapper .ql-container::-webkit-scrollbar {
          width: 9px;
        }

        .archive-editor-wrapper .ql-container::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .archive-editor-wrapper .ql-container::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 20px;

          border: 2px solid #f1f5f9;
        }

        .archive-editor-wrapper .ql-container::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* =====================================================
           IMAGE PREVIEW
        ===================================================== */

        .archive-image-preview {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: #0f172a;
          border: 1px solid #334155;
        }

        .archive-image-preview img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 768px) {
          .archive-editor-wrapper .ql-container {
            height: 480px !important;
            max-height: 480px !important;
          }

          .archive-editor-wrapper .ql-editor {
            min-height: 480px;
            padding: 24px 20px !important;
          }

          .archive-editor-wrapper .ql-editor.ql-blank::before {
            left: 20px !important;
            right: 20px !important;
          }

          .archive-editor-wrapper .ql-toolbar {
            padding: 8px !important;
          }

          .archive-editor-wrapper .ql-toolbar .ql-formats {
            margin-right: 5px;
          }
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              PANEL MANAJEMEN KONTEN
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Kelola Arsip & Dokumentasi
            </h1>

            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
              Buat, edit, dan kelola artikel atau dokumentasi dengan editor
              rich-text profesional.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800">
              <BookOpen size={18} className="text-indigo-400" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Total Arsip
                </p>

                <p className="text-lg font-black text-white">
                  {archives.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <form
        onSubmit={handleSave}
        className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl mb-10"
      >
        {/* Background Decoration */}

        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* =================================================
            FORM HEADER
        ================================================= */}

        <div className="relative px-6 md:px-8 py-6 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText size={21} className="text-indigo-400" />
              </div>

              <div>
                <h2 className="font-bold text-lg text-white">
                  {form.id
                    ? "Edit Artikel / Arsip"
                    : "Tambah Artikel / Arsip Baru"}
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  {form.id
                    ? "Perbarui informasi dokumentasi yang dipilih."
                    : "Buat dokumentasi baru untuk ditampilkan pada arsip."}
                </p>
              </div>
            </div>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <X size={15} />
                Batalkan Edit
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            FORM BODY
        ================================================= */}

        <div className="relative p-6 md:p-8 space-y-7">
          {/* DATE + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DATE */}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-400" />
                  Tanggal / Periode
                </span>
              </label>

              <input
                type="text"
                placeholder="Contoh: AUG 17 2026"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} className="text-indigo-400" />
                  Kategori
                </span>
              </label>

              <input
                type="text"
                placeholder="Contoh: RED TEAMING, TOOLS"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
              />
            </div>
          </div>

          {/* TITLE */}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="inline-flex items-center gap-1.5">
                <Type size={14} className="text-indigo-400" />
                Judul Artikel / Dokumentasi
              </span>
            </label>

            <input
              type="text"
              placeholder="Tulis judul utama artikel di sini..."
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-4 text-base md:text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition font-bold"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Ringkasan Singkat / Excerpt
              </label>

              <span className="text-[10px] text-slate-600 uppercase">
                Preview Card
              </span>
            </div>

            <textarea
              placeholder="Tulis deskripsi pendek yang akan tampil pada kartu preview..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition resize-none"
            />
          </div>

          {/* =================================================
              RICH TEXT EDITOR
          ================================================= */}

          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Konten Lengkap
                </label>

                <p className="text-xs text-slate-500 mt-1">
                  Gunakan toolbar untuk membuat dokumentasi seperti artikel
                  profesional.
                </p>
              </div>

              {/* COUNTER */}

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
                  <Hash size={12} />
                  {wordCount} kata
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
                  <Type size={12} />
                  {characterCount} karakter
                </span>
              </div>
            </div>

            <div className="archive-editor-wrapper">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => handleChange("content", value)}
                modules={modules}
                placeholder="Tulis dokumentasi atau artikel lengkap secara mendalam di sini..."
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-slate-600">
                Editor mendukung heading, bold, italic, list, quote, code, link,
                gambar, video, warna, alignment dan formatting lainnya.
              </p>

              <span className="hidden md:block text-[10px] text-slate-600">
                Scroll di dalam editor
              </span>
            </div>
          </div>

          {/* =================================================
              IMAGE + URL
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IMAGE URL */}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-indigo-400" />
                  URL Gambar Cover
                </span>
              </label>

              <input
                type="url"
                placeholder="https://example.com/banner.jpg"
                value={form.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
              />

              <p className="text-[11px] text-slate-600 mt-2">
                Gambar ini dapat digunakan sebagai cover artikel.
              </p>

              {/* IMAGE PREVIEW */}

              {form.image_url && (
                <div className="archive-image-preview mt-4">
                  <img
                    src={form.image_url}
                    alt="Preview cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Eye size={13} />
                      Preview Cover
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* EXTERNAL URL */}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-indigo-400" />
                  URL Tautan Eksternal
                </span>
              </label>

              <input
                type="url"
                placeholder="https://github.com/..."
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
              />

              <p className="text-[11px] text-slate-600 mt-2">
                Link tambahan seperti GitHub, dokumentasi, referensi, atau
                sumber eksternal.
              </p>

              {/* URL PREVIEW */}

              {form.url && (
                <a
                  href={form.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <ExternalLink size={16} className="text-indigo-400" />
                    </div>

                    <span className="text-xs text-slate-400 truncate">
                      {form.url}
                    </span>
                  </div>

                  <ExternalLink
                    size={14}
                    className="text-slate-600 group-hover:text-indigo-400 transition"
                  />
                </a>
              )}
            </div>
          </div>

          {/* =================================================
              ACTION BUTTON
          ================================================= */}

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold rounded-2xl px-8 py-4 text-sm transition shadow-xl shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : form.id ? (
                <>
                  <Save size={18} />
                  Perbarui Dokumentasi
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Simpan Dokumentasi Baru
                </>
              )}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                <RotateCcw size={17} />
                Batal Edit
              </button>
            )}
          </div>
        </div>
      </form>

      {/* =====================================================
          ARCHIVE LIST
      ===================================================== */}

      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* HEADER */}

        <div className="px-6 md:px-8 py-6 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Daftar Arsip Tersimpan
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Kelola seluruh dokumentasi yang tersimpan.
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari arsip..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Tanggal
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Artikel
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Kategori
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Cover
                </th>

                <th className="px-6 py-4 text-right text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {filteredArchives.length > 0 ? (
                filteredArchives.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    {/* DATE */}

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
                        <Calendar size={14} />

                        {item.date}
                      </div>
                    </td>

                    {/* ARTICLE */}

                    <td className="px-6 py-5">
                      <div className="max-w-lg">
                        <p className="font-bold text-white text-sm">
                          {item.title}
                        </p>

                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-5">
                      {item.category ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                          <Tag size={11} />

                          {item.category}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic text-xs">
                          Tanpa Kategori
                        </span>
                      )}
                    </td>

                    {/* COVER */}

                    <td className="px-6 py-5">
                      {item.image_url ? (
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center">
                          <ImageIcon size={15} className="text-slate-700" />
                        </div>
                      )}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-semibold transition"
                        >
                          <Edit2 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition"
                        >
                          <Trash2 size={13} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                        <FileText size={24} className="text-slate-600" />
                      </div>

                      <p className="text-sm font-semibold text-slate-400">
                        {searchTerm
                          ? "Arsip tidak ditemukan"
                          : "Belum ada arsip tersimpan"}
                      </p>

                      <p className="text-xs text-slate-600 mt-1">
                        {searchTerm
                          ? "Coba gunakan kata kunci pencarian lain."
                          : "Silakan buat dokumentasi baru melalui form di atas."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Menampilkan{" "}
              <span className="text-slate-400 font-semibold">
                {filteredArchives.length}
              </span>{" "}
              dari{" "}
              <span className="text-slate-400 font-semibold">
                {archives.length}
              </span>{" "}
              arsip
            </p>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-3 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                Memproses...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
