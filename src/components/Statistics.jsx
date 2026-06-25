"use client";

import React, { useState, useEffect } from "react";
import { Users, Rocket, Briefcase } from "lucide-react";

// Inline functional dynamic counter component
function AnimatedCount({ targetValue }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!targetValue) return;

    let start = 0;
    const duration = 1200; // Animation speed runtime (1.2 seconds)
    const speed = Math.max(Math.floor(duration / targetValue), 15);

    const counterInterval = setInterval(() => {
      // Dynamically calculate increments to make high numbers scroll smoothly
      start += Math.ceil(targetValue / 30);
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(counterInterval);
      } else {
        setCount(start);
      }
    }, speed);

    return () => clearInterval(counterInterval);
  }, [targetValue]);

  return <>{count.toLocaleString()}</>;
}

export default function Statistics({ stats }) {
  const totalStartups = stats?.totalStartups || 0;
  const totalCollaborators = stats?.totalCollaborators || 0;
  const activeOpportunities = stats?.activeOpportunities || 0;

  return (
    <section className="relative w-full bg-transparent pb-24 pt-7 overflow-hidden -mt-8">
      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ─── SEPARATE INDEPENDENT BORDERED CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {/* Card 1: Total Startups */}
          <div className="group p-8 lg:p-10 text-center rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-[0_15px_40px_-10px_rgba(15,23,42,0.08)] hover:scale-[1.02] cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:border-slate-400 dark:group-hover:border-slate-600 shadow-sm">
              <Rocket className="h-4 w-4 text-slate-800 dark:text-slate-200" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100">
                <AnimatedCount targetValue={totalStartups} />+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                Registered Startups
              </p>
            </div>
          </div>

          {/* Card 2: Total Collaborators */}
          <div
            className="group p-8 lg:p-10 text-center rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:bg-pink-50/10 dark:hover:bg-pink-950/10 hover:border-pink-200/60 dark:hover:border-pink-900/40 hover:shadow-[0_15px_40px_-10px_rgba(219,39,119,0.05)] hover:scale-[1.02] cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
            style={{ animationDelay: "150ms" }}
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center border border-pink-100 dark:border-pink-900/50 transition-all duration-300 group-hover:scale-110 group-hover:border-pink-400 shadow-sm">
              <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100">
                <AnimatedCount targetValue={totalCollaborators} />+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                Talented Collaborators
              </p>
            </div>
          </div>

          {/* Card 3: Active Opportunities */}
          <div
            className="group p-8 lg:p-10 text-center rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-[0_15px_40px_-10px_rgba(15,23,42,0.08)] hover:scale-[1.02] cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
            style={{ animationDelay: "300ms" }}
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:border-slate-400 dark:group-hover:border-slate-600 shadow-sm">
              <Briefcase className="h-4 w-4 text-slate-800 dark:text-slate-200" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100">
                <AnimatedCount targetValue={activeOpportunities} />+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                Open Positions
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}