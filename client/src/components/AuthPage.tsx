import React, { useState } from "react";
import { sendPhoneVerification, sendEmailVerification, signInWithGoogle } from "../services/auth";

interface AuthPageProps {
  onAuthSuccess: (method: string, value: string) => void;
  setPage: (page: "auth" | "verify" | "profile" | "main" | "landing") => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    let formatted = input;
    if (input.length > 2) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    }
    if (input.length > 5) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 5)}-${input.slice(5)}`;
    }
    if (input.length > 7) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 5)}-${input.slice(5, 7)}-${input.slice(7)}`;
    }
    setValue(formatted);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "phone") {
        const phoneNumber = `+998${value.replace(/\D/g, "")}`;
        const confirmationResult = await sendPhoneVerification(phoneNumber);
        sessionStorage.setItem("confirmationResult", JSON.stringify(confirmationResult));
        onAuthSuccess("phone", phoneNumber);
      } else {
        await sendEmailVerification(value);
        onAuthSuccess("email", value);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Authentication failed. Try again.");
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) onAuthSuccess("google", user.email || "");
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
      <div className="fixed -top-[20%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-orange-600 via-rose-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-spin-slow pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-gradient-to-tr from-purple-600 via-rose-500 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="z-10 max-w-md w-full bg-zinc-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-orange-500/20 space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
          Sign in or create an account
        </h1>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("phone")}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
              mode === "phone"
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white scale-105 shadow-lg"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            Phone
          </button>
          <button
            onClick={() => setMode("email")}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
              mode === "email"
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white scale-105 shadow-lg"
                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-rose-400 text-sm">{error}</div>}
          {mode === "phone" ? (
            <input
              type="tel"
              placeholder="(90) 123-45-67"
              value={value}
              onChange={handlePhoneInput}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-orange-500 text-lg"
              required
            />
          ) : (
            <input
              type="email"
              placeholder="Email address"
              value={value}
              onChange={handleEmailInput}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-orange-500 text-lg"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition duration-300"
          >
            Continue
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">or continue with</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            className="flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            onClick={() => alert("Facebook sign-in not yet implemented")}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-500 transition"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            Continue with Facebook
          </button>
          <button
            onClick={() => alert("Microsoft sign-in not yet implemented")}
            className="flex items-center justify-center gap-3 bg-gray-800 text-white font-semibold py-3 rounded-xl hover:bg-gray-700 transition"
          >
            <img src="/icons/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
            Continue with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
};
