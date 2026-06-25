"use client";

import React, { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Aisha Renfro",
    role: "Founder, Loopkit",
    initials: "AR",
    accent: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    quote:
      "I posted my idea on a Tuesday. By Friday I had a designer and a backend engineer on board. We shipped our MVP six weeks later. Nothing else moves this fast.",
  },
  {
    name: "Marcus Teel",
    role: "Full-stack Developer",
    initials: "MT",
    accent: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300",
    quote:
      "I'd been freelancing for three years and wanted to actually build something. Found a fintech founder here, joined as a technical co-founder, and haven't looked back.",
  },
  {
    name: "Priya Nandan",
    role: "Product Designer, Draftly",
    initials: "PN",
    accent: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300",
    quote:
      "The quality of founders on this platform is genuinely different. Everyone has done the work before posting — no half-baked ideas, no wasted conversations.",
  },
  {
    name: "Jae-won Oh",
    role: "Co-founder, Stackr",
    initials: "JO",
    accent: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    quote:
      "We closed our pre-seed two months after forming the team here. Our investors specifically called out how well-balanced our founding team was. That came from this platform.",
  },
  {
    name: "Simone Adler",
    role: "Growth Marketer, Novareach",
    initials: "SA",
    accent: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    quote:
      "As a non-technical marketer I was worried I'd be an afterthought. Instead I found a team that saw distribution as a first-class problem. That shift changed everything.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = (index) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 300);
  };

  useEffect(() => {
    const id = setInterval(() => {
      goTo((active + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(id);
  }, [active]);

  const { name, role, initials, accent, quote } = testimonials[active];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-transparent">

      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[35rem] rounded-full bg-blue-100/20 dark:bg-blue-900/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/80 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50/80 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ─── HEADER ─── */}
        <div className="text-center mb-14 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}

            className="text-[11px] font-semibold tracking-widest uppercase text-pink-600">
            What builders say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}

            className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Trusted by real teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}

            className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
            Not case studies. Not hand-picked PR quotes. Just builders who found their people here.
          </motion.p>
        </div>

        {/* ─── CARD ─── */}
        <div className="max-w-3xl mx-auto mb-10">
          <div
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 sm:px-12 py-10 shadow-sm text-center transition-all duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(10px)",
            }}
          >
            <Quote className="h-6 w-6 text-slate-300 dark:text-slate-700 mx-auto mb-6" />

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[80px]">
              "{quote}"
            </p>

            <div className="mt-8 flex flex-col items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${accent}`}>
                {initials}
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
            </div>
          </div>
        </div>

        {/* ─── DOTS ─── */}
        <div className="flex items-center justify-center gap-2 mb-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${i === active
                ? "w-5 h-1.5 bg-slate-900 dark:bg-white"
                : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
            />
          ))}
        </div>

        {/* ─── AVATAR STRIP ─── */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {testimonials.map(({ initials: ini, accent: ac }, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View testimonial ${i + 1}`}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 cursor-pointer ${ac} ${i === active
                ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600 scale-110"
                : "opacity-50 hover:opacity-80"
                }`}
            >
              {ini}
            </button>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-600 ml-2">+500 others</span>
        </div>

      </div>
    </section>
  );
}