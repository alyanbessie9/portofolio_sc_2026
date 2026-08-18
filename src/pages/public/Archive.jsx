import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ArchivePage() {
  const { date } = useParams();

  const [tocList, setTocList] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [fullContent, setFullContent] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [loadingToc, setLoadingToc] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);

  // Mobile navigation
  const [mobileView, setMobileView] = useState("content");

  // Share
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Content collapse
  const [isExpanded, setIsExpanded] = useState(false);

  // Image fullscreen
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Reset expanded state when article changes
  useEffect(() => {
    setIsExpanded(false);
    setShowImagePreview(false);
  }, [activeItem]);

  // ============================================================
  // UPDATE OPEN GRAPH & SOCIAL MEDIA META TAGS
  // ============================================================
  useEffect(() => {
    if (!fullContent) return;

    const title = fullContent.title || "Arsip Dokumentasi";
    const description =
      fullContent.description || "Jelajahi dokumentasi arsip dan pengetahuan.";
    const imageUrl = fullContent.image_url || "";
    const currentUrl = window.location.href;

    // Update document title
    document.title = title;

    // Helper to set or create meta tags for social media crawlers
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

    // Open Graph (WhatsApp, Facebook, LinkedIn, etc.)
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", imageUrl, true);
    setMetaTag("og:url", currentUrl, true);
    setMetaTag("og:type", "article", true);

    // Twitter Cards
    setMetaTag("twitter:card", "summary_large_image", false);
    setMetaTag("twitter:title", title, false);
    setMetaTag("twitter:description", description, false);
    setMetaTag("twitter:image", imageUrl, false);
  }, [fullContent]);

  // ============================================================
  // FETCH ARCHIVE LIST
  // ============================================================
  useEffect(() => {
    const fetchToc = async () => {
      setLoadingToc(true);

      const { data, error } = await supabase
        .from("archives")
        .select("id, date, title")
        .order("id", { ascending: false })
        .limit(50);

      if (data) {
        setTocList(data);

        if (!date && data.length > 0) {
          setActiveItem(data[0]);
        } else if (date) {
          const decodedDate = decodeURIComponent(date);

          const found = data.find(
            (item) => item.date === decodedDate || item.title === decodedDate,
          );

          if (found) {
            setActiveItem(found);
          }
        }
      }

      if (error) {
        console.error("Error fetching TOC:", error);
      }

      setLoadingToc(false);
    };

    fetchToc();
  }, [date]);

  // ============================================================
  // FETCH FULL CONTENT
  // ============================================================
  useEffect(() => {
    const fetchContent = async () => {
      if (!activeItem) return;

      setLoadingContent(true);

      const { data, error } = await supabase
        .from("archives")
        .select("*")
        .eq("id", activeItem.id)
        .single();

      if (data) {
        setFullContent(data);
      }

      if (error) {
        console.error("Error fetching archive content:", error);
      }

      setLoadingContent(false);
    };

    fetchContent();
  }, [activeItem]);

  // ============================================================
  // SEARCH
  // ============================================================
  const filteredToc = tocList.filter(
    (item) =>
      (item.title &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.date &&
        item.date.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // ============================================================
  // SHARE HANDLER
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
            title: title,
            text: text,
            url: currentUrl,
          });
        } catch (err) {
          console.log("Error sharing:", err);
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
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl,
        )}`,
        "_blank",
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl,
        )}`,
        "_blank",
      );
    } else if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  // ============================================================
  // SELECT ARCHIVE
  // ============================================================
  const handleSelectArchive = (item) => {
    setActiveItem(item);
    setMobileView("content");
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* ======================================================
          GLOBAL STYLE
      ====================================================== */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .archive-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .archive-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .archive-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 999px;
        }

        .archive-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        .archive-html-content {
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          color: #cbd5e1;
        }

        .archive-html-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .archive-html-content h1,
        .archive-html-content h2,
        .archive-html-content h3,
        .archive-html-content h4 {
          color: #f8fafc !important;
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
          color: #cbd5e1 !important;
          margin-bottom: 1.1em !important;
          line-height: 1.85 !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }

        .archive-html-content ul {
          list-style-type: disc !important;
          padding-left: 1.6em !important;
          margin-bottom: 1.2em !important;
          color: #cbd5e1 !important;
        }

        .archive-html-content ol {
          list-style-type: decimal !important;
          padding-left: 1.6em !important;
          margin-bottom: 1.2em !important;
          color: #cbd5e1 !important;
        }

        .archive-html-content li {
          margin-bottom: 0.45em !important;
          line-height: 1.7 !important;
        }

        .archive-html-content blockquote {
          border-left: 3px solid #6366f1 !important;
          padding: 1rem 1.2rem !important;
          margin: 1.5rem 0 !important;
          color: #94a3b8 !important;
          font-style: italic !important;
          background: rgba(99, 102, 241, 0.06);
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .archive-html-content pre,
        .archive-html-content .ql-syntax {
          background-color: #020617 !important;
          color: #a5b4fc !important;
          padding: 1.15rem !important;
          border-radius: 0.85rem !important;
          border: 1px solid #1e293b !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          overflow-x: auto !important;
          margin: 1.5rem 0 !important;
          white-space: pre-wrap !important;
          word-break: break-all !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
        }

        .archive-html-content code {
          background: rgba(99, 102, 241, 0.1);
          color: #c4b5fd;
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 0.35rem;
          padding: 0.1rem 0.35rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9em;
        }

        .archive-html-content pre code {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          color: inherit !important;
        }

        .archive-html-content a {
          color: #818cf8 !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(129, 140, 248, 0.4) !important;
          text-underline-offset: 3px;
          word-break: break-all !important;
        }

        .archive-html-content a:hover {
          color: #a5b4fc !important;
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
          border: 1px solid #1e293b !important;
          padding: 0.75rem !important;
        }

        .archive-html-content th {
          background: #0f172a !important;
          color: #f8fafc !important;
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
            rgba(2, 6, 23, 0),
            rgba(2, 6, 23, 1)
          );
          pointer-events: none;
        }

        .archive-grid-bg {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .archive-glow {
          background:
            radial-gradient(
              circle at 70% 0%,
              rgba(99, 102, 241, 0.08),
              transparent 32%
            );
        }
      `}</style>

      {/* ======================================================
          TOP NAVIGATION
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#020617]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[68px] flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-white transition"
              >
                <span className="w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/70 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition">
                  <ArrowLeft size={15} />
                </span>

                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>

              <div className="hidden sm:block h-5 w-px bg-slate-800" />

              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <BookOpen size={16} className="text-indigo-400 shrink-0" />

                <span className="text-sm font-semibold text-slate-200 truncate">
                  Archive Documentation
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <FileText size={14} className="text-slate-500" />

                <span className="text-xs text-slate-400">
                  {tocList.length} documents
                </span>
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() =>
                  setMobileView(mobileView === "toc" ? "content" : "toc")
                }
                className="md:hidden inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/15 transition"
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
          {/* =================================================*
              SIDEBAR
          ================================================== */}
          <aside
            className={`
              md:col-span-4
              lg:col-span-3
              border-r border-slate-800/70
              bg-[#020617]/80
              ${mobileView === "toc" ? "block" : "hidden md:block"}
            `}
          >
            <div className="sticky top-[68px] h-[calc(100vh-68px)] flex flex-col">
              {/* Sidebar Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                        Knowledge Base
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Archive
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Browse your documentation history and select an entry to
                      read.
                    </p>
                  </div>

                  <div className="hidden md:flex w-9 h-9 rounded-xl border border-slate-800 bg-slate-900/60 items-center justify-center">
                    <BookOpen size={16} className="text-slate-500" />
                  </div>
                </div>

                {/* Search */}
                <div className="mt-5">
                  <div className="relative group">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition"
                    />

                    <input
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="
                        w-full
                        bg-slate-900/70
                        border border-slate-800
                        rounded-xl
                        pl-10
                        pr-10
                        py-3
                        text-xs
                        text-slate-100
                        placeholder:text-slate-600
                        outline-none
                        transition
                        focus:border-indigo-500/50
                        focus:ring-4
                        focus:ring-indigo-500/5
                      "
                    />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">
                      Search by title or date
                    </span>

                    <span className="text-[10px] font-mono text-slate-600">
                      {filteredToc.length} result
                      {filteredToc.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Archive List */}
              <div className="flex-1 overflow-y-auto archive-scrollbar p-4 sm:p-5">
                {loadingToc ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Loader2
                        className="animate-spin text-indigo-400"
                        size={19}
                      />
                    </div>

                    <span className="text-xs text-slate-500">
                      Loading archives...
                    </span>
                  </div>
                ) : filteredToc.length > 0 ? (
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-[17px] top-4 bottom-4 w-px bg-slate-800" />

                    <div className="space-y-2">
                      {filteredToc.map((item, index) => {
                        const isActive = activeItem?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectArchive(item)}
                            className={`
                              relative
                              w-full
                              text-left
                              pl-10
                              pr-2
                              py-2
                              group
                              cursor-pointer
                            `}
                          >
                            {/* Timeline Dot */}
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
                                transition
                                ${
                                  isActive
                                    ? "bg-indigo-500 border-indigo-300 shadow-lg shadow-indigo-500/40"
                                    : "bg-slate-950 border-slate-700 group-hover:border-indigo-500/50"
                                }
                              `}
                            />

                            {/* Card */}
                            <div
                              className={`
                                rounded-xl
                                border
                                px-3.5
                                py-3
                                transition-all
                                ${
                                  isActive
                                    ? "bg-indigo-500/[0.07] border-indigo-500/30 shadow-lg shadow-indigo-950/20"
                                    : "bg-slate-900/30 border-transparent hover:bg-slate-900/70 hover:border-slate-800"
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
                                        ? "text-indigo-400"
                                        : "text-slate-500"
                                    }
                                  `}
                                >
                                  {formatDate(item.date)}
                                </span>

                                {isActive && (
                                  <ChevronRight
                                    size={13}
                                    className="text-indigo-400"
                                  />
                                )}
                              </div>

                              <div
                                className={`
                                  text-xs sm:text-sm
                                  leading-snug
                                  font-semibold
                                  ${
                                    isActive
                                      ? "text-white"
                                      : "text-slate-400 group-hover:text-slate-200"
                                  }
                                `}
                              >
                                {item.title}
                              </div>

                              <div className="mt-2 text-[9px] font-mono text-slate-600">
                                DOC-{String(index + 1).padStart(3, "0")}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-8 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                      <Search size={17} className="text-slate-600" />
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                      No documentation found
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Try another title or date.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* =================================================*
              CONTENT AREA
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
              {loadingContent ? (
                <div className="p-5 sm:p-8 lg:p-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="min-h-[500px] rounded-3xl border border-slate-800/70 bg-slate-900/20 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Loader2
                          className="animate-spin text-indigo-400"
                          size={22}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-300">
                          Loading documentation
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Please wait...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : fullContent ? (
                <article className="px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
                  <div className="max-w-4xl mx-auto">
                    {/* ==========================================
                        ARTICLE HEADER
                    ========================================== */}
                    <header>
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-600 mb-5">
                        <span>Documentation</span>

                        <ChevronRight size={12} />

                        <span className="text-slate-500">Archive</span>

                        <ChevronRight size={12} />

                        <span className="text-indigo-400 truncate">
                          {fullContent.category || "Document"}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                          <CalendarDays size={12} />

                          {formatDate(fullContent.date)}
                        </span>

                        {fullContent.category && (
                          <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            {fullContent.category}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.035em] leading-[1.1] text-white break-words">
                        {fullContent.title}
                      </h1>

                      {/* Intro line */}
                      <div className="mt-5 flex items-center gap-3">
                        <div className="h-px w-10 bg-indigo-500" />

                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">
                          Technical Documentation
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-7 flex flex-wrap items-center gap-2">
                        {/* Share */}
                        <div className="relative">
                          <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-3.5
                              py-2
                              rounded-lg
                              bg-slate-900/80
                              hover:bg-slate-800
                              border
                              border-slate-800
                              hover:border-slate-700
                              text-slate-300
                              text-xs
                              font-semibold
                              transition
                            "
                          >
                            <Share2 size={14} />
                            Share
                          </button>

                          {showShareMenu && (
                            <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-800 bg-[#0b1120] shadow-2xl shadow-black/40 overflow-hidden z-50">
                              <div className="px-4 py-3 border-b border-slate-800">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                  Share document
                                </p>
                              </div>

                              <button
                                onClick={() => handleShare("native")}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 flex items-center gap-3 text-xs text-slate-300 transition"
                              >
                                <Share2 size={14} className="text-indigo-400" />
                                Share Device / Apps
                              </button>

                              <button
                                onClick={() => handleShare("whatsapp")}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 flex items-center gap-3 text-xs text-slate-300 transition"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                WhatsApp
                              </button>

                              <button
                                onClick={() => handleShare("facebook")}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 flex items-center gap-3 text-xs text-slate-300 transition"
                              >
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Facebook
                              </button>

                              <button
                                onClick={() => handleShare("linkedin")}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 flex items-center gap-3 text-xs text-slate-300 transition"
                              >
                                <span className="w-2 h-2 rounded-full bg-sky-500" />
                                LinkedIn
                              </button>

                              <div className="border-t border-slate-800" />

                              <button
                                onClick={() => handleShare("copy")}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 flex items-center gap-3 text-xs text-indigo-300 font-medium transition"
                              >
                                {copied ? (
                                  <>
                                    <Check
                                      size={14}
                                      className="text-emerald-400"
                                    />
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

                        {/* External source */}
                        {fullContent.url && (
                          <a
                            href={fullContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-3.5
                              py-2
                              rounded-lg
                              bg-indigo-500/10
                              hover:bg-indigo-500/15
                              border
                              border-indigo-500/20
                              hover:border-indigo-500/40
                              text-indigo-300
                              text-xs
                              font-semibold
                              transition
                            "
                          >
                            <ExternalLink size={14} />
                            Source
                          </a>
                        )}
                      </div>
                    </header>

                    {/* ==========================================
                        COVER IMAGE
                    ========================================== */}
                    {fullContent.image_url && (
                      <div className="mt-9">
                        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/90 shadow-2xl shadow-indigo-950/30">
                          {/* Ambient Glow */}
                          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                          <div className="absolute left-4 top-4 z-10">
                            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/65 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-indigo-300 shadow-lg">
                              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                              Cover Preview
                            </span>
                          </div>

                          <button
                            onClick={() => setShowImagePreview(true)}
                            className="absolute right-4 top-4 z-10 w-9 h-9 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/80 transition shadow-lg"
                            title="View Fullscreen"
                          >
                            <Maximize2 size={16} />
                          </button>

                          <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                            <img
                              src={fullContent.image_url}
                              alt={fullContent.title}
                              className="w-full max-h-[520px] object-cover rounded-xl shadow-xl border border-slate-800/60 group-hover:scale-[1.01] transition duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ==========================================
                        OVERVIEW
                    ========================================== */}
                    {fullContent.description && (
                      <section className="mt-9">
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/35 overflow-hidden shadow-lg">
                          <div className="px-5 sm:px-6 py-4 border-b border-slate-800/70 flex items-center gap-3 bg-slate-900/60">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                              <FileText size={15} className="text-indigo-400" />
                            </div>

                            <div>
                              <p className="text-xs font-bold text-slate-200">
                                Overview
                              </p>

                              <p className="text-[10px] text-slate-500">
                                Document summary &amp; social snippet
                              </p>
                            </div>
                          </div>

                          <div className="px-5 sm:px-6 py-5">
                            <p className="text-sm sm:text-[15px] text-slate-300 leading-7 break-words">
                              {fullContent.description}
                            </p>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* ==========================================
                        CONTENT
                    ========================================== */}
                    {fullContent.content && (
                      <section className="mt-10">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                            Documentation
                          </span>

                          <div className="h-px flex-1 bg-slate-800" />
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
                                className="
                                  group
                                  inline-flex
                                  items-center
                                  gap-2.5
                                  px-5
                                  py-2.5
                                  rounded-xl
                                  bg-indigo-600
                                  hover:bg-indigo-500
                                  text-white
                                  text-xs
                                  font-bold
                                  shadow-xl
                                  shadow-indigo-950/30
                                  transition
                                "
                              >
                                Baca Selengkapnya
                                <ChevronRight
                                  size={14}
                                  className="group-hover:translate-x-0.5 transition"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* ==========================================
                        FOOTER ARTICLE
                    ========================================== */}
                    <footer className="mt-14 pt-6 border-t border-slate-800/70">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          DOCUMENT LOADED
                          <span className="text-slate-800">/</span>
                          ARCHIVE
                        </div>

                        <span className="text-[10px] text-slate-700">
                          Documentation Archive
                        </span>
                      </div>
                    </footer>
                  </div>
                </article>
              ) : (
                /* =================================================*
                   EMPTY STATE
                ================================================== */
                <div className="p-5 sm:p-8 lg:p-12">
                  <div className="max-w-4xl mx-auto min-h-[600px] rounded-3xl border border-slate-800/70 bg-slate-900/20 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <BookOpen size={22} className="text-indigo-400" />
                      </div>

                      <h2 className="mt-5 text-lg font-bold text-white">
                        Select a document
                      </h2>

                      <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Select an archive entry from the sidebar to view its
                        documentation and details.
                      </p>

                      <button
                        onClick={() => setMobileView("toc")}
                        className="md:hidden mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
                      >
                        <Menu size={14} />
                        Open Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ======================================================
          IMAGE FULLSCREEN MODAL
      ====================================================== */}
      {showImagePreview && fullContent?.image_url && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setShowImagePreview(false)}
        >
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute right-5 top-5 w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
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
