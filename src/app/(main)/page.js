export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedStartups from "@/components/FeaturedStartups";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";

function StartupsSkeleton() {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-slate-100 dark:bg-slate-900 rounded-lg w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-lg w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-lg w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-lg w-4/5" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                <div className="h-6 w-16 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                <div className="h-6 w-24 bg-slate-100 dark:bg-slate-900 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const mockStatsData = {
    totalStartups: 320,
    totalCollaborators: 1450,
    activeOpportunities: 84
  };
  return (
    <div>
      <Hero />
      <Statistics stats={mockStatsData} />
      <Suspense fallback={<StartupsSkeleton />}>
        <FeaturedStartups />
      </Suspense>
      <Suspense fallback={<StartupsSkeleton />}>
        <FeaturedOpportunities />
      </Suspense>
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
