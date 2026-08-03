import React, { useState, useEffect } from "react";
import {
  Share2,
  Send,
  Code,
  Briefcase,
  User,
  Mail,
  FolderArchive,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "../../lib/supabaseClient";
import FloatingDateTime from "../../components/FloatingDateTime";

// Komponen Garis Biner Vertikal Lebih Panjang ke Bawah, Samping & Bawah Transparan (Fade)
function BinaryLineStream() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Jumlah kolom jalur biner yang merentang secara horizontal
    const colCount = 22;
    const generatedColumns = Array.from({ length: colCount }).map((_, i) => ({
      id: i,
      left: `${(i * 100) / colCount}%`,
      duration: `${Math.random() * 2 + 1.5}s`,
      delay: `${Math.random() * 2}s`,
      // Karakter biner yang mengalir secara vertikal
      binaryChars: Array.from({ length: 20 })
        .map(() => Math.round(Math.random()))
        .join("\n"),
    }));
    setColumns(generatedColumns);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-0 opacity-90 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%),linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [mask-composite:intersect] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%),linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-composite:source-in]">
      {/* Elemen Garis Cahaya Warna-warni Penghubung dengan Fade di Kiri, Kanan, dan Bawah */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-pink-500/20 animate-pulse blur-[1px]"></div>

      {/* Kolom Aliran Biner ke Bawah */}
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute text-center font-mono text-[10px] leading-3 tracking-tighter text-indigo-300/60 select-none animate-binary-fall"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {col.binaryChars}
        </div>
      ))}

      <style>{`
        @keyframes binaryFall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .animate-binary-fall {
          animation: binaryFall linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan data Hero yang dinamis dari Supabase
  const [heroData, setHeroData] = useState({
    greeting: "Hello, I'm",
    title: "Cyber Security Engineer",
    description:
      "Informatics Engineering graduate with strong foundations in digital forensics, CTF challenges, system security research, and modern web applications.",
    image_url: "",
  });

  // State untuk menyimpan data Experience dinamis dari Supabase
  const [experiences, setExperiences] = useState([]);

  // State untuk arsip & modal (Dipindah ke level atas komponen)
  const [archives, setArchives] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);

  // State untuk efek ketik (typing effect) pada terminal
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // State untuk membuka/menutup Sidebar Menu Mobile (Hamburger Menu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ambil data Hero, Experience, & Archives dari Database Supabase saat komponen dimuat
  useEffect(() => {
    fetchHeroFromDatabase();
    fetchExperiencesFromDatabase();
    fetchArchivesFromDatabase();
  }, []);

  const fetchHeroFromDatabase = async () => {
    const { data, error } = await supabase.from("hero").select("*").single();
    if (data) {
      setHeroData(data);
    } else if (error) {
      console.error("Failed to fetch hero data:", error.message);
    }
  };

  const fetchExperiencesFromDatabase = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("id", { ascending: false });

    if (data) {
      setExperiences(data);
    } else if (error) {
      console.error("Failed to fetch experiences data:", error.message);
    }
  };

  const fetchArchivesFromDatabase = async () => {
    const { data, error } = await supabase
      .from("archives")
      .select("*")
      .order("id", { ascending: false });

    if (data) setArchives(data);
    if (error) console.error("Failed to fetch archives data:", error.message);
  };

  // Efek untuk menjalankan animasi ketik setiap kali heroData.description berubah
  useEffect(() => {
    if (!heroData?.description) return;

    const textToType = heroData.description;
    let currentIndex = 0;

    setDisplayedText("");
    setIsStarted(false);

    const startTimeout = setTimeout(() => {
      setIsStarted(true);

      const typingInterval = setInterval(() => {
        if (currentIndex <= textToType.length) {
          setDisplayedText(textToType.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 25);

      return () => clearInterval(typingInterval);
    }, 300);

    return () => clearTimeout(startTimeout);
  }, [heroData?.description]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs
      .send(
        "service_k1q3tki",
        "template_k747635",
        templateParams,
        "u6nvb-C2A9q4usWzH",
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => setSubmitted(false), 4000);
        },
        (error) => {
          console.error("FAILED...", error);
          alert("Failed to send message. Please try again.");
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full pb-6 md:pb-0">
      <FloatingDateTime />

      {/* SLIDE 1: Header & Profile */}
      <section
        id="home"
        className="py-16 md:min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 md:py-20 overflow-hidden relative"
      >
        {/* Navigation untuk Desktop (Tampil flex di layar md ke atas) */}
        <div className="hidden md:flex absolute top-6 left-6 z-20 items-center gap-6">
          <a
            href="#about"
            className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
          >
            About Me
          </a>
          <a
            href="#archives"
            className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
          >
            Archives
          </a>
          <a
            href="#contact"
            className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
          >
            Contact Me
          </a>
        </div>

        {/* Tombol Menu Ikon (Hamburger) Khusus Tampilan Mobile */}
        <div className="md:hidden absolute top-6 left-6 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-indigo-400 hover:text-indigo-300 backdrop-blur-md shadow-lg transition-all"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Slide-out Sidebar */}
        <div
          className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-lg">
                Menu Navigasi
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600/10 text-slate-300 hover:text-indigo-400 font-medium transition-all"
              >
                <User size={18} />
                <span>About Me</span>
              </a>
              <a
                href="#archives"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600/10 text-slate-300 hover:text-indigo-400 font-medium transition-all"
              >
                <FolderArchive size={18} />
                <span>Archives & Activity</span>
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600/10 text-slate-300 hover:text-indigo-400 font-medium transition-all"
              >
                <Mail size={18} />
                <span>Contact Me</span>
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center pb-2">
            Portfolio &bull; {heroData.title}
          </div>
        </div>

        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-12 mt-8 md:mt-0 relative z-10">
          {/* Kolom Kiri: Gambar */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <div className="w-56 h-72 sm:w-64 sm:h-80 md:w-full md:h-[36rem] flex items-center justify-center overflow-hidden">
              {heroData.image_url ? (
                <img
                  src={heroData.image_url}
                  alt="Profile"
                  className="w-full h-full object-contain object-bottom transition-transform duration-500 hover:scale-105"
                  style={{
                    filter:
                      "drop-shadow(8px 8px 0px rgba(39, 38, 35, 0.5)) drop-shadow(0 15px 20px rgba(252, 211, 77, 0.3))",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-3xl">
                  <span className="text-6xl font-bold text-indigo-600">
                    {heroData.greeting?.charAt(0) || "S"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Teks & Garis Biner Panjang ke Bawah, Transparan di Ujung Samping & Bawah */}
          <div className="w-full md:w-[60%] text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium animate-pulse">
              {heroData.greeting}
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wider mb-4 leading-none"
              style={{
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                textTransform: "capitalize",
                color: "#fffaef",
                textShadow: `
                  1px 1px 0px #e6d5b8,
                  2px 2px 0px #d4bc96,
                  3px 3px 0px #c2a375,
                  4px 4px 0px #b08953,
                  5px 5px 10px rgba(0, 0, 0, 0.4)
                `,
              }}
            >
              {heroData.title}
            </h1>

            {/* GARIS BINER LEBIH PANJANG KE BAWAH, TRANSPARAN DI SAMPING & BAWAH */}
            <div
              className="relative w-full max-w-xl h-16 md:h-20 my-2 overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-950/60 shadow-inner flex items-center justify-center"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, black 70%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, black 70%, transparent)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            >
              <BinaryLineStream />
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 2: About Me & Experience */}
      <section
        id="about"
        className="py-16 md:min-h-screen px-6 bg-slate-950 flex flex-col justify-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4 text-center text-slate-50">
            About Me
          </h2>

          {/* Terminal Box */}
          <div className="mb-12 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden w-full font-mono text-sm">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-400 ml-2">about-me.sh</span>
            </div>

            <div className="p-6 text-slate-300 relative min-h-[100px]">
              <p
                className={`relative z-10 transition-opacity duration-700 leading-relaxed ${
                  isStarted ? "opacity-100 blur-none" : "opacity-0 blur-sm"
                }`}
              >
                {displayedText}
                <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"></span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6 text-slate-50">
            Experience
          </h3>
          <div className="w-full relative py-4 group-scroll">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

            <div className="overflow-x-auto no-scrollbar pb-4">
              {experiences.length > 0 ? (
                <div className="flex gap-6 animate-infinite-scroll">
                  {[...experiences, ...experiences].map((exp, index) => {
                    const CardWrapper = exp.url ? "a" : "div";
                    const wrapperProps = exp.url
                      ? {
                          href: exp.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className:
                            "min-w-[300px] md:min-w-[350px] bg-slate-900 border border-slate-800 p-6 rounded-xl flex-shrink-0 block transition-all duration-300 hover:border-indigo-500 cursor-pointer",
                        }
                      : {
                          className:
                            "min-w-[300px] md:min-w-[350px] bg-slate-900 border border-slate-800 p-6 rounded-xl flex-shrink-0 block",
                        };

                    return (
                      <CardWrapper key={`${exp.id}-${index}`} {...wrapperProps}>
                        <span className="text-xs text-indigo-400 font-semibold px-2.5 py-1 bg-indigo-500/10 rounded-full">
                          {exp.period}
                        </span>
                        <h4 className="text-lg font-bold mt-4 mb-1 text-slate-50 flex items-center justify-between">
                          {exp.role}
                          {exp.url && (
                            <span className="text-xs text-indigo-400 font-normal">
                              🔗 Visit
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-slate-400 mb-3">
                          {exp.company}
                        </p>
                        <p className="text-slate-300 text-sm">{exp.desc}</p>
                      </CardWrapper>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic text-center">
                  No work experience data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 3: Archives & Activity */}
      <section
        id="archives"
        className="py-16 md:min-h-screen px-6 bg-slate-900/50 flex flex-col justify-center relative"
      >
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-slate-50">
              Archives & Activity
            </h2>
            <p className="text-slate-400 text-sm">
              Activity track record and project documentation.
            </p>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-indigo-500/50 transition-all">
            <div className="relative border-l border-slate-800 ml-4 md:ml-32 space-y-8 py-2">
              {archives.length > 0 ? (
                [...archives]
                  .sort((a, b) => b.id - a.id)
                  .map((item) => (
                    <div key={item.id} className="relative pl-6 md:pl-8 group">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform"></div>

                      <div className="md:absolute md:-left-32 md:top-1 text-xs font-semibold text-indigo-400 mb-1 md:mb-0">
                        {item.date}
                      </div>

                      <div
                        onClick={() => setSelectedArchive(item)}
                        className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/50 transition-all shadow-lg cursor-pointer group-hover:-translate-y-1"
                      >
                        <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center justify-between">
                          {item.title}
                          <span className="text-xs text-indigo-400 font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                            📄 View Details &rarr;
                          </span>
                        </h3>
                        <p className="text-sm text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-slate-500 text-sm text-center italic">
                  No archive data available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MODAL POPUP */}
        {selectedArchive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedArchive(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 rounded-full">
                  {selectedArchive.category}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedArchive.date}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                {selectedArchive.title}
              </h2>

              <p className="text-sm text-slate-300 font-medium mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800/60">
                {selectedArchive.description}
              </p>

              <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-8 whitespace-pre-line">
                {selectedArchive.content ||
                  "No additional text details available for this archive."}
              </div>

              {selectedArchive.url && (
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <a
                    href={selectedArchive.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    🔗 Open External Link / File &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SLIDE 4: Socials */}
      <section className="py-16 md:min-h-screen px-6 bg-slate-950 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Socials & Publications</h2>
          <p className="text-slate-400 mb-12">
            Explore my source code repositories, professional network, and tech
            content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800/80 transition"
            >
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-lg">
                <Code size={24} />
              </div>
              <div>
                <h4 className="font-bold">GitHub</h4>
                <p className="text-sm text-slate-400">
                  Project repositories & source code
                </p>
              </div>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800/80 transition"
            >
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-lg">
                <Briefcase size={24} />
              </div>
              <div>
                <h4 className="font-bold">LinkedIn</h4>
                <p className="text-sm text-slate-400">
                  Professional profile & career history
                </p>
              </div>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800/80 transition"
            >
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-lg">
                <Share2 size={24} />
              </div>
              <div>
                <h4 className="font-bold">TikTok</h4>
                <p className="text-sm text-slate-400">
                  Tech education & programming content
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SLIDE 5: Contact & Footer dengan Animasi Aurora yang Lebih Hidup */}
      <section
        id="contact"
        className="relative py-20 md:min-h-screen px-6 bg-slate-950 flex flex-col justify-between overflow-hidden isolate"
      >
        {/* Background Animasi Aurora yang Ditingkatkan (Warna Lebih Kaya & Blur Lebih Lembut) */}
        <div className="absolute -inset-[100px] opacity-50 pointer-events-none overflow-hidden z-0">
          {/* Aurora Kiri Atas (Cyan Terang) */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[128px] animate-aurora-gentle-1"></div>

          {/* Aurora Kanan Tengah (Ungu) */}
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-600 rounded-full mix-blend-screen filter blur-[128px] animate-aurora-gentle-2 [animation-delay:-3s]"></div>

          {/* Aurora Bawah (Hijau Toska) */}
          <div className="absolute -bottom-1/4 left-1/3 w-[800px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] animate-aurora-gentle-3 [animation-delay:-5s]"></div>

          {/* Lapisan Gradien Gelap di atas Aurora agar teks tetap terbaca */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
        </div>

        {/* Konten Kontak (Dibuat sedikit lebih tebal agar kontras dengan background) */}
        <div className="max-w-xl mx-auto w-full relative z-10 my-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white drop-shadow-lg">
            Get in Touch
          </h2>
          <p className="text-slate-300 text-center mb-10 text-base font-medium drop-shadow-sm">
            Have questions or a job offer? Send a direct message below.
          </p>

          {/* Card Contact dengan Efek Kaca yang Lebih Tebal */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-xl shadow-indigo-950/30 ring-1 ring-white/5">
            {submitted && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-sm font-medium">
                Message successfully sent!
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-5">
              {/* Input Fields */}
              {[
                {
                  id: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Your Name / Company",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "email@domain.com",
                },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-semibold text-slate-200 mb-1.5"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    required
                    value={formData[field.id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder:text-slate-500 transition duration-200"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              {/* Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-200 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder:text-slate-500 transition duration-200 resize-none"
                  placeholder="Write your message or job offer..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Keyframes CSS untuk Animasi Aurora yang Halus & Memutar */}
        <style>{`
          @keyframes auroraGentle1 {
            0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
            50% { transform: translateX(50px) translateY(-30px) scale(1.1); }
          }
          @keyframes auroraGentle2 {
            0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
            50% { transform: translateX(-30px) translateY(40px) scale(1.05); }
          }
          @keyframes auroraGentle3 {
            0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
            50% { transform: translateX(30px) translateY(-20px) scale(1.08); }
          }
          .animate-aurora-gentle-1 { animation: auroraGentle1 10s infinite alternate ease-in-out; }
          .animate-aurora-gentle-2 { animation: auroraGentle2 12s infinite alternate ease-in-out; }
          .animate-aurora-gentle-3 { animation: auroraGentle3 14s infinite alternate ease-in-out; }
        `}</style>
        {/* Footer Minimalis */}
        <footer className="w-full max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-800/60 text-center relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} &bull; All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-indigo-400 transition">
              Home
            </a>
            <a href="#about" className="hover:text-indigo-400 transition">
              About
            </a>
            <a href="#archives" className="hover:text-indigo-400 transition">
              Archives
            </a>
            <a href="#contact" className="hover:text-indigo-400 transition">
              Contact
            </a>
          </div>
        </footer>
      </section>

      {/* Floating Action Buttons Container (Stacked vertically & perfectly aligned on the right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        {/* Tombol Panah ke Atas */}
        <button
          onClick={scrollToTop}
          className="bg-indigo-600 hover:bg-indigo-500 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Back to Top"
        >
          <ArrowUp size={22} />
        </button>

        {/* Tombol WhatsApp */}
        <a
          href="https://wa.me/+62881024056345?text=Hello,%20I'm%20interested%20in%20your%20portfolio."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Chat WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
