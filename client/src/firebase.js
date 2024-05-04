// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2be44.firebaseapp.com",
  projectId: "mern-blog-2be44",
  storageBucket: "mern-blog-2be44.appspot.com",
  messagingSenderId: "86196685119",
  appId: "1:86196685119:web:3d392739583c7fe2536b8a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
