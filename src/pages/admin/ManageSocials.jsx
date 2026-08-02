import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; // Sesuaikan path import supabase Anda
import { Code, Briefcase, Share2, Save, Loader2 } from "lucide-react";

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
      <div className="max-w-2xl flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 text-slate-50">
        Manage Slide 4 (Socials & Publications)
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Configure your GitHub, LinkedIn, and TikTok external links.
      </p>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5"
      >
        {/* GitHub Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
            <Code size={16} className="text-indigo-400" /> GitHub URL
          </label>
          <input
            type="url"
            value={socials.github_url}
            onChange={(e) =>
              setSocials({ ...socials, github_url: e.target.value })
            }
            placeholder="https://github.com/username"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100 text-sm"
          />
        </div>

        {/* LinkedIn Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" /> LinkedIn URL
          </label>
          <input
            type="url"
            value={socials.linkedin_url}
            onChange={(e) =>
              setSocials({ ...socials, linkedin_url: e.target.value })
            }
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100 text-sm"
          />
        </div>

        {/* TikTok Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
            <Share2 size={16} className="text-indigo-400" /> TikTok URL
          </label>
          <input
            type="url"
            value={socials.tiktok_url}
            onChange={(e) =>
              setSocials({ ...socials, tiktok_url: e.target.value })
            }
            placeholder="https://tiktok.com/@username"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100 text-sm"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
