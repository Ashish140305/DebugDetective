import React, { useState } from "react";
import { Lock } from "lucide-react";

const ResumeModal = ({ onResume }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPin = localStorage.getItem("dd_resume_pin");
    if (pin === correctPin) {
      onResume();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-arcade-bg/95 flex items-center justify-center p-4">
      <div className="bg-arcade-card p-8 rounded-2xl border-4 border-gray-700 shadow-2xl max-w-sm w-full text-center">
        <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-gray-300" />
        </div>

        <h2 className="text-3xl font-game font-bold text-white mb-2">
          Game Paused
        </h2>
        <p className="text-gray-400 mb-8">Enter Admin PIN to Resume</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="input-game text-center text-2xl tracking-widest mb-4"
            autoFocus
            placeholder="••••"
          />
          {error && (
            <p className="text-red-500 font-bold mb-4 animate-bounce">
              Incorrect PIN
            </p>
          )}

          <button className="btn-game w-full bg-gray-600 shadow-[0_6px_0_#374151]">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeModal;
