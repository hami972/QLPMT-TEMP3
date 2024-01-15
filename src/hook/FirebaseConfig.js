// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEbtjcbfUT5PenbIUyXLqkoVpEQRjBVrs",
  authDomain: "phongmachtu-52829.firebaseapp.com",
  projectId: "phongmachtu-52829",
  storageBucket: "phongmachtu-52829.appspot.com",
  messagingSenderId: "633126895578",
  appId: "1:633126895578:web:ccc702be563e893955cae3",
  measurementId: "G-JMP2N8LRFE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
