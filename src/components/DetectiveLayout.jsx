import React from "react";
import { Clock, AlertOctagon, Monitor, RotateCcw } from "lucide-react";
import { requestGameReset } from "../appwrite";

const DetectiveLayout = ({
  children,
  title,
  timer,
  penalty,
  onAdminReset,
  pcId,
}) => {
  const handleNewGameRequest = async () => {
    if (
      window.confirm(
        "REQUEST NEW GAME?\n\nThis will send a request to the Admin. The game will restart only after approval.",
      )
    ) {
      const docId = localStorage.getItem("dd_doc_id");

      if (docId) {
        try {
          await requestGameReset(docId);
          // Success!
          localStorage.setItem("dd_reset_pending", "true");
          window.location.reload();
        } catch (error) {
          console.error(error);
          alert(
            `Failed to send request. \nCheck Database Permissions for 'reset_requested'.\n\nError: ${error.message}`,
          );
        }
      } else {
        alert(
          "Error: Game session ID not found. Please ask Admin to re-assign this PC.",
        );
      }
    }
  };

  return (
    <div className="w-full min-h-[90vh] md:min-h-[95vh] bg-arcade-card border-2 border-arcade-secondary rounded-3xl relative overflow-hidden shadow-2xl flex flex-col">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%]"></div>

      {/* Header */}
      <div className="bg-black/40 border-b border-arcade-secondary p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-game font-bold text-white text-shadow-neon">
            {title}
          </h1>
          {pcId && (
            <div className="bg-arcade-secondary/30 border border-arcade-primary/30 px-3 py-1 rounded-full text-sm font-mono text-arcade-primary flex items-center gap-2">
              <Monitor size={16} /> {pcId}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {penalty > 0 && (
            <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse text-lg">
              <AlertOctagon size={24} /> -{penalty}s
            </div>
          )}

          <div className="flex items-center gap-3 bg-black/50 px-6 py-3 rounded-xl border border-arcade-secondary shadow-[0_0_10px_rgba(76,201,240,0.2)]">
            <Clock
              className={`text-arcade-primary ${timer !== "∞" ? "animate-pulse-slow" : ""}`}
              size={28}
            />
            <span className="font-mono text-3xl font-bold text-white tracking-widest">
              {timer}
            </span>
          </div>

          <button
            onClick={handleNewGameRequest}
            className="flex items-center gap-2 bg-blue-900/80 hover:bg-blue-700 text-white border border-blue-500 font-game px-4 py-3 rounded-xl transition-all shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            title="Request New Game"
          >
            <RotateCcw size={20} />
            <span className="hidden md:inline">RESET</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-10 overflow-y-auto relative z-30 custom-scrollbar flex flex-col">
        {children}
      </div>

      <div className="p-2 flex justify-end opacity-20 hover:opacity-100 transition-opacity z-30 absolute bottom-0 right-0">
        <button
          onClick={onAdminReset}
          className="text-[10px] text-red-500 uppercase font-bold cursor-pointer px-2 py-1"
        >
          [ System Reset ]
        </button>
      </div>
    </div>
  );
};

export default DetectiveLayout;
