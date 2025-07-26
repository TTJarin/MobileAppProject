import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRvcQfc2xtYI2a3ZxXvGFJyEa-ZR4nXOc",
  authDomain: "plate2peoplefinal.firebaseapp.com",
  projectId: "plate2peoplefinal",
  storageBucket: "plate2peoplefinal.appspot.com",
  messagingSenderId: "174998120931",
  appId: "1:174998120931:web:b03b621aef986323b698d6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
