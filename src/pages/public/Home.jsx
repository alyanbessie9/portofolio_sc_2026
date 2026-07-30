import React, { useState, useEffect } from "react";
import { FileText, Share2, Send, Code, Briefcase } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "../../lib/supabaseClient";

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

  // State untuk efek ketik (typing effect) pada terminal
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // Ambil data langsung dari Database Supabase saat komponen dimuat
  useEffect(() => {
    fetchHeroFromDatabase();
  }, []);

  // Efek untuk menjalankan animasi ketik setiap kali heroData.description berubah
  useEffect(() => {
    if (!heroData?.description) return;

    const textToType = heroData.description;
    let currentIndex = 0;

    setDisplayedText(""); // Reset teks saat data baru masuk
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
      }, 25); // Kecepatan ketik (semakin kecil semakin cepat)

      return () => clearInterval(typingInterval);
    }, 300);

    return () => clearTimeout(startTimeout);
  }, [heroData?.description]);

  const fetchHeroFromDatabase = async () => {
    const { data, error } = await supabase.from("hero").select("*").single();
    if (data) {
      setHeroData(data);
    } else if (error) {
      console.error("Gagal mengambil data hero:", error.message);
    }
  };

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

  const experiences = [
    {
      role: "Frontend Developer",
      company: "PT Teknologi Solusi",
      period: "2025 - Sekarang",
      desc: "Membangun antarmuka web responsif menggunakan React dan Tailwind CSS.",
    },
    {
      role: "Web Crawler Developer",
      company: "Academic Research Project",
      period: "2025",
      desc: "Mengembangkan sistem ekstraksi data pustaka otomatis menggunakan Python.",
    },
    {
      role: "Junior Software Engineer",
      company: "Magang Mandiri",
      period: "2024 - 2025",
      desc: "Mengoptimalkan performa kueri basis data dan arsitektur komponen.",
    },
  ];

  return (
    <div className="w-full">
      {/* SLIDE 1: Header & Profile */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-slate-900 to-slate-950 py-20">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          {/* Kolom Kiri: Gambar (Full & Tidak Terpotong) */}
          <div className="w-full md:w-1/3 flex justify-start">
            <div className="w-64 h-80 md:w-full md:h-[36rem] flex items-center justify-center overflow-hidden">
              {heroData.image_url ? (
                <img
                  src={heroData.image_url}
                  alt="Profile"
                  className="w-full h-full object-contain object-bottom"
                  style={{
                    filter:
                      "drop-shadow(10px 10px 0px rgba(39, 38, 35, 0.5)) drop-shadow(0 15px 20px rgba(252, 211, 77, 0.3))",
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

          {/* Kolom Kanan: Teks & Terminal dengan Efek Ketik */}
          <div className="w-full md:w-[60%] text-left mx-0">
            <h2 className="text-xl md:text-2xl text-indigo-400 font-medium mb-2">
              {heroData.greeting}
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-50">
              {heroData.title}
            </h1>

            {/* Terminal Box dengan Efek Ketik (Typing Effect) */}
            <div className="bg-slate-950 border border-slate-700 rounded-lg shadow-xl mb-8 overflow-hidden w-full max-w-none font-mono text-sm">
              {/* Header Terminal (Titik-titik kontrol) */}
              <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              {/* Isi Terminal */}
              <div className="p-5 text-slate-300 relative min-h-[110px]">
                <p
                  className={`relative z-10 transition-opacity duration-700 ${isStarted ? "opacity-100 blur-none" : "opacity-0 blur-sm"}`}
                >
                  {displayedText}
                  <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle"></span>
                </p>
              </div>
            </div>

            <div className="flex justify-start gap-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition shadow-lg shadow-indigo-500/20"
              >
                Hubungi Saya
              </a>
              <a
                href="#about"
                className="px-6 py-3 border border-slate-700 hover:border-slate-500 font-medium rounded-lg transition"
              >
                Tentang Saya
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
          <h2 className="text-3xl font-bold mb-4 text-center">
            Tentang & Pengalaman
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Berfokus pada kualitas kode yang bersih, efisien, serta pengalaman
            pengguna yang optimal.
          </p>

          <div className="mb-12 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3 text-indigo-400">
              Tentang Saya
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Lulusan baru Teknik Informatika yang memiliki dasar analisis kuat
              dalam struktur data, algoritma, serta siklus hidup pengembangan
              perangkat lunak (SDLC). Berpengalaman dalam merancang antarmuka
              interaktif dan sistem otomatisasi web.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-6">Pengalaman Profesional</h3>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="min-w-[300px] md:min-w-[350px] bg-slate-900 border border-slate-800 p-6 rounded-xl flex-shrink-0"
              >
                <span className="text-xs text-indigo-400 font-semibold px-2.5 py-1 bg-indigo-500/10 rounded-full">
                  {exp.period}
                </span>
                <h4 className="text-lg font-bold mt-4 mb-1">{exp.role}</h4>
                <p className="text-sm text-slate-400 mb-3">{exp.company}</p>
                <p className="text-slate-300 text-sm">{exp.desc}</p>
              </div>
            ))}
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
