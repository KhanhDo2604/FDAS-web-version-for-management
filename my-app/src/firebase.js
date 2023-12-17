// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChXadJ5waTAtN5smMdrW_pwCeIyxC2nZI",
  authDomain: "attendance-system-390b9.firebaseapp.com",
  projectId: "attendance-system-390b9",
  storageBucket: "attendance-system-390b9.appspot.com",
  messagingSenderId: "241850365038",
  appId: "1:241850365038:web:967bae556183506ecf227f",
  measurementId: "G-ZS1VCT3ZXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);