import React, { useState } from "react";
import { FolderLock, ArrowRight } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";
import { CONFIG } from "../gameConfig";

const Level1 = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === CONFIG.unlockPin) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPin("");
    }
  };

  return (
    <DetectiveLayout title="Case #001: Access Control">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visual Element */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div
            className={`p-8 rounded-full bg-slate-700/50 ${
              error ? "animate-shake text-red-400" : "text-amber-500"
            }`}
          >
            <FolderLock size={64} />
          </div>
        </div>

        {/* Form Element */}
        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Identify Workstation
            </h3>
            <p className="text-slate-400 mt-1">
              Locate the correct terminal ID to proceed. The access code was
              provided in your physical briefing.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium uppercase">
              Terminal ID
            </span>
            <span className="text-xl font-mono font-bold text-white">
              {CONFIG.pcId}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Access PIN"
              className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 text-lg px-4 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-500/30 font-bold tracking-widest transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-md transition-colors flex items-center"
            >
              <ArrowRight size={20} />
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-sm font-medium">
              Authentication Failed. Check physical evidence.
            </p>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;
