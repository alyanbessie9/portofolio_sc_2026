import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Trash2, Mail } from "lucide-react";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data pesan dari Firestore
  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Hapus pesan
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter((msg) => msg.id !== id));
      } catch (error) {
        console.error("Gagal menghapus pesan:", error);
      }
    }
  };

  return (
    <div className="p-8 text-slate-100">
      <h1 className="text-2xl font-bold mb-2">Kelola Pesan Masuk</h1>
      <p className="text-slate-400 mb-6">
        Daftar pesan yang dikirim oleh pengunjung melalui website.
      </p>

      {loading ? (
        <p className="text-slate-400">Memuat pesan...</p>
      ) : messages.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
          Belum ada pesan masuk.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-indigo-400" />
                  <h3 className="font-bold text-lg text-slate-200">
                    {msg.name}
                  </h3>
                  <span className="text-xs text-slate-500">({msg.email})</span>
                </div>
                <p className="text-slate-300 text-sm mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {msg.message}
                </p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition flex items-center gap-2 self-end md:self-center"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
