import React, { useState, useEffect } from "react";
import { FolderLock, ArrowRight, User, Lightbulb } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level1 = ({ onUnlock, onUserLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // --- INTEGRATED CODE: LOGIN STATE & CHALLENGE DATA ---
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caseData, setCaseData] = useState(null);

  // Initialize a random case from the password pool
  useEffect(() => {
    if (CONFIG.passwordPool) {
      const randomCase = CONFIG.passwordPool[Math.floor(Math.random() * CONFIG.passwordPool.length)];
      setCaseData({
        ...randomCase,
        shuffledHints: [...randomCase.hints].sort(() => Math.random() - 0.5)
      });
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onUserLogin(username);
      setIsLoggedIn(true);
    }
  };
  // -----------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check against the dynamic password from the pool
    const isCorrect = caseData 
      ? pin.toUpperCase() === caseData.password.toUpperCase() 
      : pin === CONFIG.unlockPin;

    if (isCorrect) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPin("");
    }
  };

  // --- PHASE 0: INITIALIZE SESSION ---
  if (!isLoggedIn) {
    return (
      <DetectiveLayout title="Initialize Session">
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-4 bg-slate-900/50 p-4 rounded text-left">
            <User className="text-amber-500 shrink-0" size={24} />
            <p className="text-slate-300">Enter Agent Username to begin the evaluation session and decrypt the local terminal.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Agent Name / ID"
              className="w-full bg-slate-100 text-slate-900 text-lg px-4 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/30 font-bold"
              autoFocus
            />
            <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all shadow-lg">
              Initialize Session
            </button>
          </form>
        </div>
      </DetectiveLayout>
    );
  }

  // --- PHASE 1: ACCESS CONTROL / PASSWORD DISCOVERY ---
  return (
    <DetectiveLayout title="Case #001: Access Control">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className={`p-8 rounded-full bg-slate-700/50 ${error ? "animate-shake text-red-400" : "text-amber-500"}`}>
            <FolderLock size={64} />
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6 text-left">
          <div>
            <h3 className="text-xl font-semibold text-white">Password Discovery Challenge</h3>
            <p className="text-slate-400 mt-1">Welcome, Agent <strong>{username}</strong>. Deduce the password using the decrypted hints below.</p>
          </div>

          {/* Intelligence Hints from the Pool */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-3">
            <h4 className="text-amber-500 text-xs font-bold uppercase flex items-center gap-2">
              <Lightbulb size={14} /> Intelligence Hints
            </h4>
            <ul className="space-y-2">
              {caseData?.shuffledHints.map((hint, i) => (
                <li key={i} className="text-slate-300 text-sm italic">"{hint}"</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Deducted Password"
              className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 text-lg px-4 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/30 font-bold tracking-widest transition-all"
              autoFocus
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-md transition-colors flex items-center">
              <ArrowRight size={20} />
            </button>
          </form>

          {error && <p className="text-red-400 text-sm font-medium">Authentication Failed. Re-analyze hints.</p>}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;