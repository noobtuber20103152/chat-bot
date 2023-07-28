import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// GoogleAuthProvider
const firebaseConfig = {
  apiKey: "AIzaSyBNH7vbc-esr7lh8VAMLH1vQqJmjK8_TGg",
  authDomain: "harshita-aa89d.firebaseapp.com",
  projectId: "harshita-aa89d",
  storageBucket: "harshita-aa89d.appspot.com",
  messagingSenderId: "308284441552",
  appId: "1:308284441552:web:097f23d526c737ba9c2fd5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
// const authes =
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { auth, db, provider };
