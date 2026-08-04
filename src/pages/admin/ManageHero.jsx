import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  User,
  Image as ImageIcon,
  Save,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function ManageHero() {
  const [hero, setHero] = useState({
    greeting: "Halo, Saya",
    title: "Professional Developer",
    description:
      "Fresh graduate Teknik Informatika dengan keahlian dalam rekayasa perangkat lunak, pengembangan web modern, dan sistem ekstraksi data.",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data } = await supabase.from("hero").select("*").single();
    if (data) setHero(data);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    let imageUrl = hero.image_url;

    // 1. Jika ada file foto baru yang dipilih, unggah ke Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        alert("Gagal mengunggah foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Ambil Public URL dari foto yang baru diunggah
      const { data: publicURLData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(filePath);

      imageUrl = publicURLData.publicUrl;
    }

    // 3. Perbarui data teks dan URL gambar di tabel database 'hero'
    const { error: updateError } = await supabase
      .from("hero")
      .update({
        greeting: hero.greeting,
        title: hero.title,
        description: hero.description,
        image_url: imageUrl,
      })
      .eq("id", 1); // Sesuaikan id baris data Anda

    setLoading(false);

    if (updateError) {
      alert("Gagal menyimpan perubahan ke database!");
    } else {
      setNotification("Perubahan dan foto berhasil disimpan ke database!");
      setImageFile(null);
      fetchHeroData();
      setTimeout(() => setNotification(""), 4000);
    }
  };

  return (
    <div className="text-slate-100 max-w-4xl mx-auto pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2.5">
            <User className="text-indigo-400" size={26} />
            Kelola Slide 1 (Hero & Profil)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ubah teks utama, tajuk profesional, dan foto profil yang tampil di
            halaman depan.
          </p>
        </div>
      </div>

      {/* Notifikasi Sukses */}
      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-3 shadow-lg shadow-emerald-950/20 animate-fadeIn">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Form Utama */}
      <form
        onSubmit={handleSave}
        className="bg-slate-900/50 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Sektor Unggah Foto Profil */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
            Foto Profil Utama
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative group">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : hero.image_url ? (
                <img
                  src={hero.image_url}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <ImageIcon size={24} />
                  <span className="text-[10px]">No Image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 file:transition cursor-pointer border border-slate-800 rounded-xl bg-slate-900 p-2"
              />
              <p className="text-xs text-slate-500">
                Format yang didukung: JPG, PNG, atau WebP. Disarankan gambar
                berbentuk persegi (1:1).
              </p>
            </div>
          </div>
        </div>

        {/* Input Teks Sapaan */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Teks Sapaan (Greeting)
          </label>
          <input
            type="text"
            value={hero.greeting}
            onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
            placeholder="Contoh: Halo, Saya"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Input Judul Utama */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Judul Utama (Nama / Peran / Profesi)
          </label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            placeholder="Contoh: Professional Developer"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Deskripsi / Ringkasan Profil
          </label>
          <textarea
            rows="4"
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            placeholder="Tuliskan ringkasan singkat latar belakang keahlian Anda..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
