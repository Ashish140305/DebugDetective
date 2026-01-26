import React, { useEffect, useState } from "react";
import { Lock, AlertTriangle, Loader2, Monitor } from "lucide-react";
import { subscribeToTeamStatus, getGameConfig } from "../appwrite";

const ResumeModal = ({ onResume }) => {
  const [pcId, setPcId] = useState("Unknown PC");

  useEffect(() => {
    const storedPcId = localStorage.getItem("dd_pc_id");
    if (storedPcId) setPcId(storedPcId);

    const docId = localStorage.getItem("dd_doc_id");
    if (!docId) return;

    const checkStatus = async () => {
      const conf = await getGameConfig(storedPcId);
      if (conf && conf.is_locked === false) {
        onResume();
      }
    };
    checkStatus();

    const unsubscribe = subscribeToTeamStatus(docId, (payload) => {
      if (payload.is_locked === false) {
        onResume();
      }
    });

    return () => unsubscribe();
  }, [onResume]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="game-card p-8 max-w-md w-full border-red-600 bg-red-950/20 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse-slow">
        <div className="absolute top-4 right-4 bg-black/50 border border-red-500/50 px-3 py-1 rounded text-xs font-mono text-red-400 flex items-center gap-2">
          <Monitor size={12} /> ID: {pcId}
        </div>
        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-red-900/50 p-6 rounded-full border-2 border-red-500 animate-bounce">
            <Lock size={48} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-game font-bold text-center text-white mb-4 tracking-widest">
          SYSTEM LOCKED
        </h2>
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0" size={24} />
          <p className="text-red-200 text-sm font-mono leading-relaxed">
            Suspicious activity detected (Tab Switch / Focus Loss). <br />
            <br />
            <strong>Your session has been frozen.</strong>
          </p>
        </div>
        <div className="text-center space-y-4">
          <p className="text-gray-400 font-mono text-sm">
            Admin: Unlock <strong>{pcId}</strong> from Master Control.
          </p>
          <div className="flex items-center justify-center gap-2 text-arcade-primary text-xs font-bold uppercase tracking-widest">
            <Loader2 className="animate-spin" size={14} /> Waiting for
            Override...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
