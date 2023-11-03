// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";
import admin from "firebase-admin";
import { serviceAccount } from './serviceAccount.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const firebaseConfig = {
  apiKey: "AIzaSyAIKnLprcB70XgZf92bvvejPgjNRxGnhpM",
  authDomain: "chattest-b56d4.firebaseapp.com",
  projectId: "chattest-b56d4",
  storageBucket: "chattest-b56d4.appspot.com",
  messagingSenderId: "292346681233",
  credential: admin.credential.cert(serviceAccount),
};
//Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const storage = getStorage(app);
admin.initializeApp(firebaseConfig);
export const authAdmin = admin.auth();
