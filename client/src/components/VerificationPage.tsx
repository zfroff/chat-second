import React, { useEffect, useState } from "react";
import { completeEmailVerification, isEmailVerificationLink, sendPhoneVerification, sendEmailVerification } from "../services/auth";

interface VerificationPageProps {
  authMethod: string;
  authValue: string;
  onVerifySuccess: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  authMethod,
  authValue,
  onVerifySuccess,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (authMethod === "email" && window.location.href) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email && isEmailVerificationLink(window.location.href)) {
        completeEmailVerification(email, window.location.href)
          .then(() => {
            window.localStorage.removeItem("emailForSignIn");
            onVerifySuccess();
          })
          .catch(() => setError("Email verification failed. Try again."));
      }
    }
  }, [authMethod]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [resendTimer]);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (authMethod === "phone") {
      try {
        const confirmationResult = JSON.parse(sessionStorage.getItem("confirmationResult") || "");
        await confirmationResult.confirm(verificationCode);
        onVerifySuccess();
      } catch {
        setError("Invalid code. Try again.");
      }
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      if (authMethod === "phone") {
        const result = await sendPhoneVerification(authValue);
        sessionStorage.setItem("confirmationResult", JSON.stringify(result));
      } else {
        await sendEmailVerification(authValue);
      }
      setResendTimer(60);
    } catch {
      setError("Failed to resend verification.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
      <div className="fixed -top-[20%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-orange-600 via-rose-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-spin-slow pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-gradient-to-tr from-purple-600 via-rose-500 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="z-10 max-w-md w-full bg-zinc-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-orange-500/20 space-y-6">
        <h2 className="text-3xl font-bold text-center text-white">Verify Your {authMethod}</h2>
        <p className="text-gray-400 text-center">{authValue}</p>

        {authMethod === "email" ? (
          <div className="text-center text-sm text-gray-300">
            Check your inbox and click the link to complete verification.
            <br />
            <button
              disabled={resendTimer > 0 || isResending}
              onClick={handleResend}
              className="text-orange-400 mt-4 hover:text-orange-300 disabled:text-gray-500"
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend link in ${resendTimer}s`
                : "Resend verification link"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-orange-500 text-lg text-center tracking-widest"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition duration-300"
              disabled={verificationCode.length !== 6}
            >
              Verify
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className="w-full text-orange-400 hover:text-orange-300 text-sm disabled:text-gray-500"
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </button>
            {error && <div className="text-rose-500 text-sm text-center">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};
