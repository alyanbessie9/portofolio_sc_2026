import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const ALLOWED_OWNERS = ["thealyanbessie@gmail.com"];

export default function Login() {
  const [step, setStep] = useState(1); // 1: Google Login, 2: Input OTP Email
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInEmail = result.user.email;

      // Cek apakah email terdaftar sebagai pemilik
      if (!ALLOWED_OWNERS.includes(loggedInEmail)) {
        setError("Akses ditolak! Akun ini bukan pemilik situs.");
        await auth.signOut();
        return;
      }

      // Buat kode OTP 6 digit acak
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

      setMessage("Kode verifikasi 6 digit telah dikirim ke email Anda!");
      setStep(2);
    } catch (err) {
      setError("Gagal melakukan autentikasi atau mengirim email OTP.");
      await auth.signOut();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Kode verifikasi salah!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-center">Admin Panel</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Autentikasi Keamanan Pemilik Situs
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg text-center">
            {message}
          </div>
        )}

        {step === 1 ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            Login dengan Akun Google
          </button>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 text-center">
                Masukkan Kode Verifikasi 6 Digit dari Email
              </label>
              <input
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-center tracking-widest text-lg"
                placeholder="------"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-medium rounded-lg transition"
            >
              Verifikasi & Masuk
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
