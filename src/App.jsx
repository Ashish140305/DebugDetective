import React, { useState, useEffect, useRef } from "react";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";

function App() {
  const [level, setLevel] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [penaltySeconds, setPenaltySeconds] = useState(0);

  // Timer Logic
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
    setPenaltySeconds(amount);
    // Clear the visual penalty indicator after 3 seconds
    setTimeout(() => setPenaltySeconds(0), 3000);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
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
  );
}

export default App;
