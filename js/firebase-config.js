import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADHBXV-SM6FkVGgMnxZ7yoSuTXqb_vbVQ",
    authDomain: "ks-cards-and-scrapbooks.firebaseapp.com",
    projectId: "ks-cards-and-scrapbooks",
    storageBucket: "ks-cards-and-scrapbooks.firebasestorage.app",
    messagingSenderId: "475981300141",
    appId: "1:475981300141:web:46ea0c5fb0e17efaf42124",
    measurementId: "G-NRS74BCVS4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };