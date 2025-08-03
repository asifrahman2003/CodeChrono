import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getAllLogs } from "../utils/storage";
import { subDays } from "date-fns";
import { Tooltip } from "react-tooltip";

export default function StreakChart() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const logs = getAllLogs();

    if (logs && typeof logs === "object") {
      const data = Object.entries(logs)
        .filter(([date]) => !isNaN(new Date(date))) // Only valid dates
        .map(([date, sessions]) => ({
          date,
          count: Array.isArray(sessions)
            ? sessions.reduce((a, b) => a + b, 0)
            : 0,
        }));
      setHeatmapData(data);
    }
  }, []);

  return (
    <div
      className="mt-10 w-full max-w-2xl mx-auto mb-6 
        bg-white rounded-xl shadow-md p-5 border border-neutral-200 
        hover:shadow-[0_0_0_2px_var(--chrono-primary)] 
        hover:shadow-[0_0_12px_2px_var(--chrono-primary)] 
        transition duration-300 text-center"
    >
      <h3 className="text-lg font-semibold text-[var(--chrono-secondary)] mb-4">
        Coding Streak Calendar
      </h3>

      <div className="overflow-x-auto flex justify-center">
        <CalendarHeatmap
          startDate={subDays(new Date(), 180)}
          endDate={new Date()}
          values={heatmapData}
          showWeekdayLabels
          className="react-heatmap"
          classForValue={(value) => {
            if (!value || !value.count) return "color-empty";
            if (value.count < 30) return "color-scale-1";
            if (value.count < 60) return "color-scale-2";
            if (value.count < 90) return "color-scale-3";
            return "color-scale-4";
          }}
          tooltipDataAttrs={(value) =>
            value?.date
              ? {
                  "data-tooltip-id": "heatmap-tooltip",
                  "data-tooltip-content": `${value.date}: ${value.count || 0} minute${
                    value.count === 1 ? "" : "s"
                  } coded`,
                }
              : {
                  "data-tooltip-id": "heatmap-tooltip",
                  "data-tooltip-content": "No data",
                }
          }
        />
      </div>

      <Tooltip id="heatmap-tooltip" />
    </div>
  );
}
