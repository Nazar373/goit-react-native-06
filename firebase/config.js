// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth/react-native';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-rVReXHyXFsUXqmPsMZrrwiiFDmhDEtI",
  authDomain: "project-native-35a52.firebaseapp.com",
  projectId: "project-native-35a52",
  storageBucket: "project-native-35a52.appspot.com",
  messagingSenderId: "350230914908",
  appId: "1:350230914908:web:f7883ff10600f8db630399",
  measurementId: "G-L6B31G1EZY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
  });

 export const db = getFirestore(app);