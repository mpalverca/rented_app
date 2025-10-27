import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  //apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  apiKey: "AIzaSyA3G0MCrWs7mLPnK1AChnTzRisG4HrDM04",
  authDomain: "alcon-pr1.firebaseapp.com",
  projectId: "alcon-pr1",
  storageBucket: "alcon-pr1.firebasestorage.app",
  messagingSenderId: "995741336363",
  appId: "1:995741336363:web:21171d118d4356207dbb6e",
  measurementId: "G-413N580CKQ",
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(appFirebase);
export const auth = getAuth(appFirebase);
export const storage = getStorage(appFirebase);

export default appFirebase;
