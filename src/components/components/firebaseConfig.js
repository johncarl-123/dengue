import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Define Firebase configuration (ensure values are loaded from environment variables)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debugging: Log config to check for undefined values
console.log("Firebase Config:", firebaseConfig);

// Check if any Firebase config value is missing
if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.storageBucket ||
    !firebaseConfig.messagingSenderId ||
    !firebaseConfig.appId
) {
    throw new Error("Firebase configuration is incomplete. Check your environment variables.");
}

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully!");
} catch (error) {
    console.error("Error initializing Firebase:", error);
    throw new Error("Failed to initialize Firebase. Check your configuration.");
}

export { db, app };  // Export app and db for use in other files