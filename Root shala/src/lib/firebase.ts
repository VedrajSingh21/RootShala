import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCegG8Z6TjTccaIoLriN3Zzkd8vUJVyDxU",
  authDomain: "eduone-2047.firebaseapp.com",
  projectId: "eduone-2047",
  storageBucket: "eduone-2047.firebasestorage.app",
  messagingSenderId: "474140733733",
  appId: "1:474140733733:web:56528e018b51aa03f96acc",
  measurementId: "G-0BXWWQKV39",
  databaseURL: "https://eduone-2047-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Auth
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };

if (typeof window !== 'undefined') {
  (window as any).db = db;
  import('firebase/database').then((mod) => {
    (window as any).firebaseSet = mod.set;
    (window as any).firebaseRef = mod.ref;
  });
}
