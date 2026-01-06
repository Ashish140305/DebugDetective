import React, { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminSetup from "./components/AdminSetup";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";
import ResumeModal from "./components/ResumeModal";
// ThemeProvider is now in main.jsx

function App() {
  const [appState, setAppState] = useState("LOGIN");
  const [level, setLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 Mins
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

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

  const handleAdminReset = () => {
    localStorage.removeItem("dd_game_configured");
    localStorage.removeItem("dd_pc_id");
    localStorage.removeItem("dd_l1_ans");
    localStorage.removeItem("dd_resume_pin");
    sessionStorage.removeItem("dd_session_active");

    // Hard refresh to reload state
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

  // --- RENDERING ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 text-gray-900 dark:text-gray-100 font-sans">
      {appState === "LOGIN" && (
        <AdminLogin onLoginSuccess={() => setAppState("SETUP")} />
      )}

      {appState === "SETUP" && (
        <AdminSetup
          onSetupComplete={() => {
            setAppState("GAME");
            sessionStorage.setItem("dd_session_active", "true");
          }}
        />
      )}

      {appState === "GAME" && (
        <>
          {isLocked && <ResumeModal onResume={() => setIsLocked(false)} />}

          {isDisqualified && (
            <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-6 text-center animate-fade-in">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-xl max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700">
                <h1 className="text-4xl font-black text-red-600 mb-4">
                  Time Expired
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  You failed to complete the investigation in time.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  Reset Terminal
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
  );
}

export default App;
