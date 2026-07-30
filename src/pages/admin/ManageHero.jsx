import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">
        Kelola Slide 1 (Hero & Profil)
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Ubah teks utama, tajuk profesional, dan foto profil Anda.
      </p>

      {notification && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm">
          {notification}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5"
      >
        {/* Unggah Foto */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Foto Profil
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
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
                <span className="text-xs text-slate-500">No Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Teks Sapaan (Greeting)
          </label>
          <input
            type="text"
            value={hero.greeting}
            onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
            Judul Utama (Nama / Peran)
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
            Deskripsi / Sub-Judul
          </label>
          <textarea
            rows="3"
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
