declare global {
   interface Window {
     recaptchaVerifier: any;
   }
 } 

import { getAuth, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "@firebase/auth";
import { firebaseApp } from "/Users/shayk/Desktop/chatME/client/config/firebase"; // you must setup your Firebase separately

const auth = getAuth(firebaseApp);

export const sendPhoneVerification = async (phoneNumber: string) => {
  const appVerifier = window.recaptchaVerifier; // you must initialize reCAPTCHA before calling
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};





export const sendEmailVerification = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.href, // send back to the same app
    handleCodeInApp: true,
  };
  window.localStorage.setItem("emailForSignIn", email);
  return await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const isEmailVerificationLink = (url: string) => {
  return isSignInWithEmailLink(auth, url);
};

export const completeEmailVerification = async (email: string, url: string) => {
  return await signInWithEmailLink(auth, email, url);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
