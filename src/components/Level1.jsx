import React, { useState } from "react";
import { FolderLock, ArrowRight, MapPin } from "lucide-react";
import DetectiveLayout from "./DetectiveLayout";

const Level1 = ({ onUnlock, onAdminReset }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Read Config from LocalStorage
  const PC_ID = localStorage.getItem("dd_pc_id") || "PC-??";
  const CORRECT_PASSWORD = localStorage.getItem("dd_l1_ans") || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim().toUpperCase() === CORRECT_PASSWORD.toUpperCase()) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPin("");
    }
  };

  return (
    <DetectiveLayout
      title="Level 1: Node Identification"
      onAdminReset={onAdminReset}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Icon Section */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div
            className={`p-8 rounded-full bg-blue-50 transition-colors duration-300 ${
              error ? "text-red-500 bg-red-50" : "text-blue-600"
            }`}
          >
            <FolderLock size={80} />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-2 text-lg">
              <MapPin size={24} />
              <span>Objective: {PC_ID}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The digital access key is missing. A physical clue has been hidden
              on campus for this specific terminal.
              <strong>Find the clue for {PC_ID}</strong> and enter the code
              below to proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-4">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="ENTER FOUND CODE"
              className={`w-full border-2 rounded-lg px-6 py-4 text-xl font-bold outline-none transition-all uppercase tracking-widest ${
                error
                  ? "border-red-300 bg-red-50 text-red-700 placeholder:text-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ArrowRight size={24} />
            </button>
          </form>

          {error && (
            <p className="text-red-500 font-medium text-center animate-pulse">
              Incorrect Code. Keep searching.
            </p>
          )}
        </div>
      </div>
    </DetectiveLayout>
  );
};

export default Level1;
