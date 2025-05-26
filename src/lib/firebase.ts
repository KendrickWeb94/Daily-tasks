// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as signInWithEmail,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-7Xuvc1tP_4-NgYIhXpqz8xFj5M7Dbls",
  authDomain: "daily-tasks-26df6.firebaseapp.com",
  projectId: "daily-tasks-26df6",
  storageBucket: "daily-tasks-26df6.firebasestorage.app",
  messagingSenderId: "148816350600",
  appId: "1:148816350600:web:3b47afd8d4446648063e3d",
  measurementId: "G-4HJZ7WFHMB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//@-ts-ignore

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailAndPassword = (email: string, password: string) =>
  signInWithEmail(auth, email, password);
export const signInAsAnonymous = () => signInAnonymously(auth);

export { auth, db };
