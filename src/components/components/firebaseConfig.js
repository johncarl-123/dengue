import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUfhPjaYRENbR__DpwVhW46qYzv4o9yKg",
  authDomain: "dengue-cases.firebaseapp.com",
  projectId: "dengue-cases",
  storageBucket: "dengue-cases.firebasestorage.app",
  messagingSenderId: "1094557550808",
  appId: "1:1094557550808:web:4dd0226b473836c90f6fad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export db, collection, and getDocs
export { db, collection, getDocs };
