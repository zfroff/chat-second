import { initializeApp } from "firebase/app";

const firebaseConfig = {
   apiKey: "AIzaSyB2t3NeFPhPPUPSrdzgip2vTyI2TlWnxUs",
   authDomain: "chatme-webapp.firebaseapp.com",
   projectId: "chatme-webapp",
   storageBucket: "chatme-webapp.firebasestorage.app",
   messagingSenderId: "155239735514",
   appId: "1:155239735514:web:7ee847e5e409db2d69c5e3",
   measurementId: "G-D8769X2RNF"
 };

export const firebaseApp = initializeApp(firebaseConfig);
