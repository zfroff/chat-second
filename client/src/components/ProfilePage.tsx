import React, { useRef, useState } from "react";
import { updateUserProfile } from "../services/profile";

interface ProfilePageProps {
  setPage: (page: "main") => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setPage }) => {
  const [displayName, setDisplayName] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter a display name");
      return;
    }
    if (!nickname.trim() || !/^[a-z0-9._]+$/.test(nickname)) {
      setError("Nickname must contain only lowercase letters, numbers, underscores or dots");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Save profile (you can later hook this to Firebase)
      await updateUserProfile(displayName.trim(), nickname.trim(), photoFile || undefined);
      localStorage.setItem("nickname", nickname.trim()); // for socket room
      setPage("main");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
      <div className="fixed -top-[20%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-orange-600 via-rose-500 to-purple-600 opacity-30 rounded-full blur-3xl animate-spin-slow pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-gradient-to-tr from-purple-600 via-rose-500 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="z-10 max-w-md w-full bg-zinc-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-orange-500/20 space-y-6">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400">
          Set Up Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div
              className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-700 hover:border-orange-400 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-gray-400">
                  Upload
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-orange-500 text-lg"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Unique Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.toLowerCase())}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-orange-500 text-lg"
              placeholder="johndoe123"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Lowercase letters, numbers, underscores (_) and periods (.) only.
            </p>
          </div>

          {error && <div className="text-rose-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition duration-300"
          >
            {isLoading ? "Saving..." : "Continue to Chat"}
          </button>
        </form>
      </div>
    </div>
  );
};
