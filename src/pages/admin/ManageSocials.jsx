import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Code,
  Briefcase,
  Share2,
  Save,
  Loader2,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function ManageSocials() {
  const [socials, setSocials] = useState({
    github_url: "",
    linkedin_url: "",
    tiktok_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Ambil data sosial media dari database saat komponen dimuat
  useEffect(() => {
    fetchSocialsFromDatabase();
  }, []);

  const fetchSocialsFromDatabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("socials")
        .select("*")
        .single();

      if (data) {
        setSocials({
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          tiktok_url: data.tiktok_url || "",
        });
      } else if (error && error.code !== "PGRST116") {
        console.error("Error fetching socials:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Cek apakah data sudah ada (asumsi tabel menggunakan single row atau upsert berdasarkan id=1)
      const { error } = await supabase
        .from("socials")
        .upsert({ id: 1, ...socials });

      if (error) throw error;

      setMessage({
        text: "Social links updated successfully!",
        type: "success",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (err) {
      console.error("Error saving socials:", err.message);
      setMessage({
        text: "Failed to update links. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 text-slate-100">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2.5">
            <Globe className="text-indigo-400" size={26} />
            Manage Slide 4 (Socials & Publications)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your GitHub, LinkedIn, and TikTok external links.
          </p>
        </div>
      </div>

      {/* Notifikasi Status */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border flex items-center gap-3 shadow-lg ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-950/20"
              : "bg-red-500/10 border-red-500/30 text-red-400 shadow-red-950/20"
          }`}
        >
          {message.type === "success" && (
            <CheckCircle2 size={20} className="shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Utama */}
      <form
        onSubmit={handleSave}
        className="bg-slate-900/50 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* GitHub Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
            <Code size={16} className="text-indigo-400" /> GitHub URL
          </label>
          <input
            type="url"
            value={socials.github_url}
            onChange={(e) =>
              setSocials({ ...socials, github_url: e.target.value })
            }
            placeholder="https://github.com/username"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* LinkedIn Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" /> LinkedIn URL
          </label>
          <input
            type="url"
            value={socials.linkedin_url}
            onChange={(e) =>
              setSocials({ ...socials, linkedin_url: e.target.value })
            }
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* TikTok Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
            <Share2 size={16} className="text-indigo-400" /> TikTok URL
          </label>
          <input
            type="url"
            value={socials.tiktok_url}
            onChange={(e) =>
              setSocials({ ...socials, tiktok_url: e.target.value })
            }
            placeholder="https://tiktok.com/@username"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
