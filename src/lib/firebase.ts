import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv36A_hryde1_Q7gteG2nk45kLR2nnk1s",
  authDomain: "pay-off-db80b.firebaseapp.com",
  projectId: "pay-off-db80b",
  storageBucket: "pay-off-db80b.appspot.com",
  messagingSenderId: "254279785994",
  appId: "1:254279785994:web:a89da2c8297d32e83f89f3",
  measurementId: "G-7H8WSKEM51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
