import React, { useState, useEffect } from "react";
import { Share2, Send, Code, Briefcase } from "lucide-react";
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

  return (
    <div className="w-full">
      <FloatingDateTime />

      {/* SLIDE 1: Header & Profile */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 py-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-12">
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

          {/* Kolom Kanan: Teks & Deskripsi */}
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
        className="min-h-screen py-20 px-6 bg-slate-900/50 flex flex-col justify-center relative"
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
      <section className="min-h-screen py-20 px-6 bg-slate-950 flex flex-col justify-center">
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

      {/* SLIDE 5: Contact */}
      <section
        id="contact"
        className="min-h-screen py-20 px-6 bg-slate-900/50 flex flex-col justify-center"
      >
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-slate-400 text-center mb-8">
            Have questions or a job offer? Send a direct message below.
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-sm">
              Message successfully sent!
            </div>
          )}

          <form
            onSubmit={handleContactSubmit}
            className="space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100"
                placeholder="Your Name / Company"
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
                Message
              </label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-100"
                placeholder="Write your message or job offer..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Tombol WhatsApp Mengambang */}
      <a
        href="https://wa.me/+62881024056345?text=Hello,%20I'm%20interested%20in%20your%20portfolio."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Chat WhatsApp"
      >
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
