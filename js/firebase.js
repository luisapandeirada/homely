/**
 * Homely - Firebase & Cloud Backend Module
 * Modular integration for Firebase Authentication & Cloud Firestore (v10 ES Modules).
 */

import { store } from "./store.js";

// Template Firebase Configuration
// Replace these values with your Firebase Console Project settings when ready:
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "homely-app.firebaseapp.com",
  projectId: "homely-app",
  storageBucket: "homely-app.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456789"
};

let app = null;
let auth = null;
let db = null;
let isConfigured = false;

export async function initFirebase() {
  if (firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY") {
    console.log("ℹ️ Homely: Firebase is in template mode. Using client-side database store.");
    return false;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
    console.log("⚡ Homely: Connected to Firebase Cloud Backend.");
    return true;
  } catch (err) {
    console.warn("⚠️ Homely Firebase Init Warning:", err.message);
    return false;
  }
}

export function isFirebaseReady() {
  return isConfigured;
}

export async function registerFirebaseUser(name, email, password, role) {
  if (!isConfigured) return null;
  try {
    const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    await sendEmailVerification(userCred.user);
    return userCred.user;
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    throw err;
  }
}

export async function loginFirebaseUser(email, password) {
  if (!isConfigured) return null;
  try {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (err) {
    console.error("Firebase Login Error:", err);
    throw err;
  }
}
