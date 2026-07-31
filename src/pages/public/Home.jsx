import React, { useState, useEffect } from "react";
import { FileText, Share2, Send, Code, Briefcase } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "../../lib/supabaseClient";
import FloatingDateTime from "../../components/FloatingDateTime";

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
    greeting: "Halo, Saya",
    title: "Professional Developer",
    description:
      "Fresh graduate Teknik Informatika dengan keahlian dalam rekayasa perangkat lunak, pengembangan web modern, dan sistem ekstraksi data.",
    image_url: "",
  });

  // State untuk menyimpan data Experience dinamis dari Supabase
  const [experiences, setExperiences] = useState([]);

  // State untuk efek ketik (typing effect) pada terminal
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // Ambil data Hero & Experience dari Database Supabase saat komponen dimuat
  useEffect(() => {
    fetchHeroFromDatabase();
    fetchExperiencesFromDatabase();
  }, []);

  const fetchHeroFromDatabase = async () => {
    const { data, error } = await supabase.from("hero").select("*").single();
    if (data) {
      setHeroData(data);
    } else if (error) {
      console.error("Gagal mengambil data hero:", error.message);
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
      console.error("Gagal mengambil data experiences:", error.message);
    }
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
          alert("Gagal mengirim pesan. Silakan coba lagi.");
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <FloatingDateTime />

      {/* SLIDE 1: Header & Profile */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 py-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-12">
          {/* Kolom Kiri: Gambar (Responsif & Rapi di HP) */}
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

          {/* Kolom Kanan: Teks & Deskripsi Elegan */}
          <div className="w-full md:w-[60%] text-center md:text-left">
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

            {/* Tombol Navigasi */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5"
              >
                Contact Me
              </a>
              <a
                href="#about"
                className="w-full sm:w-auto text-center px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                About Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 2: About Me & Experience */}
      <section
        id="about"
        className="min-h-screen py-20 px-6 bg-slate-950 flex flex-col justify-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4 text-center text-slate-50">
            About Me
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12"></p>

          {/* Terminal Box */}
          <div className="mb-12 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden w-full font-mono text-sm">
            {/* Header Terminal */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-400 ml-2">about-me.sh</span>
            </div>

            {/* Isi Terminal dengan Efek Ketik */}
            <div className="p-6 text-slate-300 relative min-h-[100px]">
              <p
                className={`relative z-10 transition-opacity duration-700 leading-relaxed ${isStarted ? "opacity-100 blur-none" : "opacity-0 blur-sm"}`}
              >
                {displayedText}
                <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"></span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6 text-slate-50">
            Experience
          </h3>
          {/* Container utama dengan pembungkus group-scroll */}
          <div className="w-full relative py-4 group-scroll">
            {/* Efek gradasi opsional di sisi kiri dan kanan */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

            {/* Area overflow-x-auto agar tetap bisa di-scroll secara manual oleh user */}
            <div className="overflow-x-auto no-scrollbar pb-4">
              {experiences.length > 0 ? (
                <div className="flex gap-6 animate-infinite-scroll">
                  {/* Duplikat array agar infinite loop tetap mulus */}
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
                              🔗 Kunjungi
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
                  Belum ada data pengalaman kerja.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 3: Skills */}
      <section className="min-h-screen py-20 px-6 bg-slate-900/50 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Keahlian & Teknologi</h2>
          <p className="text-slate-400 mb-12">
            Teknologi dan kerangka kerja yang biasa digunakan dalam pengembangan
            proyek.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "React.js",
              "Tailwind CSS",
              "JavaScript (ES6+)",
              "Python / BeautifulSoup",
              "Git & GitHub",
              "RESTful API",
              "SQL & Databases",
              "UI/UX Design",
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/50 transition"
              >
                <span className="font-medium text-slate-200">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 4: Media Sosial & Paper */}
      <section className="min-h-screen py-20 px-6 bg-slate-950 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Publikasi & Tautan Sosial</h2>
          <p className="text-slate-400 mb-12">
            Temukan artikel riset, kode sumber, dan jejaring profesional saya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                  Repitori kode sumber proyek & skripsi
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
                  Profil profesional dan riwayat karier
                </p>
              </div>
            </a>

            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800/80 transition"
            >
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold">Paper / Artikel Akademik</h4>
                <p className="text-sm text-slate-400">
                  Dokumentasi penelitian dan karya ilmiah
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
                  Konten edukasi teknologi & pemrograman
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SLIDE 5: Kontak */}
      <section
        id="contact"
        className="min-h-screen py-20 px-6 bg-slate-900/50 flex flex-col justify-center"
      >
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Kirim Pesan</h2>
          <p className="text-slate-400 text-center mb-8">
            Punya pertanyaan atau penawaran kerja? Kirimkan pesan langsung
            melalui formulir di bawah.
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-sm">
              Pesan berhasil dikirim langsung ke email!
            </div>
          )}

          <form
            onSubmit={handleContactSubmit}
            className="space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100"
                placeholder="Nama Anda / Perusahaan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100"
                placeholder="email@domain.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Pesan
              </label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100"
                placeholder="Tulis pesan atau tawaran kerja..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} /> {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </section>
      {/* Tombol WhatsApp Mengambang di Kiri Bawah */}
      <a
        href="https://wa.me/+62881024056345?text=Halo,%20saya%20tertarik%20dengan%20portofolio%20Anda."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Chat WhatsApp"
      >
        {/* Menggunakan SVG ikon WhatsApp agar langsung tampil tanpa tambahan dependensi */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
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
  );
}
