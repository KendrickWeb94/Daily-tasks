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
  apiKey: "AIzaSyAD4RZ4xTI8wXhHPEBz--boE4Br02hVD-g",
  authDomain: "daily-tasks-a490b.firebaseapp.com",
  projectId: "daily-tasks-a490b",
  storageBucket: "daily-tasks-a490b.firebasestorage.app",
  messagingSenderId: "118606834003",
  appId: "1:118606834003:web:486c7c20a89a00326a59a6",
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
