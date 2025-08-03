import { useEffect, useState } from "react";
import { getTodayDate } from "../utils/time";
import {
  getTodayTotal,
  getAllLogs,
  calculateStreak,
  getDailyGoal,
  setDailyGoal,
  exportLogsAsJSON,
  exportLogsAsCSV
} from "../utils/storage";
import { motivationalQuotes } from "../utils/quotes";
import { motion } from "framer-motion";
import StreakChart from "./StreakChart";
import { isWithinInterval, subDays, parseISO } from "date-fns";

export default function Dashboard() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [logs, setLogs] = useState({});
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setGoal] = useState(getDailyGoal());
  const [goalMessage, setGoalMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const progressPercent =
    dailyGoal > 0 ? Math.min((todayTotal / dailyGoal) * 100, 100) : 0;

  const quoteOfTheDay =
    motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  useEffect(() => {
    const date = getTodayDate();
    const logsData = getAllLogs();
    setTodayTotal(getTodayTotal(date));
    setLogs(logsData);
    setStreak(calculateStreak(logsData));
  }, []);

  const handleGoalUpdate = (e) => {
    e.preventDefault();
    const newGoal = parseInt(e.target.goal.value);
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal);
      setGoal(newGoal);
      setGoalMessage("✅ Goal updated!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setGoalMessage(""), 2000);
    }
  };

  const filterLogsByDateRange = (logs, filter) => {
    if (filter === "all") return logs;

    const now = new Date();
    const days = filter === "week" ? 6 : 29;

    return Object.fromEntries(
      Object.entries(logs).filter(([date]) =>
        isWithinInterval(parseISO(date), {
          start: subDays(now, days),
          end: now,
        })
      )
    );
  };

  const filteredLogs = filterLogsByDateRange(logs, filter);

  return (
    <div className="w-full max-w-xl mt-10">

      {/* 💭 Motivational Quote */}
      <motion.div
        className="bg-white rounded shadow p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-md font-bold mb-2 text-gray-600">💭 Daily Motivation</h3>
        <blockquote className="italic text-gray-700">
          “{quoteOfTheDay.text}”
          <footer className="mt-1 text-right text-sm text-gray-500">
            — {quoteOfTheDay.author}
          </footer>
        </blockquote>
      </motion.div>

      {/* 🔥 Streak Counter */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-[var(--chrono-primary)]">
          🔥 {streak} day{streak === 1 ? "" : "s"} streak!
        </h3>
        <p className="text-sm text-gray-600">Keep the momentum going!</p>
      </motion.div>

      {/* 🟢 Today's Total */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <p className="text-lg font-medium">
          Today: <span className="text-[var(--chrono-primary)]">{todayTotal} minutes</span>
        </p>
      </div>

      {/* 🎯 Daily Goal Progress */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="text-md font-bold mb-2 text-gray-600">🎯 Daily Goal Progress</h3>

        <form onSubmit={handleGoalUpdate} className="mb-4 flex items-center gap-2 text-sm">
          <label htmlFor="goal">Set Goal:</label>
          <input
            id="goal"
            name="goal"
            type="number"
            min={1}
            defaultValue={dailyGoal}
            className="border rounded px-2 py-1 w-20"
          />
          <button
            type="submit"
            className="bg-[var(--chrono-primary)] text-white px-3 py-1 rounded text-sm hover:bg-[#e69e18]"
          >
            Update
          </button>
          {goalMessage && (
            <span className="text-green-600 text-xs">{goalMessage}</span>
          )}
        </form>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-[var(--chrono-primary)] h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-600">
          {todayTotal} / {dailyGoal} minutes
        </p>
      </div>

      {/* 📅 Session History with Filter */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-bold text-gray-600">Session History</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <ul className="space-y-1 text-sm">
          {Object.entries(filteredLogs)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([date, sessions], i) => (
              <motion.li
                key={date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="font-medium">{date}</span>:{" "}
                {sessions.reduce((a, b) => a + b, 0)} minutes across {sessions.length} session(s)
              </motion.li>
            ))}
        </ul>
      </div>

      {/* 📊 Heatmap Calendar */}
      <StreakChart />

      {/* 🧹 Clear + Export Buttons */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={() => {
            localStorage.removeItem("codechrono-logs");
            window.location.reload();
          }}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Clear All Data
        </button>

        <button
          onClick={exportLogsAsJSON}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Export JSON
        </button>

        <button
          onClick={exportLogsAsCSV}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
