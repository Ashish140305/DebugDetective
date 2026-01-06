import React, { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminSetup from "./components/AdminSetup";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";
import ResumeModal from "./components/ResumeModal";

function App() {
  // --- APP STATE ---
  // 'LOGIN' | 'SETUP' | 'GAME'
  const [appState, setAppState] = useState("LOGIN");
  const [level, setLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false); // Refresh Lock

  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25 Mins
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    const configured = localStorage.getItem("dd_game_configured");

    if (configured) {
      setAppState("GAME");
      // Check if user refreshed while game was active
      if (sessionStorage.getItem("dd_session_active")) {
        setIsLocked(true);
      }
    } else {
      setAppState("LOGIN");
    }
  }, []);

  // --- TIMER LOGIC ---
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

  // --- HANDLERS ---

  const handleAdminReset = () => {
    // 1. Verify Identity (Simple PIN check using Resume PIN for quick reset)
    // Or clear everything and force full login. Let's do full clear for safety.
    const pin = prompt(
      "Enter Resume PIN to Reset Game, or type 'RESET' to force full logout:"
    );
    const savedPin = localStorage.getItem("dd_resume_pin");

    if (pin === savedPin || pin === "RESET") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload(); // Hard refresh to clear all states
    } else {
      alert("Invalid PIN.");
    }
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

  // 1. LOGIN SCREEN
  if (appState === "LOGIN") {
    return <AdminLogin onLoginSuccess={() => setAppState("SETUP")} />;
  }

  // 2. SETUP SCREEN
  if (appState === "SETUP") {
    return (
      <AdminSetup
        onSetupComplete={() => {
          setAppState("GAME");
          sessionStorage.setItem("dd_session_active", "true");
        }}
      />
    );
  }

  // 3. GAME INTERFACE
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SECURITY LOCK (On Refresh) */}
      {isLocked && <ResumeModal onResume={() => setIsLocked(false)} />}

      {/* DISQUALIFICATION SCREEN */}
      {isDisqualified && (
        <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-white p-10 rounded-xl max-w-lg shadow-2xl">
            <h1 className="text-4xl font-black text-red-600 mb-4">
              Time Expired
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              You failed to complete the investigation in time.
            </p>
            <button
              onClick={handleAdminReset}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Reset Terminal
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE LEVELS */}
      {!isLocked && !isDisqualified && (
        <>
          {level === 1 && (
            <Level1
              onUnlock={() => {
                setLevel(2);
                setIsActive(true);
              }}
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
            />
          )}

          {level === 3 && <Level3 finalTime={formatTime()} />}
        </>
      )}

      {/* Pass the reset handler down implicitly via DetectiveLayout wrapper in levels 
          (You need to update Level1, 2, 3 to pass this prop if you want the button visible)
          Alternatively, we can render the button here if we pull it out of Layout. 
          For now, Level components wrap Layout, so pass prop:
      */}
      {/* NOTE: You should update Level1, Level2, Level3 to accept `onAdminReset={handleAdminReset}` 
          and pass it to <DetectiveLayout> */}
    </div>
  );
}

export default App;
