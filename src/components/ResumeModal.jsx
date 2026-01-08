import React, { useState } from "react";
import { ShieldAlert, Lock } from "lucide-react";

const ResumeModal = ({ onResume }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Retrieve the admin pin set during setup
    const correctPin = localStorage.getItem("dd_resume_pin");

    if (pin === correctPin) {
      onResume();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border-2 border-red-500">
        <ShieldAlert
          size={64}
          className="mx-auto text-red-500 mb-4 animate-pulse"
        />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SESSION LOCKED
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          A refresh or tab switch was detected.
          <br />
          <strong>Call an Organizer to unlock this terminal.</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter Admin PIN"
            className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white uppercase"
            autoFocus
          />

          {error && <p className="text-red-500 font-bold">ACCESS DENIED</p>}

          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-colors">
            UNLOCK SYSTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeModal;
