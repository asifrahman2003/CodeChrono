import { useState, useEffect } from "react";
import { formatDuration, getTodayDate } from "../utils/time";
import { saveSession } from "../utils/storage";
import { motion } from "framer-motion";

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer tick effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handleStop = () => {
    setIsRunning(false);
    saveSession(getTodayDate(), elapsed);
    setElapsed(0);
    setStartTime(null);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-4">CodeChrono</h1>
      <p className="text-lg text-[var(--chrono-secondary)] mb-8 text-center max-w-xl">
        Track your daily coding time and build the habit of consistency.
      </p>

      <motion.div
        className="text-4xl font-mono mb-6"
        animate={{ scale: isRunning ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {formatDuration(elapsed)}
      </motion.div>

      {isRunning ? (
        <button
          onClick={handleStop}
          className="rounded px-6 py-2 text-base font-medium transition-colors duration-200 bg-red-500 hover:bg-red-600"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={handleStart}
          className="rounded px-6 py-2 text-base font-medium transition-colors duration-200 bg-[var(--chrono-primary)] hover:bg-[#e69e18]"
        >
          Start Coding Session
        </button>
      )}
    </motion.div>
  );
}
