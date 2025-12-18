
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Ensure correct modular imports from firebase/auth
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

/**
 * 請在此處填入您的 Firebase 設定資料
 * 這樣後續開發時就不需要每次都透過 GitHub Secrets 注入
 */
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

// 初始化檢查
const isConfigured = firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    // getAuth is a top-level export of firebase/auth in v9+
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error("Firebase 初始化失敗:", error);
  }
}

export { authInstance as auth, dbInstance as db, isConfigured };
