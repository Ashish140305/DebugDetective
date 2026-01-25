import React, { useState } from "react";
import { Save } from "lucide-react";
import { saveGameConfig } from "../appwrite";

const AdminSetup = ({ onSetupComplete }) => {
  const [pcId, setPcId] = useState("");
  const [level1Answer, setLevel1Answer] = useState("");
  const [resumePin, setResumePin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Save locally first for instant feedback
    localStorage.setItem("dd_pc_id", pcId);
    localStorage.setItem("dd_l1_ans", level1Answer);
    localStorage.setItem("dd_resume_pin", resumePin);
    localStorage.setItem("dd_game_configured", "true");

    try {
      await saveGameConfig(pcId, level1Answer, resumePin);
    } catch (err) {
      console.log("Offline mode: Config saved locally");
    }

    onSetupComplete();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="game-card p-8 w-full max-w-md">
        <h2 className="text-2xl font-game font-bold text-white mb-6 text-center">
          Game Configuration
        </h2>
        <form onSubmit={handleSetup} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-400 ml-1 uppercase">
              PC Identity
            </label>
            <input
              type="text"
              value={pcId}
              onChange={(e) => setPcId(e.target.value)}
              className="input-game mt-1"
              placeholder="e.g. LAB-01"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 ml-1 uppercase">
              Key Code (Lvl 1)
            </label>
            <input
              type="text"
              value={level1Answer}
              onChange={(e) => setLevel1Answer(e.target.value)}
              className="input-game mt-1"
              placeholder="Secret Code"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 ml-1 uppercase">
              Unlock PIN
            </label>
            <input
              type="text"
              value={resumePin}
              onChange={(e) => setResumePin(e.target.value)}
              className="input-game mt-1"
              placeholder="1234"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-game w-full flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} /> Start Game Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
