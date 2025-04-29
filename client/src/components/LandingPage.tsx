import React from "react";

interface LandingPageProps {
  setPage: (page: "auth") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
      {/* Animated background blobs */}
      <div className="fixed -top-[20%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-orange-600 via-rose-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-spin-slow pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-gradient-to-tr from-purple-600 via-rose-500 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-300 to-purple-400 drop-shadow-lg mb-8 animate-slide-down">
          Welcome to chatME
        </h1>

        <div className="flex gap-6">
          <button
            onClick={() => setPage("auth")}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
          <button
            onClick={() => setPage("auth")}
            className="px-8 py-4 bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
