import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft, BookOpen, Search, Loader2 } from "lucide-react";

export default function ArchivePage() {
  const { date } = useParams(); // Captures the date/title parameter from the URL
  const [tocList, setTocList] = useState([]); // Table of contents list in the left sidebar
  const [activeItem, setActiveItem] = useState(null); // Active item metadata
  const [fullContent, setFullContent] = useState(null); // Full content in the right pane
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch all archive records for the left sidebar table of contents
  useEffect(() => {
    const fetchToc = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("archives")
        .select("id, date, title, category")
        .order("id", { ascending: false });

      if (data) {
        setTocList(data);
        // If no parameter exists in the URL, select the top archive item as default
        if (!date && data.length > 0) {
          setActiveItem(data[0]);
        } else if (date) {
          const decodedDate = decodeURIComponent(date);
          const found = data.find(
            (item) => item.date === decodedDate || item.title === decodedDate,
          );
          if (found) setActiveItem(found);
        }
      }
      if (error) console.error("Error fetching TOC:", error);
      setLoading(false);
    };
    fetchToc();
  }, [date]);

  // 2. Fetch full content based on the currently selected active item
  useEffect(() => {
    const fetchContent = async () => {
      if (!activeItem) return;
      const { data, error } = await supabase
        .from("archives")
        .select("*")
        .eq("id", activeItem.id)
        .single();

      if (data) setFullContent(data);
      if (error) console.error("Error fetching archive content:", error);
    };
    fetchContent();
  }, [activeItem]);

  // Filter search query for the sidebar table of contents
  const filteredToc = tocList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-900 px-6 py-4 flex items-center justify-between bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition tracking-wider uppercase"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          <BookOpen size={14} /> Documentation & Archive Registry
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 max-w-7xl mx-auto w-full">
        {/* LEFT SIDEBAR: Table of Contents & Search */}
        <div className="md:col-span-4 border-r border-slate-900 p-6 space-y-6 bg-slate-950/40">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-100 mb-1">
              Table of Contents
            </h2>
            <p className="text-xs text-slate-400">
              Select a section or search archive logs.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search title or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          {/* Table of Contents List */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
              </div>
            ) : filteredToc.length > 0 ? (
              filteredToc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`w-full text-left p-4 rounded-xl transition border text-sm flex flex-col gap-1.5 cursor-pointer ${
                    activeItem?.id === item.id
                      ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300 font-bold shadow-lg shadow-indigo-950/20"
                      : "bg-slate-900/40 border-slate-900/80 text-slate-300 hover:bg-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-wider text-teal-400 uppercase">
                    {item.date}
                  </div>
                  <div className="truncate text-xs md:text-sm font-semibold">
                    {item.title}
                  </div>
                </button>
              ))
            ) : (
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-6 text-center">
                <p className="text-xs text-slate-500 italic">
                  No sections found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Archive Content */}
        <div className="md:col-span-8 p-6 md:p-12 overflow-y-auto bg-slate-950/20">
          {fullContent ? (
            <article className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 font-mono text-xs font-bold border border-teal-500/20 uppercase tracking-wider">
                  {fullContent.date}
                </span>
                {fullContent.category && (
                  <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
                    {fullContent.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50 leading-snug">
                {fullContent.title}
              </h1>

              {fullContent.image_url && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 flex justify-center shadow-xl">
                  <img
                    src={fullContent.image_url}
                    alt={fullContent.title}
                    className="max-h-80 object-contain rounded-xl"
                  />
                </div>
              )}

              {fullContent.description && (
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
                  {fullContent.description}
                </p>
              )}

              {/* Complete Rich Text Document Content */}
              {fullContent.content && (
                <div
                  className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base space-y-4 pt-4 border-t border-slate-900"
                  dangerouslySetInnerHTML={{ __html: fullContent.content }}
                />
              )}
            </article>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center text-slate-500 italic text-xs md:text-sm bg-slate-900/20 border border-slate-900 rounded-2xl p-8 text-center">
              Please select a section from the table of contents sidebar to view
              its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
