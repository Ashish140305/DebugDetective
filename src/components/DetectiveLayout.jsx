import React, { useState } from "react";
import {
  Terminal,
  Zap,
  Settings,
  Sun,
  Moon,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { account } from "../appwrite";

const DetectiveLayout = ({ children, title, timer, penalty, onAdminReset }) => {
  const { theme, toggleTheme } = useTheme();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleResetClick = () => {
    setShowResetModal(true);
    setResetPassword("");
    setResetError(false);
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setResetError(false);
    setVerifying(true);

    // 1. Check Local Storage (Fastest)
    const savedPassword = localStorage.getItem("dd_admin_auth_proof");

    if (savedPassword && resetPassword === savedPassword) {
      // Success Local
      if (onAdminReset) onAdminReset();
      setShowResetModal(false);
      setVerifying(false);
      return;
    }

    // 2. Fallback: Check against Appwrite (If local storage was cleared)
    // We use the email stored during login to verify the password
    const savedEmail = localStorage.getItem("dd_admin_email");
    if (savedEmail) {
      try {
        // Note: This creates a NEW session just to test the password.
        // If it succeeds, the password is valid.
        await account.createEmailPasswordSession(savedEmail, resetPassword);

        // Update local proof for next time so it's faster
        localStorage.setItem("dd_admin_auth_proof", resetPassword);

        if (onAdminReset) onAdminReset();
        setShowResetModal(false);
      } catch (err) {
        console.error("Backend Verification Failed:", err);
        // If we fail here, the password is genuinely wrong OR
        // the session limit is hit (unlikely for <10 devices).
        setResetError(true);
      }
    } else {
      setResetError(true);
    }
    setVerifying(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-slate-700 animate-fade-in">
            <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Lock size={40} />
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Setup New Game
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
              Enter Admin Password to confirm.
            </p>

            <form onSubmit={confirmReset} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Admin Password"
                  className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {resetError && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold justify-center">
                  <AlertCircle size={16} /> Incorrect Password
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium transition-colors"
                  disabled={verifying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                  disabled={verifying}
                >
                  {verifying ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-800 dark:text-white">
              Debug Detective
            </span>
          </div>

          <div className="flex items-center gap-4">
            {penalty > 0 && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold animate-bounce bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                <Zap size={16} /> -{penalty}s
              </div>
            )}

            {timer && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-md border border-gray-200 dark:border-slate-600 transition-colors">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Time
                </span>
                <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                  {timer}
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {onAdminReset && (
              <button
                onClick={handleResetClick}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-all"
                title="Setup New Game"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {title}
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DetectiveLayout;
