"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen w-full pb-24 flex items-center justify-center overflow-hidden bg-transparent">

      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[65rem] h-[55rem] rounded-full bg-blue-200/35 dark:bg-blue-900/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_50%,#000_75%,transparent_100%)] opacity-60" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/80 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50/80 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
      </div>

      {/* ─── CONTENT ─── */}
      <div
        className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-8 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(20px)",
        }}
      >

        {/* Big 404 */}
        <div className="relative inline-block">
          <span className="text-[10rem] sm:text-[14rem] font-extrabold text-slate-100 dark:text-slate-900 leading-none select-none tracking-tighter">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter bg-gradient-to-b from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-900 bg-clip-text text-transparent select-none">
            404
          </span>
        </div>

        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase">
          <Sparkles className="h-3 w-3 text-pink-600 animate-pulse" />
          <span>Page not found</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1]">
          You've wandered off <br />
          <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-white">
            the frontier
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
          This page doesn't exist or may have been moved. The best ideas are back at home — let's get you there.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-50 text-white font-semibold text-xs tracking-wide h-11 px-8 shadow-md transition-all hover:scale-[1.01]"
          >
            <span>Back to Home</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-pink-50/40 hover:text-pink-600 hover:border-pink-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white text-slate-700 font-semibold text-xs h-11 px-8 shadow-sm transition-all"
          >
            Browse Opportunities
          </Link>
        </div>

        {/* Floating hint cards */}
        <div className="hidden sm:flex items-center justify-center gap-4 pt-6">
          {[
            { label: "Browse Startups", href: "/startups" },
            { label: "Find Roles", href: "/opportunities" },
            { label: "Post an Idea", href: "/register" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}