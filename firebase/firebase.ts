// connecting nextjs with firebase

import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPuMzRX0QpHpCaZaOgPjJpIjq723CEMNM",
  authDomain: "saascribe-1efb0.firebaseapp.com",
  projectId: "saascribe-1efb0",
  storageBucket: "saascribe-1efb0.firebasestorage.app",
  messagingSenderId: "444148787812",
  appId: "1:444148787812:web:fc788fd067ecdaf2a88d71",
  measurementId: "G-CBEYXLYKK9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
