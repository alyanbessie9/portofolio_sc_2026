import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

const ALLOWED_OWNERS = ["thealyanbessie@gmail.com"];

export default function Login() {
  const [step, setStep] = useState(1); // 1: Google Login, 2: Input OTP Email
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInEmail = result.user.email;

      // Cek apakah email terdaftar sebagai pemilik
      if (!ALLOWED_OWNERS.includes(loggedInEmail)) {
        setError("Akses ditolak! Akun ini bukan pemilik sah situs.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Buat kode OTP 6 digit acak yang aman
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);

      // Kirim OTP asli ke email via EmailJS
      const templateParams = {
        to_email: loggedInEmail,
        pass_code: code,
      };

      await emailjs.send(
        "service_xlw9yzj",
        "template_y90eh5g",
        templateParams,
        "u6nvb-C2A9q4usWzH",
      );

      setMessage("Kode verifikasi 6 digit telah dikirim ke email Anda.");
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Gagal melakukan autentikasi atau mengirim email OTP.");
      await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (otp.trim() === generatedOtp) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Kode verifikasi salah atau tidak valid!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-100 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            {step === 1 ? <Lock size={28} /> : <ShieldCheck size={28} />}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1 text-center text-slate-50">
          Admin Panel
        </h2>
        <p className="text-slate-400 text-xs text-center mb-6">
          {step === 1
            ? "Autentikasi Terbatas Pemilik Sistem"
            : "Verifikasi Keamanan Tambahan (2FA)"}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        {/* Success / Info Message */}
        {message && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center flex items-center justify-center gap-2">
            <Mail size={14} className="flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 font-medium text-sm rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Login dengan Google</span>
              </>
            )}
          </button>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 text-center uppercase tracking-wider">
                Masukkan Kode Verifikasi 6 Digit
              </label>
              <input
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-center tracking-[0.5em] text-xl font-mono text-emerald-400 placeholder:tracking-normal placeholder:text-sm placeholder:text-slate-600"
                placeholder="------"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-medium text-sm rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verifikasi & Masuk</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition text-center"
            >
              ← Kembali ke Login Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
