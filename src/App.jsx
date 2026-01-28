import React, { useState, useEffect, useRef } from "react";
import AdminLogin from "./components/AdminLogin";
import CentralAdminDashboard from "./components/CentralAdminDashboard";
import WaitingRoom from "./components/WaitingRoom";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";
import ResumeModal from "./components/ResumeModal";
import { CONFIG } from "./gameConfig";
import {
  setTeamLockStatus,
  subscribeToSessionDeletion,
  subscribeToTeamStatus,
  getGameConfig,
} from "./appwrite";
import { Loader2 } from "lucide-react";

function App() {
  const [appState, setAppState] = useState("LOGIN");
  const [currentPcId, setCurrentPcId] = useState("");

  // FIX: Use a Ref to track intentional reloads vs accidental refreshes
  const isSafeExit = useRef(false);

  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("dd_level");
    return saved ? parseInt(saved) : 1;
  });

  // Initialize lock state from storage to catch refreshes immediately
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem("dd_trigger_lock_on_load") === "true";
  });

  const [timeLeft, setTimeLeft] = useState(1500);

  // Initialize isActive from storage so it persists across refreshes
  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem("dd_timer_active") === "true";
  });

  const [penaltySeconds, setPenaltySeconds] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

  const [isResetPending, setIsResetPending] = useState(() => {
    return localStorage.getItem("dd_reset_pending") === "true";
  });

  // Persist isActive state whenever it changes
  useEffect(() => {
    localStorage.setItem("dd_timer_active", isActive);
  }, [isActive]);

  // --- SAFEGUARD: Prevent accidental resets ---
  useEffect(() => {
    const checkResetStatus = async () => {
      if (isResetPending) {
        const pcId = localStorage.getItem("dd_pc_id");
        if (pcId) {
          const conf = await getGameConfig(pcId);
          // Only reset if Admin EXPLICITLY approved the reset request
          if (conf && conf.reset_requested === false) {
            performLocalReset();
          }
        }
      }
    };
    checkResetStatus();
  }, [isResetPending]);

  const performLocalReset = () => {
    isSafeExit.current = true; // Prevent lock on reload
    localStorage.removeItem("dd_reset_pending");
    localStorage.removeItem("dd_trigger_lock_on_load");
    localStorage.removeItem("dd_q_index");
    localStorage.removeItem("dd_l2_solved"); // Clear level 2 progress
    localStorage.removeItem("dd_timer_remaining");
    localStorage.removeItem("dd_timer_active"); // Clear timer active state
    localStorage.removeItem("dd_level");
    window.location.reload();
  };

  // --- LISTENERS ---
  useEffect(() => {
    const docId = localStorage.getItem("dd_doc_id");

    if ((appState === "GAME" || appState === "WAITING") && docId) {
      const unsubDelete = subscribeToSessionDeletion(docId, () => {
        alert(
          "⚠️ SESSION TERMINATED \n\nAdministrator has removed this game session.",
        );
        handleAdminReset();
      });

      const unsubUpdate = subscribeToTeamStatus(docId, (payload) => {
        // Strictly checks if we were waiting for a reset
        if (payload.reset_requested === false && isResetPending) {
          performLocalReset();
        }
      });

      return () => {
        unsubDelete();
        unsubUpdate();
      };
    }
  }, [appState, isResetPending, level]);

  // --- LOCK LOGIC ---
  useEffect(() => {
    const wasRefreshed =
      localStorage.getItem("dd_trigger_lock_on_load") === "true";
    const isPendingLocal = localStorage.getItem("dd_reset_pending") === "true";

    // Only set lock if not pending reset
    if (wasRefreshed && !isPendingLocal) {
      const docId = localStorage.getItem("dd_doc_id");
      if (docId) setTeamLockStatus(docId, true);
    }
    // Clear flag immediately so valid navigation doesn't lock
    localStorage.removeItem("dd_trigger_lock_on_load");
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // FIX: If this is a safe exit (reset/restart), do not trigger lock
      if (isSafeExit.current) return;

      const pending = localStorage.getItem("dd_reset_pending") === "true";
      // Only set trigger if in GAME mode and not pending reset
      if (appState === "GAME" && level < 4 && !pending) {
        localStorage.setItem("dd_trigger_lock_on_load", "true");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [appState, level]);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("dd_level", level);
  }, [level]);

  useEffect(() => {
    if (sessionStorage.getItem("dd_mode") === "master") {
      setAppState("MASTER");
      return;
    }
    const configured = localStorage.getItem("dd_game_configured");
    const storedPcId = localStorage.getItem("dd_pc_id");

    if (storedPcId) setCurrentPcId(storedPcId);

    if (configured && storedPcId) {
      setAppState("GAME");
    } else if (storedPcId) {
      setAppState("WAITING");
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("dd_timer_remaining");
    if (saved) setTimeLeft(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("dd_timer_remaining", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    let countdownInterval = null;
    if (isActive && timeLeft > 0 && !isLocked && !isResetPending) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      setIsDisqualified(true);
      setIsActive(false);
    }
    return () => clearInterval(countdownInterval);
  }, [isActive, timeLeft, isLocked, isResetPending]);

  // Visibility (Tab Switch) Handler
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const isPendingLocal =
        localStorage.getItem("dd_reset_pending") === "true";

      // Ensure we don't lock if it's a safe exit or disqualified
      if (
        document.hidden &&
        appState === "GAME" &&
        !isDisqualified &&
        !isLocked &&
        !isPendingLocal &&
        !isSafeExit.current
      ) {
        setIsLocked(true);
        const docId = localStorage.getItem("dd_doc_id");
        if (docId) await setTeamLockStatus(docId, true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [appState, isDisqualified, isLocked]);

  const handleStationLogin = (pcId) => {
    setCurrentPcId(pcId);
    setAppState("WAITING");
    setIsLocked(false);
    localStorage.removeItem("dd_trigger_lock_on_load");
  };

  const handleMasterLogin = () => {
    sessionStorage.setItem("dd_mode", "master");
    setAppState("MASTER");
  };

  const handlePenalty = (amount) => {
    setTimeLeft((prev) => Math.max(0, prev - amount));
    setPenaltySeconds(amount);
    setTimeout(() => setPenaltySeconds(0), 3000);
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleAdminReset = () => {
    isSafeExit.current = true; // Prevent lock on reload
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4cc9f0 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {appState === "LOGIN" && (
          <AdminLogin
            onStationLogin={handleStationLogin}
            onMasterLogin={handleMasterLogin}
          />
        )}
        {appState === "WAITING" && (
          <WaitingRoom
            pcId={currentPcId}
            onActivated={() => {
              setAppState("GAME");
              sessionStorage.setItem("dd_session_active", "true");
              setIsLocked(false);
            }}
          />
        )}
        {appState === "MASTER" && (
          <CentralAdminDashboard
            onLogout={() => {
              sessionStorage.removeItem("dd_mode");
              setAppState("LOGIN");
            }}
          />
        )}

        {appState === "GAME" && (
          <>
            {isResetPending && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="game-card p-10 max-w-lg w-full text-center border-blue-500 animate-pulse">
                  <h2 className="text-3xl font-game font-bold text-blue-400 mb-4">
                    WAITING FOR ADMIN
                  </h2>
                  <p className="text-gray-300 font-mono mb-6">
                    Reset request sent. Please wait for approval...
                  </p>
                  <Loader2 className="animate-spin w-12 h-12 text-blue-500 mx-auto" />
                </div>
              </div>
            )}

            {isLocked && !isResetPending && (
              <ResumeModal
                onResume={() => {
                  setIsLocked(false);
                  handlePenalty(CONFIG.refreshPenalty || 60);
                }}
              />
            )}

            {isDisqualified && !isResetPending && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="game-card p-10 max-w-lg w-full text-center border-red-500">
                  <h1 className="text-5xl font-game font-bold text-red-500 mb-4 animate-bounce">
                    GAME OVER
                  </h1>
                  <button
                    onClick={() => {
                      // FIX: Mark as safe exit to avoid locking on restart
                      isSafeExit.current = true;
                      window.location.reload();
                    }}
                    className="btn-game w-full bg-red-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!isLocked && !isDisqualified && !isResetPending && (
              <>
                {level === 1 && (
                  <Level1
                    pcId={currentPcId}
                    onUnlock={() => {
                      setLevel(2);
                      setIsActive(true);
                    }}
                    onAdminReset={handleAdminReset}
                  />
                )}
                {level === 2 && (
                  <Level2
                    pcId={currentPcId}
                    onSolve={() => {
                      setIsActive(false);
                      setLevel(3);
                    }}
                    timerDisplay={formatTime()}
                    onPenalty={handlePenalty}
                    onPenaltyAmount={penaltySeconds}
                    onAdminReset={handleAdminReset}
                  />
                )}
                {level === 3 && (
                  <Level3
                    pcId={currentPcId}
                    finalTime={formatTime()}
                    onAdminReset={handleAdminReset}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
