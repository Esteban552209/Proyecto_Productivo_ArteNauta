import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6Lqby-ItLBTO3BRBy7YJwiCK030Ac-UQ",
  authDomain: "artenauta.firebaseapp.com",
  projectId: "artenauta",
  storageBucket: "artenauta.firebasestorage.app",
  messagingSenderId: "35897279938",
  appId: "1:35897279938:web:5b9db88f9a38799104825b",
  measurementId: "G-HDR19RFWFF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);