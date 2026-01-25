import React, { useState } from "react";
import {
  Gamepad2,
  Settings,
  Timer,
  ShieldAlert,
  Lock,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { account } from "../appwrite";

const DetectiveLayout = ({ children, title, timer, penalty, onAdminReset }) => {
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

    const savedPassword = localStorage.getItem("dd_admin_auth_proof");
    if (savedPassword && resetPassword === savedPassword) {
      if (onAdminReset) onAdminReset();
      setShowResetModal(false);
      return;
    }

    // Fallback to appwrite check if local proof fails
    const savedEmail = localStorage.getItem("dd_admin_email");
    if (savedEmail) {
      try {
        await account.createEmailPasswordSession(savedEmail, resetPassword);
        if (onAdminReset) onAdminReset();
        setShowResetModal(false);
      } catch (err) {
        setResetError(true);
      }
    } else {
      setResetError(true);
    }
    setVerifying(false);
  };

  return (
    <div className="flex flex-col h-full min-h-[90vh]">
      {/* RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="game-card p-6 w-full max-w-sm animate-float">
            <div className="flex justify-center mb-4 text-arcade-accent">
              <Lock size={48} />
            </div>

            <h3 className="text-2xl font-game font-bold text-center text-white mb-2">
              Admin Zone
            </h3>

            <form onSubmit={confirmReset} className="space-y-4">
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Secret Passcode"
                className="input-game text-center text-lg"
                autoFocus
              />

              {resetError && (
                <div className="bg-red-500/20 text-red-400 p-2 rounded text-center text-sm font-bold border border-red-500/50">
                  Access Denied
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="btn-game-secondary text-sm py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-game text-sm py-2 flex items-center justify-center"
                  disabled={verifying}
                >
                  {verifying ? <Loader2 className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOP HUD */}
      <nav className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-arcade-card p-4 rounded-2xl shadow-lg border-2 border-arcade-secondary">
        <div className="flex items-center gap-4">
          <div className="bg-arcade-primary p-3 rounded-xl shadow-game-btn">
            <Gamepad2 className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-game font-bold text-2xl text-white leading-none tracking-wide">
              DEBUG <span className="text-arcade-primary">QUEST</span>
            </h1>
            <p className="text-xs text-gray-400 font-bold tracking-wider">
              LEVEL: {title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {penalty > 0 && (
            <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-lg border border-red-500 font-bold animate-pulse">
              <ShieldAlert size={16} /> -{penalty}s HP
            </div>
          )}

          {timer && (
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-arcade-secondary">
              <Timer className="text-arcade-accent" size={20} />
              <span className="font-mono text-xl font-bold text-white tabular-nums">
                {timer}
              </span>
            </div>
          )}

          {onAdminReset && (
            <button
              onClick={handleResetClick}
              className="p-2 bg-arcade-secondary rounded-lg hover:bg-opacity-80 transition-all text-gray-300"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </nav>

      {/* MAIN GAME BOARD */}
      <main className="grow game-card p-6 md:p-10 relative">
        {/* Decorative corner bolts */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gray-600 shadow-inner"></div>
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gray-600 shadow-inner"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-gray-600 shadow-inner"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gray-600 shadow-inner"></div>

        {children}
      </main>
    </div>
  );
};

export default DetectiveLayout;
