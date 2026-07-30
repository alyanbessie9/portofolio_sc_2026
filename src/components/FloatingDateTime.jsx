import React, { useState, useEffect } from "react";

export default function FloatingDateTime() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-100 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-3 text-xs md:text-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="font-medium text-slate-300">{formattedDate}</span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="font-mono font-semibold text-indigo-400">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
