
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Import modular auth functions and re-export them to centralize Firebase dependencies
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

/**
 * 請在此處填入您的 Firebase 設定資料
 */
const firebaseConfig = {
  apiKey: "AIzaSyCbCnWxO_XAwPOCSmOqtrlJWaolo7xE-o4",
  authDomain: "smartfinanceai-5c610.firebaseapp.com",
  projectId: "smartfinanceai-5c610",
  storageBucket: "smartfinanceai-5c610.firebasestorage.app",
  messagingSenderId: "751181647826",
  appId: "1:751181647826:web:3e9557f0097ea35863c20b"
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

// 安全檢查：判斷是否填寫了正確的 Firebase 設定
const isConfigured = firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error("Firebase 初始化失敗:", error);
  }
}

export { 
  authInstance as auth, 
  dbInstance as db, 
  isConfigured,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
};
