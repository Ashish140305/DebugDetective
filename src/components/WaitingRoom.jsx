import React, { useEffect, useState } from "react";
import { Loader2, MonitorOff, Wifi, CheckCircle } from "lucide-react";
import { getGameConfig } from "../appwrite";

const WaitingRoom = ({ pcId, onActivated }) => {
  const [status, setStatus] = useState("SEARCHING");

  useEffect(() => {
    const checkActivation = async () => {
      try {
        const config = await getGameConfig(pcId);
        if (config && config.is_active) {
          setStatus("FOUND");
          localStorage.setItem("dd_game_configured", "true");
          localStorage.setItem("dd_pc_id", pcId);
          localStorage.setItem("dd_doc_id", config.$id);
          if (config.level1_password)
            localStorage.setItem("dd_level1_target", config.level1_password);

          setTimeout(() => onActivated(), 2000);
        }
      } catch (error) {
        console.error("Check failed", error);
      }
    };

    const interval = setInterval(checkActivation, 3000);
    checkActivation();
    return () => clearInterval(interval);
  }, [pcId, onActivated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div
        className={`game-card p-10 max-w-lg w-full flex flex-col items-center ${status === "FOUND" ? "border-green-500 bg-green-900/20" : "animate-pulse"}`}
      >
        {status === "FOUND" ? (
          <CheckCircle size={64} className="text-green-500 mb-4" />
        ) : (
          <MonitorOff size={64} className="text-gray-500 mb-4" />
        )}
        <h2 className="text-3xl font-game font-bold text-white mb-2">
          PC ID: {pcId}
        </h2>
        <p className="text-gray-400 font-mono">
          {status === "FOUND"
            ? "Configuration Received!"
            : "Waiting for Master Control..."}
        </p>
      </div>
    </div>
  );
};

export default WaitingRoom;
