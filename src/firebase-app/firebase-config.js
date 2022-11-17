import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX7gM-a3rKzMmBCAwpaVZE91bTCzdhLEg",
  authDomain: "smarttender-2e48f.firebaseapp.com",
  projectId: "smarttender-2e48f",
  storageBucket: "smarttender-2e48f.appspot.com",
  messagingSenderId: "285060949408",
  appId: "1:285060949408:web:aae2374cacb4f67b42f0c5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
