import { getTodayDate } from "./time";

// 🔑 LocalStorage Keys
const STORAGE_KEY = "codechrono-logs";
const GOAL_KEY = "codechrono-daily-goal";

// 🔐 Save session
export function saveSession(date, durationMs) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const minutes = Math.round(durationMs / 60000);
  if (!existing[date]) existing[date] = [];
  existing[date].push(minutes);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// 🔍 Get today's total
export function getTodayTotal(date) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const todayLogs = data[date] || [];
  return todayLogs.reduce((a, b) => a + b, 0);
}

// 📦 Get all logs
export function getAllLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// 🔥 Calculate coding streak (consecutive days)
export function calculateStreak(logs) {
  const dates = Object.keys(logs).sort((a, b) => b.localeCompare(a)); // newest first
  let streak = 0;
  let currentDate = new Date(getTodayDate());

  for (let i = 0; i < dates.length; i++) {
    const logDate = new Date(dates[i]);

    if (currentDate.toDateString() === logDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // go to yesterday
    } else {
      break; // streak broken
    }
  }

  return streak;
}

// 🎯 Daily goal management
export function getDailyGoal() {
  return parseInt(localStorage.getItem(GOAL_KEY)) || 60; // default 60 mins
}

export function setDailyGoal(minutes) {
  localStorage.setItem(GOAL_KEY, minutes);
}

// 📤 Export logs to JSON
export function exportLogsAsJSON() {
  const data = getAllLogs();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "codechrono_logs.json";
  a.click();
  URL.revokeObjectURL(url);
}

// 📤 Export logs to CSV
export function exportLogsAsCSV() {
  const data = getAllLogs();
  const rows = [["Date", "Session #", "Minutes"]];

  Object.entries(data).forEach(([date, sessions]) => {
    sessions.forEach((minutes, idx) => {
      rows.push([date, idx + 1, minutes]);
    });
  });

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "codechrono_logs.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// 📊 Weekly/Monthly Total Summary
export function getTotalInRange(logs, daysBack) {
  const now = new Date();

  return Object.entries(logs)
    .filter(([dateStr]) => {
      const logDate = new Date(dateStr);
      const diffTime = now - logDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays < daysBack;
    })
    .reduce((total, [, sessions]) => {
      return total + sessions.reduce((a, b) => a + b, 0);
    }, 0);
}
