import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNDQRVkrHii3Wo4GHpRkKdOLxlQgY1mbY",
  authDomain: "portofolio-sc-app.firebaseapp.com",
  databaseURL: "https://portofolio-sc-app-default-rtdb.firebaseio.com",
  projectId: "portofolio-sc-app",
  storageBucket: "portofolio-sc-app.firebasestorage.app",
  messagingSenderId: "72814446113",
  appId: "1:72814446113:web:4a35ba81216eb653624560",
  measurementId: "G-JMKM5CG7GP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ekspor modul yang diperlukan untuk komponen React Anda
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const firestore = getFirestore(app);
