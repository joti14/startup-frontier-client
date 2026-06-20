"use client";

import React from "react";
import { Users, Rocket, Briefcase } from "lucide-react";

export default function Statistics({ stats }) {
  const totalStartups = stats?.totalStartups || 0;
  const totalCollaborators = stats?.totalCollaborators || 0;
  const activeOpportunities = stats?.activeOpportunities || 0;

  return (
    <section className="relative w-full bg-transparent pb-24 pt-4 overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md shadow-[0_8px_32px_-6px_rgba(15,23,42,0.04)] overflow-hidden">
          
          <div className="group p-8 lg:p-10 text-center transition-all duration-300 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:border-slate-400 dark:group-hover:border-slate-600 shadow-sm">
              <Rocket className="h-4 w-4 text-slate-800 dark:text-slate-200" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100 transition-all duration-300 group-hover:tracking-wide">
                {totalStartups.toLocaleString()}+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-slate-600 dark:group-hover:text-slate-400">
                Registered Startups
              </p>
            </div>
          </div>

          {/* Stat 2: Total Collaborators */}
          <div 
            className="group p-8 lg:p-10 text-center transition-all duration-300 hover:bg-pink-50/20 dark:hover:bg-pink-950/10 cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
            style={{ animationDelay: "150ms" }} // Staggering the rise-up animation
          >
            {/* Hover is now highly visible with distinct pink accent borders matching the etail.me secondary indicator theme */}
            <div className="mx-auto w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center border border-pink-100 dark:border-pink-900/50 transition-all duration-300 group-hover:scale-110 group-hover:border-pink-400 shadow-sm">
              <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100">
                {totalCollaborators.toLocaleString()}+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                Talented Collaborators
              </p>
            </div>
          </div>

          {/* Stat 3: Active Opportunities */}
          <div 
            className="group p-8 lg:p-10 text-center transition-all duration-300 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 cursor-default animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
            style={{ animationDelay: "300ms" }} 
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:border-slate-400 dark:group-hover:border-slate-600 shadow-sm">
              <Briefcase className="h-4 w-4 text-slate-800 dark:text-slate-200" />
            </div>
            <div className="space-y-1 mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-100 transition-all duration-300 group-hover:tracking-wide">
                {activeOpportunities.toLocaleString()}+
              </span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1.5 transition-colors duration-300 group-hover:text-slate-600 dark:group-hover:text-slate-400">
                Open Positions
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}