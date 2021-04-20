// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC8yW4nKgAx5xtTtLRsOJ0g6cXg6lpYI9E',
  authDomain: 'studio-471a3.firebaseapp.com',
  projectId: 'studio-471a3',
  storageBucket: 'studio-471a3.appspot.com',
  messagingSenderId: '806940342206',
  appId: '1:806940342206:web:2e905ab1a863c135a0ebef',
  measurementId: 'G-R17YHBE4EF',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();
firebase.auth().settings.appVerificationDisabledForTesting = true;

export default firebase;
