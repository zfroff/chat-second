// App.tsx
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatPage } from "./components/ChatPage";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { ProfilePage } from "./components/ProfilePage";
import { VerificationPage } from "./components/VerificationPage";

function App() {
  const [page, setPage] = useState<"landing" | "auth" | "verify" | "profile" | "main">("landing");
  const [authMethod, setAuthMethod] = useState<string>("");
  const [authValue, setAuthValue] = useState<string>("");

  const handleAuthSuccess = (method: string, value: string) => {
    setAuthMethod(method);
    setAuthValue(value);
    setPage("verify");
  };

  const handleVerifySuccess = () => {
    setPage("profile");
  };

  const handleProfileComplete = () => {
    setPage("main");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        aria-label={"Notifications"}
      />

      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "auth" && <AuthPage onAuthSuccess={handleAuthSuccess} setPage={setPage} />}
      {page === "verify" && (
        <VerificationPage
          authMethod={authMethod}
          authValue={authValue}
          onVerifySuccess={handleVerifySuccess}
        />
      )}
      {page === "profile" && <ProfilePage setPage={handleProfileComplete} />}
      {page === "main" && <ChatPage />}
    </>
  );
}

export default App;
