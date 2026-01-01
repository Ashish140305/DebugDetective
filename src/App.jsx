import React, { useState, useEffect, useRef } from "react";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";

function App() {
  const [level, setLevel] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);

  // --- INTEGRATED: COUNTDOWN & DISQUALIFICATION ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25 Minutes (1500s)
  const [isDisqualified, setIsDisqualified] = useState(false);

  useEffect(() => {
    let countdownInterval = null;
    if (isActive && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      setIsDisqualified(true);
      setIsActive(false);
    }
    return () => clearInterval(countdownInterval);
  }, [isActive, timeLeft]);

  // Original incrementing timer logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handlePenalty = (amount) => {
    setSeconds((s) => s + amount);
    // Apply penalty to the countdown timer
    setTimeLeft((prev) => Math.max(0, prev - amount));
    setPenaltySeconds(amount);
    // Clear the visual penalty indicator after 3 seconds
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
    <>
      {/* DISQUALIFICATION OVERLAY */}
      {isDisqualified && (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-6 text-center animate-fade-in">
          <div className="border-2 border-red-500 bg-red-500/10 p-10 rounded-2xl max-w-lg shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <h1 className="text-5xl font-black text-red-500 mb-4 tracking-tighter">DISQUALIFIED</h1>
            <p className="text-slate-300 text-lg mb-8">SECURITY BREACH: You failed to complete the investigation within the allotted time.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              RESTART SESSION
            </button>
          </div>
        </div>
      )}

      {level === 1 && (
        <Level1
          onUnlock={() => {
            setLevel(2);
            setIsActive(true);
          }}
          onUserLogin={(name) => console.log(`User logged in: ${name}`)}
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
  );
}

export default App;