import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FolderArchive, Plus, Trash2, Edit2 } from "lucide-react";

export default function ManageSkills() {
  // State untuk Data Slide 3 Items
  const [slideItems, setSlideItems] = useState([]);

  // State untuk data referensi database
  const [availableArchives, setAvailableArchives] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [formItem, setFormItem] = useState({
    id: null,
    title: "",
    category: "Archives",
    url: "",
  });

  const fetchSlideItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("slide_three_items")
      .select("*")
      .order("id", { ascending: false });

    if (data) setSlideItems(data);
    if (error) console.error("Error fetching slide items:", error.message);
  }, []);

  // Ambil daftar arsip dari tabel utama 'archives'
  const fetchAvailableArchives = useCallback(async () => {
    const { data, error } = await supabase
      .from("archives")
      .select("id, title")
      .order("id", { ascending: false });

    if (data) setAvailableArchives(data);
    if (error)
      console.error("Error fetching available archives:", error.message);
  }, []);

  // Ambil daftar kategori dari tabel database 'categories' (menggunakan kolom 'title')
  const fetchAvailableCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, title")
      .order("id", { ascending: false });

    if (data) setAvailableCategories(data);
    if (error)
      console.error("Error fetching available categories:", error.message);
  }, []);

  useEffect(() => {
    fetchSlideItems();
    fetchAvailableArchives();
    fetchAvailableCategories();
  }, [fetchSlideItems, fetchAvailableArchives, fetchAvailableCategories]);

  // --- CRUD untuk Slide 3 Items ---
  const handleSaveSlideItem = async (e) => {
    e.preventDefault();
    if (!formItem.title) return;

    const finalUrl = formItem.category === "Certifications" ? formItem.url : "";

    if (formItem.id) {
      const { error } = await supabase
        .from("slide_three_items")
        .update({
          title: formItem.title,
          category: formItem.category,
          url: finalUrl,
        })
        .eq("id", formItem.id);

      if (error) alert("Gagal mengupdate item: " + error.message);
    } else {
      const { error } = await supabase.from("slide_three_items").insert([
        {
          title: formItem.title,
          category: formItem.category,
          url: finalUrl,
        },
      ]);

      if (error) alert("Gagal menambah item: " + error.message);
    }

    setFormItem({ id: null, title: "", category: "Archives", url: "" });
    fetchSlideItems();
  };

  const handleEditSlideItem = (item) => {
    setFormItem({
      id: item.id,
      title: item.title,
      category: item.category,
      url: item.url || "",
    });
  };

  const handleDeleteSlideItem = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      const { error } = await supabase
        .from("slide_three_items")
        .delete()
        .eq("id", id);

      if (error) alert("Gagal menghapus: " + error.message);
      else fetchSlideItems();
    }
  };

  // Fungsi helper saat dropdown Section/Kategori utama diubah
  const handleCategoryChange = (newCat) => {
    let defaultTitle = "";
    if (newCat === "Archives" && availableArchives.length > 0) {
      defaultTitle = availableArchives[0].title;
    } else if (newCat === "Categories" && availableCategories.length > 0) {
      defaultTitle = availableCategories[0].title; // Menggunakan kolom 'title' dari tabel categories
    }
    setFormItem({
      ...formItem,
      category: newCat,
      title: defaultTitle,
      url: "",
    });
  };

  return (
    <div className="text-slate-100 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">
            Kelola Keahlian & Slide 3
          </h1>
          <p className="text-sm text-slate-400">
            Kelola konten Slide 3 (Archives, Categories, Certifications) dalam
            satu tempat
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <section className="bg-slate-900/50 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
              <FolderArchive size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Kelola Slide 3 Items
              </h2>
              <p className="text-xs text-slate-400">
                Pilih bagian section, lalu pilih data dari database atau isi
                sertifikasi secara mandiri.
              </p>
            </div>
          </div>

          {/* Form Input Slide 3 */}
          <form
            onSubmit={handleSaveSlideItem}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-950 p-5 rounded-xl border border-slate-800"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Kolom / Kategori Section
              </label>
              <select
                value={formItem.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Archives">Archives</option>
                <option value="Categories">Categories</option>
                <option value="Certifications">Certifications</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {formItem.category === "Archives"
                  ? "Pilih Arsip (Dari Database)"
                  : formItem.category === "Categories"
                    ? "Pilih Kategori (Dari Database)"
                    : "Judul Sertifikasi"}
              </label>

              {formItem.category === "Archives" ? (
                <select
                  value={formItem.title}
                  onChange={(e) =>
                    setFormItem({ ...formItem, title: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>
                    -- Pilih Arsip Tersedia --
                  </option>
                  {availableArchives.map((arch) => (
                    <option key={arch.id} value={arch.title}>
                      ID #{arch.id} - {arch.title}
                    </option>
                  ))}
                </select>
              ) : formItem.category === "Categories" ? (
                <select
                  value={formItem.title}
                  onChange={(e) =>
                    setFormItem({ ...formItem, title: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>
                    -- Pilih Kategori Tersedia --
                  </option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      ID #{cat.id} - {cat.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Contoh: AWS Certified Solutions Architect"
                  value={formItem.title}
                  onChange={(e) =>
                    setFormItem({ ...formItem, title: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tautan URL{" "}
                {formItem.category !== "Certifications" &&
                  "(Khusus Certifications)"}
              </label>
              <input
                type="text"
                placeholder={
                  formItem.category === "Certifications"
                    ? "https://credential.net/..."
                    : "Rute internal otomatis"
                }
                value={
                  formItem.category === "Certifications" ? formItem.url : ""
                }
                disabled={formItem.category !== "Certifications"}
                onChange={(e) =>
                  setFormItem({ ...formItem, url: e.target.value })
                }
                className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 ${
                  formItem.category !== "Certifications"
                    ? "opacity-50 cursor-not-allowed bg-slate-950"
                    : ""
                }`}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition shadow-lg shadow-indigo-600/20"
              >
                <Plus size={16} />
                <span>{formItem.id ? "Perbarui Item" : "Tambah Item"}</span>
              </button>
            </div>
          </form>

          {/* Tabel Daftar Slide 3 */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="p-4">Bagian Section</th>
                  <th className="p-4">Judul Item / Teks</th>
                  <th className="p-4">URL / Tautan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {slideItems.length > 0 ? (
                  slideItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition"
                    >
                      <td className="p-4 font-semibold text-indigo-400">
                        {item.category}
                      </td>
                      <td className="p-4 font-medium text-slate-100">
                        {item.title}
                      </td>
                      <td className="p-4 text-slate-400 truncate max-w-xs">
                        {item.category === "Certifications" ? (
                          item.url || (
                            <span className="text-amber-500/80 italic">
                              Belum ada URL
                            </span>
                          )
                        ) : (
                          <span className="text-slate-600 italic">
                            Rute internal selaras
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditSlideItem(item)}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium transition inline-flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlideItem(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition inline-flex items-center gap-1"
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
                      className="p-6 text-center text-slate-500 italic"
                    >
                      Belum ada data pada slide 3.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
