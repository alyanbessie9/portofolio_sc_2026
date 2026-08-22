import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import {
  ArrowLeft,
  BookOpen,
  Search,
  Loader2,
  ExternalLink,
  Menu,
  Share2,
  Copy,
  Check,
  ChevronRight,
  CalendarDays,
  FileText,
  X,
  Maximize2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function ArchivePage() {
  const { date } = useParams();

  // ============================================================
  // STATE
  // ============================================================

  const [tocList, setTocList] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [fullContent, setFullContent] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [loadingToc, setLoadingToc] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);

  const [tocError, setTocError] = useState(null);
  const [contentError, setContentError] = useState(null);

  // Mobile navigation
  const [mobileView, setMobileView] = useState("content");

  // Share
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Content collapse
  const [isExpanded, setIsExpanded] = useState(false);

  // Image fullscreen
  const [showImagePreview, setShowImagePreview] = useState(false);

  // ============================================================
  // CACHE
  //
  // Menyimpan artikel yang sudah pernah dibuka.
  // Jika user membuka artikel yang sama lagi,
  // data langsung muncul tanpa request Supabase ulang.
  // ============================================================

  const contentCache = useRef(new Map());

  // Menyimpan ID request terakhir.
  // Digunakan untuk mencegah race condition.
  const requestIdRef = useRef(0);

  // ============================================================
  // RESET STATE SAAT ARTIKEL BERUBAH
  // ============================================================

  useEffect(() => {
    setIsExpanded(false);
    setShowImagePreview(false);
    setShowShareMenu(false);
  }, [activeItem?.id]);

  // ============================================================
  // UPDATE META TAG
  // ============================================================

  useEffect(() => {
    if (!fullContent) return;

    const title = fullContent.title || "Arsip Dokumentasi";

    const description =
      fullContent.description || "Jelajahi dokumentasi arsip dan pengetahuan.";

    const imageUrl = fullContent.image_url || "";

    const currentUrl = window.location.href;

    document.title = title;

    const setMetaTag = (propertyKey, contentValue, isProperty = true) => {
      if (!contentValue) return;

      const attrName = isProperty ? "property" : "name";

      let element = document.querySelector(
        `meta[${attrName}="${propertyKey}"]`,
      );

      if (!element) {
        element = document.createElement("meta");

        element.setAttribute(attrName, propertyKey);

        document.head.appendChild(element);
      }

      element.setAttribute("content", contentValue);
    };

    // Open Graph
    setMetaTag("og:title", title, true);

    setMetaTag("og:description", description, true);

    if (imageUrl) {
      setMetaTag("og:image", imageUrl, true);
    }

    setMetaTag("og:url", currentUrl, true);

    setMetaTag("og:type", "article", true);

    // Twitter
    setMetaTag(
      "twitter:card",
      imageUrl ? "summary_large_image" : "summary",
      false,
    );

    setMetaTag("twitter:title", title, false);

    setMetaTag("twitter:description", description, false);

    if (imageUrl) {
      setMetaTag("twitter:image", imageUrl, false);
    }
  }, [fullContent]);

  // ============================================================
  // FETCH TABLE OF CONTENTS
  //
  // Hanya mengambil data ringan.
  // Jangan mengambil content HTML di sini.
  // ============================================================

  const fetchToc = useCallback(async () => {
    setLoadingToc(true);
    setTocError(null);

    try {
      const { data, error } = await supabase
        .from("archives")
        .select(
          `
            id,
            date,
            title,
            category
          `,
        )
        .order("id", {
          ascending: false,
        })
        .limit(50);

      if (error) {
        throw error;
      }

      const archives = data || [];

      setTocList(archives);

      // Cari artikel berdasarkan parameter URL
      if (date) {
        const decodedDate = decodeURIComponent(date);

        const found = archives.find(
          (item) => item.date === decodedDate || item.title === decodedDate,
        );

        if (found) {
          setActiveItem(found);
        } else if (archives.length > 0) {
          setActiveItem(archives[0]);
        }
      } else if (archives.length > 0) {
        setActiveItem(archives[0]);
      }
    } catch (error) {
      console.error("Error fetching archive list:", error);

      setTocError("Gagal memuat daftar dokumentasi.");
    } finally {
      setLoadingToc(false);
    }
  }, [date]);

  // ============================================================
  // LOAD TABLE OF CONTENTS
  // ============================================================

  useEffect(() => {
    fetchToc();
  }, [fetchToc]);

  // ============================================================
  // FETCH FULL CONTENT
  //
  // OPTIMISASI:
  //
  // 1. Cek cache terlebih dahulu
  // 2. Hanya mengambil kolom diperlukan
  // 3. Race condition protection
  // 4. Tidak langsung menghapus content lama
  // ============================================================

  const fetchContent = useCallback(async () => {
    if (!activeItem?.id) return;

    const archiveId = activeItem.id;

    // --------------------------------------------------------
    // CEK CACHE
    // --------------------------------------------------------

    if (contentCache.current.has(archiveId)) {
      const cachedData = contentCache.current.get(archiveId);

      setFullContent(cachedData);

      setContentError(null);
      setLoadingContent(false);

      console.log("Archive loaded from cache:", archiveId);

      return;
    }

    // --------------------------------------------------------
    // REQUEST ID
    //
    // Request lama tidak boleh
    // menimpa artikel baru.
    // --------------------------------------------------------

    const currentRequestId = requestIdRef.current + 1;

    requestIdRef.current = currentRequestId;

    setLoadingContent(true);
    setContentError(null);

    // Performance timer
    const startTime = performance.now();

    try {
      // ------------------------------------------------------
      // QUERY OPTIMIZED
      //
      // JANGAN gunakan:
      // .select("*")
      // ------------------------------------------------------

      const { data, error } = await supabase
        .from("archives")
        .select(
          `
              id,
              date,
              title,
              category,
              description,
              content,
              image_url,
              url
            `,
        )
        .eq("id", archiveId)
        .single();

      // ------------------------------------------------------
      // ABAIKAN RESPONSE LAMA
      // ------------------------------------------------------

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Dokumentasi tidak ditemukan.");
      }

      // ------------------------------------------------------
      // SIMPAN KE CACHE
      // ------------------------------------------------------

      contentCache.current.set(archiveId, data);

      // Batasi cache maksimal 30 artikel
      if (contentCache.current.size > 30) {
        const oldestKey = contentCache.current.keys().next().value;

        contentCache.current.delete(oldestKey);
      }

      // ------------------------------------------------------
      // UPDATE CONTENT
      // ------------------------------------------------------

      setFullContent(data);

      const endTime = performance.now();

      console.log(
        `Archive ${archiveId} loaded in ${(endTime - startTime).toFixed(0)} ms`,
      );
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      console.error("Error fetching archive content:", error);

      setContentError(error.message || "Gagal memuat dokumentasi.");
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoadingContent(false);
      }
    }
  }, [activeItem?.id]);

  // ============================================================
  // LOAD CONTENT
  // ============================================================

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredToc = tocList.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      item.title?.toLowerCase().includes(query) ||
      item.date?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  // ============================================================
  // SELECT ARCHIVE
  // ============================================================

  const handleSelectArchive = (item) => {
    // Jangan request ulang jika artikel sama
    if (activeItem?.id === item.id) {
      setMobileView("content");
      return;
    }

    setActiveItem(item);
    setMobileView("content");
  };

  // ============================================================
  // SHARE
  // ============================================================

  const handleShare = async (platform) => {
    const currentUrl = window.location.href;

    const title = fullContent?.title || "Arsip Dokumentasi";

    const text = fullContent?.description || title;

    setShowShareMenu(false);

    if (platform === "native") {
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text,
            url: currentUrl,
          });
        } catch (error) {
          console.log("Share cancelled:", error);
        }
      } else {
        handleShare("copy");
      }

      return;
    }

    if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `*${title}*\n\n${text}\n\n${currentUrl}`,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );
    }

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );
    }

    if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );
    }

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(currentUrl);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) return "";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // SKELETON LOADING
  // ============================================================

  const ContentSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-3 w-32 rounded bg-slate-200" />

      <div className="mt-5 h-10 w-3/4 rounded-lg bg-slate-200" />

      <div className="mt-3 h-10 w-1/2 rounded-lg bg-slate-200" />

      <div className="mt-6 flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-slate-200" />

        <div className="h-9 w-28 rounded-lg bg-slate-200" />
      </div>

      <div className="mt-10 h-[280px] rounded-2xl bg-slate-200" />

      <div className="mt-10 space-y-3">
        <div className="h-4 w-full rounded bg-slate-200" />

        <div className="h-4 w-full rounded bg-slate-200" />

        <div className="h-4 w-11/12 rounded bg-slate-200" />

        <div className="h-4 w-4/5 rounded bg-slate-200" />
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* ======================================================
          GLOBAL STYLE
      ====================================================== */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #f8fafc;
        }

        .archive-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .archive-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .archive-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .archive-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .archive-html-content {
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          color: #475569;
        }

        .archive-html-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .archive-html-content h1,
        .archive-html-content h2,
        .archive-html-content h3,
        .archive-html-content h4 {
          color: #0f172a !important;
          font-weight: 800 !important;
          line-height: 1.35 !important;
          margin-top: 2em !important;
          margin-bottom: 0.7em !important;
          letter-spacing: -0.02em;
        }

        .archive-html-content h1 {
          font-size: 1.75rem !important;
        }

        .archive-html-content h2 {
          font-size: 1.45rem !important;
        }

        .archive-html-content h3 {
          font-size: 1.2rem !important;
        }

        .archive-html-content p {
          color: #475569 !important;
          margin-bottom: 1.1em !important;
          line-height: 1.85 !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }

        .archive-html-content ul {
          list-style-type: disc !important;
          padding-left: 1.6em !important;
          margin-bottom: 1.2em !important;
          color: #475569 !important;
        }

        .archive-html-content ol {
          list-style-type: decimal !important;
          padding-left: 1.6em !important;
          margin-bottom: 1.2em !important;
          color: #475569 !important;
        }

        .archive-html-content li {
          margin-bottom: 0.45em !important;
          line-height: 1.7 !important;
        }

        .archive-html-content blockquote {
          border-left: 3px solid #6366f1 !important;
          padding: 1rem 1.2rem !important;
          margin: 1.5rem 0 !important;
          color: #64748b !important;
          font-style: italic !important;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .archive-html-content pre,
        .archive-html-content .ql-syntax {
          background-color: #f1f5f9 !important;
          color: #4f46e5 !important;
          padding: 1.15rem !important;
          border-radius: 0.85rem !important;
          border: 1px solid #e2e8f0 !important;
          overflow-x: auto !important;
          margin: 1.5rem 0 !important;
          white-space: pre-wrap !important;
          word-break: break-all !important;
        }

        .archive-html-content code {
          background: rgba(99, 102, 241, 0.08);
          color: #4f46e5;
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 0.35rem;
          padding: 0.1rem 0.35rem;
          font-size: 0.9em;
        }

        .archive-html-content pre code {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          color: inherit !important;
        }

        .archive-html-content a {
          color: #4f46e5 !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(79, 70, 229, 0.3) !important;
          text-underline-offset: 3px;
          word-break: break-all !important;
        }

        .archive-html-content a:hover {
          color: #3730a3 !important;
        }

        .archive-html-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.9rem !important;
          margin: 1.5rem auto !important;
        }

        .archive-html-content table {
          width: 100% !important;
          overflow-x: auto !important;
          display: block !important;
          border-collapse: collapse !important;
          margin: 1.5rem 0 !important;
        }

        .archive-html-content th,
        .archive-html-content td {
          border: 1px solid #e2e8f0 !important;
          padding: 0.75rem !important;
        }

        .archive-html-content th {
          background: #f1f5f9 !important;
          color: #0f172a !important;
        }

        .content-collapsed {
          max-height: 520px;
          overflow: hidden;
          position: relative;
        }

        .content-collapsed::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 180px;
          background: linear-gradient(
            to bottom,
            rgba(248, 250, 252, 0),
            rgba(248, 250, 252, 1)
          );
          pointer-events: none;
        }

        .archive-grid-bg {
          background-image:
            linear-gradient(
              rgba(100, 116, 139, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(100, 116, 139, 0.08) 1px,
              transparent 1px
            );

          background-size: 40px 40px;
        }

        .archive-glow {
          background:
            radial-gradient(
              circle at 70% 0%,
              rgba(99, 102, 241, 0.06),
              transparent 32%
            );
        }
      `}</style>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[68px] flex items-center justify-between gap-4">
            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
              >
                <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center group-hover:border-indigo-300 group-hover:bg-indigo-50 transition">
                  <ArrowLeft size={15} />
                </span>

                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>

              <div className="hidden sm:block h-5 w-px bg-slate-200" />

              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <BookOpen size={16} className="text-indigo-500 shrink-0" />

                <span className="text-sm font-semibold text-slate-700 truncate">
                  Archive Documentation
                </span>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <FileText size={14} className="text-slate-400" />

                <span className="text-xs text-slate-500">
                  {tocList.length} documents
                </span>
              </div>

              <button
                onClick={() =>
                  setMobileView(mobileView === "toc" ? "content" : "toc")
                }
                className="md:hidden inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
              >
                <Menu size={15} />

                {mobileView === "toc" ? "Lihat Konten" : "Daftar Arsip"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="flex-1 archive-grid-bg archive-glow">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-68px)]">
          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside
            className={`
              md:col-span-4
              lg:col-span-3
              border-r
              border-slate-200
              bg-white/90
              ${mobileView === "toc" ? "block" : "hidden md:block"}
            `}
          >
            <div className="sticky top-[68px] h-[calc(100vh-68px)] flex flex-col">
              {/* SIDEBAR HEADER */}

              <div className="p-5 sm:p-6 border-b border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                        Knowledge Base
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Archive
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Browse your documentation history.
                    </p>
                  </div>

                  <div className="hidden md:flex w-9 h-9 rounded-xl border border-slate-200 bg-white items-center justify-center">
                    <BookOpen size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* SEARCH */}

                <div className="mt-5">
                  <div className="relative group">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Search title, date or category
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {filteredToc.length} result
                    </span>
                  </div>
                </div>
              </div>

              {/* ARCHIVE LIST */}

              <div className="flex-1 overflow-y-auto archive-scrollbar p-4 sm:p-5">
                {loadingToc ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="h-3 w-20 bg-slate-200 rounded" />

                        <div className="mt-3 h-4 w-full bg-slate-200 rounded" />

                        <div className="mt-2 h-3 w-2/3 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : tocError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                    <AlertCircle className="mx-auto text-red-500" size={20} />

                    <p className="mt-3 text-xs text-red-600">{tocError}</p>

                    <button
                      onClick={fetchToc}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-600"
                    >
                      <RefreshCw size={13} />
                      Coba Lagi
                    </button>
                  </div>
                ) : filteredToc.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-[17px] top-4 bottom-4 w-px bg-slate-200" />

                    <div className="space-y-2">
                      {filteredToc.map((item, index) => {
                        const isActive = activeItem?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectArchive(item)}
                            className="relative w-full text-left pl-10 pr-2 py-2 group"
                          >
                            <span
                              className={`
                                  absolute
                                  left-[12px]
                                  top-[18px]
                                  w-[11px]
                                  h-[11px]
                                  rounded-full
                                  border-2
                                  z-10
                                  ${
                                    isActive
                                      ? "bg-indigo-500 border-indigo-300"
                                      : "bg-white border-slate-300"
                                  }
                                `}
                            />

                            <div
                              className={`
                                  rounded-xl
                                  border
                                  px-3.5
                                  py-3
                                  transition-all
                                  ${
                                    isActive
                                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                                  }
                                `}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span
                                  className={`
                                      text-[10px]
                                      font-mono
                                      uppercase
                                      tracking-wider
                                      ${
                                        isActive
                                          ? "text-indigo-500"
                                          : "text-slate-400"
                                      }
                                    `}
                                >
                                  {formatDate(item.date)}
                                </span>

                                {isActive && (
                                  <ChevronRight
                                    size={13}
                                    className="text-indigo-500"
                                  />
                                )}
                              </div>

                              <div
                                className={`
                                    text-xs
                                    sm:text-sm
                                    leading-snug
                                    font-semibold
                                    ${
                                      isActive
                                        ? "text-slate-900"
                                        : "text-slate-600 group-hover:text-slate-900"
                                    }
                                  `}
                              >
                                {item.title}
                              </div>

                              <div className="mt-2 text-[9px] font-mono text-slate-400">
                                DOC-
                                {String(index + 1).padStart(3, "0")}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <Search size={17} className="mx-auto text-slate-400" />

                    <p className="mt-3 text-xs font-medium text-slate-600">
                      No documentation found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <section
            className={`
              md:col-span-8
              lg:col-span-9
              min-w-0
              ${mobileView === "content" ? "block" : "hidden md:block"}
            `}
          >
            <div className="min-h-[calc(100vh-68px)]">
              <article className="px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
                <div className="max-w-4xl mx-auto">
                  {/* INITIAL LOADING */}

                  {!fullContent && loadingContent && <ContentSkeleton />}

                  {/* ERROR */}

                  {contentError && !loadingContent && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                      <AlertCircle className="mx-auto text-red-500" size={26} />

                      <h2 className="mt-4 font-bold text-red-700">
                        Gagal memuat konten
                      </h2>

                      <p className="mt-2 text-sm text-red-600">
                        {contentError}
                      </p>

                      <button
                        onClick={() => fetchContent()}
                        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                      >
                        <RefreshCw size={14} />
                        Coba Lagi
                      </button>
                    </div>
                  )}

                  {/* CONTENT */}

                  {fullContent && (
                    <div
                      className={`
                        transition-opacity
                        duration-200
                        ${loadingContent ? "opacity-60" : "opacity-100"}
                      `}
                    >
                      {/* HEADER */}

                      <header>
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 mb-5">
                          <span>Documentation</span>

                          <ChevronRight size={12} />

                          <span>Archive</span>

                          <ChevronRight size={12} />

                          <span className="text-indigo-500 truncate">
                            {fullContent.category || "Document"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                            <CalendarDays size={12} />

                            {formatDate(fullContent.date)}
                          </span>

                          {fullContent.category && (
                            <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                              {fullContent.category}
                            </span>
                          )}
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.035em] leading-[1.1] text-slate-900 break-words">
                          {fullContent.title}
                        </h1>

                        <div className="mt-5 flex items-center gap-3">
                          <div className="h-px w-10 bg-indigo-500" />

                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                            Technical Documentation
                          </span>
                        </div>

                        {/* ACTION */}

                        <div className="mt-7 flex flex-wrap items-center gap-2">
                          <div className="relative">
                            <button
                              onClick={() => setShowShareMenu(!showShareMenu)}
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold transition shadow-sm"
                            >
                              <Share2 size={14} />
                              Share
                            </button>

                            {showShareMenu && (
                              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden z-50">
                                <button
                                  onClick={() => handleShare("native")}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-xs text-slate-600"
                                >
                                  <Share2 size={14} />
                                  Share Device / Apps
                                </button>

                                <button
                                  onClick={() => handleShare("whatsapp")}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-xs text-slate-600"
                                >
                                  WhatsApp
                                </button>

                                <button
                                  onClick={() => handleShare("facebook")}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-xs text-slate-600"
                                >
                                  Facebook
                                </button>

                                <button
                                  onClick={() => handleShare("linkedin")}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-xs text-slate-600"
                                >
                                  LinkedIn
                                </button>

                                <div className="border-t border-slate-200" />

                                <button
                                  onClick={() => handleShare("copy")}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-xs text-indigo-600 font-medium"
                                >
                                  {copied ? (
                                    <>
                                      <Check size={14} />
                                      Tautan Disalin
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={14} />
                                      Salin Tautan
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>

                          {fullContent.url && (
                            <a
                              href={fullContent.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 text-xs font-semibold transition"
                            >
                              <ExternalLink size={14} />
                              Source
                            </a>
                          )}
                        </div>
                      </header>

                      {/* COVER IMAGE */}

                      {fullContent.image_url && (
                        <div className="mt-9">
                          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                            <button
                              onClick={() => setShowImagePreview(true)}
                              className="absolute right-4 top-4 z-10 w-9 h-9 rounded-xl bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-900 transition shadow-sm"
                            >
                              <Maximize2 size={16} />
                            </button>

                            <div className="p-4 sm:p-6 lg:p-8">
                              <img
                                src={fullContent.image_url}
                                alt={fullContent.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full max-h-[520px] object-cover rounded-xl shadow-lg border border-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DESCRIPTION */}

                      {fullContent.description && (
                        <section className="mt-9">
                          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <FileText
                                  size={15}
                                  className="text-indigo-500"
                                />
                              </div>

                              <div>
                                <p className="text-xs font-bold text-slate-700">
                                  Overview
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  Document summary
                                </p>
                              </div>
                            </div>

                            <div className="px-5 sm:px-6 py-5">
                              <p className="text-sm sm:text-[15px] text-slate-600 leading-7 break-words">
                                {fullContent.description}
                              </p>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* CONTENT */}

                      {fullContent.content && (
                        <section className="mt-10">
                          <div className="flex items-center gap-3 mb-5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                              Documentation
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />
                          </div>

                          <div className="relative">
                            <div
                              className={`
                                archive-html-content
                                text-sm
                                sm:text-[15px]
                                leading-7
                                pt-1
                                ${!isExpanded ? "content-collapsed" : ""}
                              `}
                              dangerouslySetInnerHTML={{
                                __html: fullContent.content,
                              }}
                            />

                            {!isExpanded && (
                              <div className="relative z-10 -mt-2 pt-8 flex justify-center">
                                <button
                                  onClick={() => setIsExpanded(true)}
                                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition"
                                >
                                  Baca Selengkapnya
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </section>
                      )}

                      {/* FOOTER */}

                      <footer className="mt-14 pt-6 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            DOCUMENT LOADED
                          </div>

                          <span className="text-[10px] text-slate-400">
                            Documentation Archive
                          </span>
                        </div>
                      </footer>
                    </div>
                  )}

                  {/* EMPTY */}

                  {!loadingContent && !fullContent && !contentError && (
                    <div className="min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen
                          size={28}
                          className="mx-auto text-indigo-500"
                        />

                        <h2 className="mt-4 text-lg font-bold text-slate-900">
                          Select a document
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          Pilih dokumentasi dari daftar archive.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      {/* ======================================================
          IMAGE MODAL
      ====================================================== */}

      {showImagePreview && fullContent?.image_url && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setShowImagePreview(false)}
        >
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute right-5 top-5 w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={18} />
          </button>

          <img
            src={fullContent.image_url}
            alt={fullContent.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
