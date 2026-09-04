console.log("ADMIN LOGIN JS LOADED");
import { app } from "./firebase-config.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    loginMessage.textContent = "Logging in...";

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log("LOGIN SUCCESS:", userCredential.user.email);

        loginMessage.textContent = "Login successful!";

        window.location.href = "admin-dashboard.html";

         } catch (error) {
    console.error("FIREBASE ERROR:", error.code, error.message);

    if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
    ) {
        loginMessage.textContent = "Invalid email or password.";
    } else {
        loginMessage.textContent = "Something went wrong. Please try again.";
    }
}



});