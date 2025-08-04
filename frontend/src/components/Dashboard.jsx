import { useEffect, useState } from "react";
import { getTodayDate } from "../utils/time";
import SessionNotes from "./SessionNotes";
import { exportNotesAsJSON } from "../utils/storage";
import {
  getTodayTotal,
  getAllLogs,
  calculateStreak,
  getDailyGoal,
  setDailyGoal,
  exportLogsAsJSON,
  exportLogsAsCSV,
  getTotalInRange,
} from "../utils/storage";
import { motivationalQuotes } from "../utils/quotes";
import { motion } from "framer-motion";
import StreakChart from "./StreakChart";
import { isWithinInterval, subDays, parseISO } from "date-fns";
import BadgesPanel from "./BadgesPanel";
import {
  Quote,
  Flame,
  CalendarDays,
  CalendarCheck,
  Timer as TimerIcon,
  Target,
  BarChart3,
  Trash2,
  FileDown,
} from "lucide-react";

import Timer from './Timer';

export default function Dashboard() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [logs, setLogs] = useState({});
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setGoal] = useState(getDailyGoal());
  const [goalMessage, setGoalMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

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
    setWeeklyTotal(getTotalInRange(logsData, 7));
    setMonthlyTotal(getTotalInRange(logsData, 30));
  }, []);

  const handleGoalUpdate = (e) => {
    e.preventDefault();
    const newGoal = parseInt(e.target.goal.value);
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal);
      setGoal(newGoal);
      setGoalMessage("Goal updated!");
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

  const glow = "hover:shadow-[0_0_0_2px_var(--chrono-primary)] hover:shadow-[0_0_12px_2px_var(--chrono-primary)] transition duration-300";

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-4">
      {/* Timer */}
      <Timer
  onSessionComplete={() => {
    const date = getTodayDate();
    const updatedLogs = getAllLogs();
    setTodayTotal(getTodayTotal(date));
    setLogs(updatedLogs);
    setStreak(calculateStreak(updatedLogs));
    setWeeklyTotal(getTotalInRange(updatedLogs, 7));
    setMonthlyTotal(getTotalInRange(updatedLogs, 30));
  }}
/>
      {/* Motivation */}
      <motion.div
        className={`bg-[#fff6e6] rounded-xl shadow-md p-5 border border-[var(--chrono-primary)] mb-6 ${glow} mt-16`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2 text-[var(--chrono-secondary)]">
          <Quote size={18} />
          <h3 className="text-md font-bold">Daily Quote</h3>
        </div>
        <blockquote className="italic text-[var(--chrono-secondary)] leading-relaxed">
          “{quoteOfTheDay.text}”
          <footer className="mt-2 text-right text-sm text-gray-600">
            — {quoteOfTheDay.author}
          </footer>
        </blockquote>
      </motion.div>
      

<SessionNotes />

      {/* Streak */}
      <motion.div
        className={`bg-[#fffdf7] rounded-xl shadow-md p-5 border border-neutral-200 text-center mb-6 ${glow}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center items-center gap-2 mb-1">
          <Flame className="text-[var(--chrono-primary)]" />
          <h3 className="text-2xl font-bold text-[var(--chrono-primary)]">
            {streak} day{streak === 1 ? "" : "s"} streak!
          </h3>
        </div>
        <p className="text-sm text-gray-600">Keep the momentum going!</p>
      </motion.div>

      {/* Weekly / Monthly Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`bg-[#fff7ea] rounded-xl shadow-md p-5 border border-neutral-200 ${glow}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
            <CalendarDays size={16} />
            <span>This Week</span>
          </div>
          <p className="text-xl font-bold text-[var(--chrono-primary)]">
            {weeklyTotal} mins
          </p>
        </div>
        <div className={`bg-[#fff7ea] rounded-xl shadow-md p-5 border border-neutral-200 ${glow}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
            <CalendarCheck size={16} />
            <span>This Month</span>
          </div>
          <p className="text-xl font-bold text-[var(--chrono-primary)]">
            {monthlyTotal} mins
          </p>
        </div>
      </div>

      {/* Today's Total */}
      <div className={`bg-[#fffbe9] rounded-xl shadow-md p-5 border border-neutral-200 mb-6 ${glow}`}>
        <div className="flex items-center gap-2 text-lg font-medium mb-1">
          <TimerIcon size={18} />
          <span>
            Today:{" "}
            <span className="text-[var(--chrono-primary)]">{todayTotal} minutes</span>
          </span>
        </div>
      </div>

      {/* Daily Goal */}
      <div className={`bg-[#fff8e5] rounded-xl shadow-md p-5 border border-neutral-200 mb-6 ${glow}`}>
        <div className="flex items-center gap-2 text-md font-bold text-gray-600 mb-2">
          <Target size={18} />
          <h3>Daily Goal Progress</h3>
        </div>

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
          <motion.button
  type="submit"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="ml-1 bg-[var(--chrono-primary)] text-white px-3 py-1 rounded text-sm shadow-sm hover:bg-[#e69e18] transition-all duration-300"
>
  Update
</motion.button>
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

      {/* Session History */}
      <div className={`bg-[#f5f5f5] rounded-xl shadow-md p-5 border border-neutral-200 mb-6 ${glow}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-md font-bold text-gray-600">
            <BarChart3 size={18} />
            <h3>Session History</h3>
          </div>
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

      <StreakChart />

      <BadgesPanel
        totalMinutes={weeklyTotal + monthlyTotal - todayTotal}
        streak={streak}
      />

      <motion.div
  className="mt-8 flex justify-center flex-wrap gap-4 mb-4"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      localStorage.removeItem("codechrono-logs");
      window.location.reload();
    }}
    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
  >
    <Trash2 size={16} />
    Clear All Data
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={exportLogsAsJSON}
    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
  >
    <FileDown size={16} />
    Export JSON
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={exportLogsAsCSV}
    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
  >
    <FileDown size={16} />
    Export CSV
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={exportNotesAsJSON}
    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
  >
    <FileDown size={16} />
    Export Notes
  </motion.button>
</motion.div>
    </div>
  );
}
