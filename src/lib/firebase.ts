import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCeX_g3q-ebPezVDEQqdDtKtZj-0pbVJc",
  authDomain: "spreadsheet-collab-820dd.firebaseapp.com",
  projectId: "spreadsheet-collab-820dd",
  storageBucket: "spreadsheet-collab-820dd.firebasestorage.app",
  messagingSenderId: "184675389909",
  appId: "1:184675389909:web:2d121179767853a45d6d5c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);