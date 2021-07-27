import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyACn8ymAhLMoCHaQG_3QRz38t2hcUQDVhY",
  authDomain: "quotesbook-ae596.firebaseapp.com",
  projectId: "quotesbook-ae596",
  storageBucket: "quotesbook-ae596.appspot.com",
  messagingSenderId: "214540384599",
  appId: "1:214540384599:web:05081abc20c5cb06d9e612",
  measurementId: "G-0QCK80XEZ5",
};

// firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();
const imageStore = firebase.storage();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const timeStamp = firebase.firestore.FieldValue.serverTimestamp();

export { db, imageStore, auth, googleProvider, timeStamp };
