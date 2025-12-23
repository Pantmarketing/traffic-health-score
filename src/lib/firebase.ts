import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Temporarily hard-coded config for debugging
const firebaseConfig = {
  apiKey: "AIzaSyDr6sjfnJiWnklK8jHd3VLtF-HmSpce75E",
  authDomain: "trafego-saas.firebaseapp.com",
  projectId: "trafego-saas",
  storageBucket: "trafego-saas.firebasestorage.app",
  messagingSenderId: "497993161854",
  appId: "1:497993161854:web:1a035dbc6782c1c58e0c2f",
  measurementId: "G-GGJGS8KYLY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
