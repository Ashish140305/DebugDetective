import React, { useState } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { saveGameConfig } from "../appwrite";

const AdminSetup = ({ onSetupComplete }) => {
  const [pcId, setPcId] = useState("");
  const [level1Answer, setLevel1Answer] = useState("");
  const [resumePin, setResumePin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Save to Appwrite Backend
      await saveGameConfig(pcId, level1Answer, resumePin);

      // 2. Save to LocalStorage (Persistence)
      localStorage.setItem("dd_pc_id", pcId);
      localStorage.setItem("dd_l1_ans", level1Answer);
      localStorage.setItem("dd_resume_pin", resumePin);
      localStorage.setItem("dd_game_configured", "true");

      // 3. Start Game
      onSetupComplete();
    } catch (err) {
      console.error(err);
      setError("Connection failed. Config saved locally only.");

      // Fallback: Save locally even if backend fails
      localStorage.setItem("dd_pc_id", pcId);
      localStorage.setItem("dd_l1_ans", level1Answer);
      localStorage.setItem("dd_resume_pin", resumePin);
      localStorage.setItem("dd_game_configured", "true");
      setTimeout(onSetupComplete, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-3 rounded-full text-white">
            <Settings size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Terminal Setup
        </h1>

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              PC Identifier
            </label>
            <input
              type="text"
              value={pcId}
              onChange={(e) => setPcId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. PC-01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Level 1 Answer (Physical Clue)
            </label>
            <input
              type="text"
              value={level1Answer}
              onChange={(e) => setLevel1Answer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. HIDDENCODE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Resume PIN (Unlock Screen)
            </label>
            <input
              type="text"
              value={resumePin}
              onChange={(e) => setResumePin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. 1234"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Needed if student refreshes the page.
            </p>
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
