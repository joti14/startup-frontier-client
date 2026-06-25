"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react"

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-transparent pt-12 pb-24">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[65rem] h-[55rem] rounded-full bg-blue-200/35 dark:bg-blue-900/15 blur-[130px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_50%,#000_75%,transparent_100%)] opacity-60" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50/60 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}

          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase">
          <Sparkles className="h-3 w-3 text-pink-600 animate-pulse" />
          <span>Now live — 500+ startups building together</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}

          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          The platform where <br />
          <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-white">
            great teams get forged
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}

          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Startup founders post ideas and recruit collaborators. <br className="hidden sm:inline" />
          Developers, designers, and marketers find their next big thing.
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}

          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            className="w-full sm:w-auto rounded-full bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-50 text-white font-semibold text-xs tracking-wide h-11 px-8 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Link href="/register" className="flex items-center gap-2">
              <span>Start Building</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto rounded-full border-slate-200 bg-white hover:bg-pink-50/40 hover:text-pink-600 hover:border-pink-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white transition-all text-xs font-semibold h-11 px-8 shadow-sm cursor-pointer"
          >
            <Link href="/opportunities">
              Browse Opportunities
            </Link>
          </Button>
        </motion.div>

      </div>

    </section>
  );
}