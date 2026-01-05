import React, { useState, useEffect } from "react";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";

function App() {
  const [level, setLevel] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);

  // --- COUNTDOWN & DISQUALIFICATION ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25 Minutes
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
    <>
      {/* SIMPLE DISQUALIFICATION MODAL */}
      {isDisqualified && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Time Expired
            </h1>
            <p className="text-gray-600 mb-6">
              You failed to complete the tasks within the time limit.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg w-full transition-colors"
            >
              Restart
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
