// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEiNDnGFbyRO--UKnsy7myuLUB_lBCllA",
  authDomain: "birthday-e50cb.firebaseapp.com",
  projectId: "birthday-e50cb",
  storageBucket: "birthday-e50cb.appspot.com",
  messagingSenderId: "963763909950",
  appId: "1:963763909950:web:bb3e1c604fd269d3e6686f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

