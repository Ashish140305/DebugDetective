import React, { useState, useEffect } from "react";
import { KeyRound, ArrowRight, Map } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";

const Level1 = ({ onUnlock, onAdminReset }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const PC_ID = localStorage.getItem("dd_pc_id") || "PLAYER_1";
  const CORRECT_PASSWORD = localStorage.getItem("dd_l1_ans") || "";

  // RESTORED: Log the answer to the console for "debugging"
  useEffect(() => {
    console.log(
      `%c[DEBUG_LOG] Level 1 Access Key: ${CORRECT_PASSWORD}`,
      "color: #e94560; font-weight: bold; font-size: 14px;",
    );
  }, [CORRECT_PASSWORD]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim().toUpperCase() === CORRECT_PASSWORD.toUpperCase()) {
      onUnlock();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <DetectiveLayout title="Start Game" onAdminReset={onAdminReset}>
      <div className="flex flex-col items-center justify-center h-full gap-8 py-8">
        <div className="relative">
          <div
            className={`w-32 h-32 bg-arcade-secondary rounded-full flex items-center justify-center border-4 border-dashed border-gray-500 ${error ? "animate-shake bg-red-900/50 border-red-500" : "animate-float"}`}
          >
            <KeyRound
              size={64}
              className={error ? "text-red-400" : "text-arcade-accent"}
            />
          </div>
          {error && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white font-bold px-4 py-1 rounded-lg whitespace-nowrap animate-bounce">
              Wrong Key!
            </div>
          )}
        </div>

        <div className="text-center space-y-2 max-w-lg">
          <h2 className="text-3xl font-game font-bold text-white">
            Welcome, <span className="text-arcade-success">{PC_ID}</span>
          </h2>
          <p className="text-gray-400 font-body text-lg">
            To begin your quest, find the{" "}
            <span className="text-arcade-accent font-bold">Hidden Key</span>{" "}
            located physically near this station.
          </p>
          <p className="text-xs text-gray-600 font-mono mt-2 animate-pulse">
            (Psst... check the developer console)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md relative">
          <div className="relative group">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="ENTER KEY CODE"
              className="input-game text-center text-2xl tracking-[0.2em] font-game uppercase pr-14"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-arcade-primary text-white rounded-lg px-4 hover:bg-opacity-90 transition-all shadow-md active:translate-y-0.5 active:shadow-none"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-widest mt-4">
          <Map size={16} /> Location: Physical Lab Environment
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;
