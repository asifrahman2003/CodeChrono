import { useState, useEffect } from "react";
import { formatDuration, getTodayDate } from "../utils/time";
import { saveSession } from "../utils/storage";
import { motion, AnimatePresence } from "framer-motion";

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
      className="flex flex-col items-center justify-center px-4 py-10 text-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-[var(--chrono-secondary)] mb-4 tracking-tight">
        CodeChrono
      </h1>

      <p className="text-lg text-[var(--chrono-secondary)] mb-8 max-w-xl">
        Track your daily coding time and build the habit of consistency.
      </p>

      <div className="relative mb-8">
        <AnimatePresence>
          {isRunning && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--chrono-primary)] blur-xl opacity-50"
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 1.6, opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10 text-5xl font-mono text-[var(--chrono-text)]"
          animate={{ scale: isRunning ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {formatDuration(elapsed)}
        </motion.div>
      </div>

      <motion.button
        onClick={isRunning ? handleStop : handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`rounded-full px-8 py-3 text-base font-semibold shadow-md transition-colors duration-300 ${
          isRunning
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-[var(--chrono-primary)] hover:bg-[#e69e18] text-black"
        }`}
      >
        {isRunning ? "Stop" : "Start Coding Session"}
      </motion.button>
    </motion.div>
  );
}
