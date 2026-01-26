import React, { useState, useEffect } from "react";
import { Lock, Unlock, ArrowRight } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { updateTeamProgress } from "../appwrite";

const Level1 = ({ onUnlock, onAdminReset, pcId }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [targetPassword, setTargetPassword] = useState("");

  useEffect(() => {
    const storedPass = localStorage.getItem("dd_level1_target");
    if (storedPass) setTargetPassword(storedPass);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetPassword) return;

    if (password.trim() === targetPassword) {
      const docId = localStorage.getItem("dd_doc_id");
      if (docId) updateTeamProgress(docId, 2, 0);
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setPassword("");
    }
  };

  return (
    <DetectiveLayout
      title="Security Breach: Level 1"
      timer="∞"
      onAdminReset={onAdminReset}
      pcId={pcId}
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] max-w-2xl mx-auto">
        <div className="bg-arcade-card p-8 rounded-2xl border border-gray-700 w-full text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-arcade-primary to-transparent opacity-50"></div>
          <div className="mb-8 flex justify-center">
            <div
              className={`p-6 rounded-full transition-all duration-300 ${error ? "bg-red-900/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "bg-blue-900/30 text-arcade-primary shadow-[0_0_20px_rgba(76,201,240,0.3)]"}`}
            >
              {error ? <Lock size={64} /> : <Unlock size={64} />}
            </div>
          </div>
          <h2 className="text-3xl font-game text-white mb-4 tracking-wider">
            System Locked
          </h2>
          <p className="text-gray-400 font-mono text-sm mb-10 leading-relaxed">
            Enter the authorization code provided by your handler to initiate
            the override protocol.
          </p>
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-black/50 border-2 rounded-xl px-6 py-4 text-center text-xl font-mono text-white tracking-[0.2em] focus:outline-none transition-all placeholder:tracking-normal placeholder:text-gray-600 ${error ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-shake" : "border-arcade-secondary focus:border-arcade-primary focus:shadow-[0_0_15px_rgba(76,201,240,0.3)]"}`}
              placeholder="ENTER PASSCODE"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 aspect-square bg-arcade-primary text-black rounded-lg flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
            >
              <ArrowRight size={24} />
            </button>
          </form>
          {error && (
            <p className="mt-6 text-red-400 font-bold text-sm tracking-widest uppercase animate-pulse">
              Access Denied: Invalid Credentials
            </p>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;
