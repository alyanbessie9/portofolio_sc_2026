import React, { useState } from "react";
import { FileText, Share2, Send, Code, Briefcase } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
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
      <section className="h-screen flex items-center justify-center px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-3xl font-bold text-indigo-400">
            PF
          </div>
          <h2 className="text-xl md:text-2xl text-indigo-400 font-medium mb-2">
            Halo, Saya
          </h2>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Professional Developer
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Fresh graduate Teknik Informatika dengan keahlian dalam rekayasa
            perangkat lunak, pengembangan web modern, dan sistem ekstraksi data.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#contact"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition"
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
              Pesan berhasil dikirim!
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
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <Send size={16} /> Kirim Pesan
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
