import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSPgynJXNzIfG6sz-mnriGPxQ9RCwXWaM",
  authDomain: "plate2peoplenew.firebaseapp.com",
  projectId: "plate2peoplenew",
  storageBucket: "plate2peoplenew.firebasestorage.app",
  messagingSenderId: "263868392955",
  appId: "1:263868392955:web:6628b7275a2c1b613a175e",
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);
