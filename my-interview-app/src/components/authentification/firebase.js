import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD77Mz9_mMbmVfXpxHyn8ZmpjBcm_3f2DM",
  authDomain: "pee-app-504b2.firebaseapp.com",
  projectId: "pee-app-504b2",
  storageBucket: "pee-app-504b2.appspot.com",
  messagingSenderId: "634298668146",
  appId: "1:634298668146:web:86bf8a08535bc26e685eeb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
  }
};

export const signInWithGithub = async () => {
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (error) {
    console.error("Error signing in with GitHub:", error.message);
  }
};

export const signInWithFacebook = async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
  } catch (error) {
    console.error("Error signing in with Facebook:", error.message);
  }
};