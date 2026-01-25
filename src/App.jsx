import React, { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminSetup from "./components/AdminSetup";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";
import ResumeModal from "./components/ResumeModal";
import { CONFIG } from "./gameConfig";

function App() {
  const [appState, setAppState] = useState("LOGIN");
  const [level, setLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // State will be hydrated
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Initialize timer from storage to prevent reset on refresh
  useEffect(() => {
    const saved = sessionStorage.getItem("dd_timer_remaining");
    if (saved) setTimeLeft(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const configured = localStorage.getItem("dd_game_configured");
    if (configured) {
      setAppState("GAME");
      if (sessionStorage.getItem("dd_session_active")) {
        setIsLocked(true);
      }
    } else {
      setAppState("LOGIN");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("dd_timer_remaining", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    let countdownInterval = null;
    if (isActive && timeLeft > 0 && !isLocked) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      setIsDisqualified(true);
      setIsActive(false);
    }
    return () => clearInterval(countdownInterval);
  }, [isActive, timeLeft, isLocked]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.hidden &&
        appState === "GAME" &&
        !isDisqualified &&
        !isLocked
      ) {
        setIsLocked(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [appState, isDisqualified, isLocked]);

  const handleAdminReset = () => {
    localStorage.removeItem("dd_game_configured");
    localStorage.removeItem("dd_pc_id");
    localStorage.removeItem("dd_l1_ans");
    localStorage.removeItem("dd_resume_pin");
    sessionStorage.clear();
    window.location.reload();
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

  return (
    <div className="min-h-screen relative p-4 md:p-8 flex items-center justify-center">
      {/* Background Particles/Dots */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4cc9f0 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {appState === "LOGIN" && (
          <AdminLogin onLoginSuccess={() => setAppState("SETUP")} />
        )}
        {appState === "SETUP" && (
          <AdminSetup
            onSetupComplete={() => {
              setAppState("GAME");
              sessionStorage.setItem("dd_session_active", "true");
              sessionStorage.removeItem("dd_q_index");
            }}
          />
        )}

        {appState === "GAME" && (
          <>
            {isLocked && (
              <ResumeModal
                onResume={() => {
                  setIsLocked(false);
                  handlePenalty(CONFIG.refreshPenalty || 60);
                }}
              />
            )}

            {isDisqualified && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="game-card p-10 max-w-lg w-full text-center border-red-500">
                  <h1 className="text-5xl font-game font-bold text-red-500 mb-4 animate-bounce">
                    GAME OVER
                  </h1>
                  <p className="text-gray-300 font-body text-xl mb-8">
                    Time Limit Exceeded
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-game w-full bg-red-600 shadow-[0_6px_0_#7f1d1d]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!isLocked && !isDisqualified && (
              <>
                {level === 1 && (
                  <Level1
                    onUnlock={() => {
                      setLevel(2);
                      setIsActive(true);
                    }}
                    onAdminReset={handleAdminReset}
                  />
                )}
                {level === 2 && (
                  <Level2
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
