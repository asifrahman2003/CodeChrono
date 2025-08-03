// Format duration in minutes to hh:mm:ss
export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Get current date as YYYY-MM-DD
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}
