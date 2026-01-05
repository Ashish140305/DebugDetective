import React, { useState, useEffect } from "react";
import { FolderLock, ArrowRight, User, Lightbulb } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level1 = ({ onUnlock, onUserLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    if (CONFIG.passwordPool) {
      const randomCase =
        CONFIG.passwordPool[
          Math.floor(Math.random() * CONFIG.passwordPool.length)
        ];
      setCaseData({
        ...randomCase,
        shuffledHints: [...randomCase.hints].sort(() => Math.random() - 0.5),
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

  const handleSubmit = (e) => {
    e.preventDefault();
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

  if (!isLoggedIn) {
    return (
      <DetectiveLayout title="Welcome">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="bg-blue-50 p-4 rounded-full inline-block">
            <User className="text-blue-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold">Please Identify Yourself</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Start Session
            </button>
          </form>
        </div>
      </DetectiveLayout>
    );
  }

  return (
    <DetectiveLayout title="Level 1: Password Challenge">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex items-start justify-center pt-4">
          <FolderLock
            size={80}
            className={`${error ? "text-red-500" : "text-gray-400"}`}
          />
        </div>

        <div className="md:w-2/3 space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
              <Lightbulb size={18} /> Hints
            </div>
            <ul className="list-disc list-inside space-y-1 text-blue-900">
              {caseData?.shuffledHints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Password"
              className={`w-full border-2 rounded-lg px-4 py-3 text-lg font-bold outline-none transition-all ${
                error
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </form>

          {error && (
            <p className="text-red-500 font-medium">
              Incorrect password. Try again.
            </p>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;
