import React, { useState } from "react";
import { Settings, Save, Loader2, Sun, Moon } from "lucide-react";
import { saveGameConfig } from "../appwrite";
import { useTheme } from "../context/ThemeContext";

const AdminSetup = ({ onSetupComplete }) => {
  const [pcId, setPcId] = useState("");
  const [level1Answer, setLevel1Answer] = useState("");
  const [resumePin, setResumePin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveGameConfig(pcId, level1Answer, resumePin);

      localStorage.setItem("dd_pc_id", pcId);
      localStorage.setItem("dd_l1_ans", level1Answer);
      localStorage.setItem("dd_resume_pin", resumePin);
      localStorage.setItem("dd_game_configured", "true");

      onSetupComplete();
    } catch (err) {
      console.error(err);
      setError("Connection failed. Config saved locally only.");
      localStorage.setItem("dd_pc_id", pcId);
      localStorage.setItem("dd_l1_ans", level1Answer);
      localStorage.setItem("dd_resume_pin", resumePin);
      localStorage.setItem("dd_game_configured", "true");
      setTimeout(onSetupComplete, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-3 rounded-full text-white">
            <Settings size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Terminal Setup
        </h1>

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              PC Identifier
            </label>
            <input
              type="text"
              value={pcId}
              onChange={(e) => setPcId(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. PC-01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Level 1 Answer (Physical Clue)
            </label>
            <input
              type="text"
              value={level1Answer}
              onChange={(e) => setLevel1Answer(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. HIDDENCODE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Resume PIN (Unlock Screen)
            </label>
            <input
              type="text"
              value={resumePin}
              onChange={(e) => setResumePin(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. 1234"
              required
            />
          </div>

          {error && (
            <div className="text-orange-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save & Launch Game"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
