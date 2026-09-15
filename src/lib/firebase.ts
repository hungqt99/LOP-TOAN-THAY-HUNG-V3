import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration is supplied through Vite environment variables.
// This keeps the personal app independent from the original project.
const firebaseConfig = {
  apiKey: "AIzaSyBZqs68LZxNBAaxmClf1aZpSH0YZxQ4FJE",
  authDomain: "lop-toan-thay-hung.firebaseapp.com",
  projectId: "lop-toan-thay-hung",
  storageBucket: "lop-toan-thay-hung.firebasestorage.app",
  messagingSenderId: "704594831773",
  appId: "1:704594831773:web:bc596e2f25613f24d26774" ,
  measurementId: "G-WQRXTBVRRN"
};

const missing = Object.entries(firebaseConfig)
  .filter(([key, value]) => key !== "measurementId" && !value)
  .map(([key]) => key);

if (missing.length) {
  console.warn(`Firebase chưa được cấu hình. Thiếu: ${missing.join(", ")}`);
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = import.meta.env.VITE_FIREBASE_DATABASE_ID
  ? initializeFirestore(app, { ignoreUndefinedProperties: true }, import.meta.env.VITE_FIREBASE_DATABASE_ID)
  : initializeFirestore(app, { ignoreUndefinedProperties: true });

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
