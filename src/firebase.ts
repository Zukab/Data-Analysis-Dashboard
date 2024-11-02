// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6MSW-_ffq3uXx-qQtUvyMPSCeHPHXiHk",
  authDomain: "analysisdashboard-data.firebaseapp.com",
  projectId: "analysisdashboard-data",
  storageBucket: "analysisdashboard-data.appspot.com",
  messagingSenderId: "605288244314",
  appId: "1:605288244314:web:c34efa374837b88e726463",
  measurementId: "G-5KRZP6ZZY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);