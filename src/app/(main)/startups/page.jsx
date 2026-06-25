export const metadata = {
    title: "Browse Startups",
    description: "Explore early-stage startups building across every industry. Find one that matches your skills.",
};

import { Suspense } from "react";
import { fetchAllStartups } from "@/lib/api/startups/data";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";
import { Rocket, Sparkles } from "lucide-react";

async function StartupGrid({ search, industry, fundingStage }) {
    const params = {};
    if (search) params.search = search;
    if (industry) params.industry = industry;
    if (fundingStage) params.fundingStage = fundingStage;

    const startups = await fetchAllStartups(params);

    if (!startups || startups.length === 0) {
        return (
            <div className="text-center py-20 space-y-3">
                <Rocket className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No startups match your search.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Try adjusting your filters or search term.
                </p>
            </div>
        );
    }

    return (
        <>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {startups.length} startup{startups.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {startups.map((startup) => (
                    <StartupCard key={startup._id} startup={startup} />
                ))}
            </div>
        </>
    );
}

function StartupGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0" />
                            <div className="space-y-2">
                                <div className="h-3.5 w-28 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                                <div className="h-3 w-20 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                            </div>
                        </div>
                        <div className="h-5 w-16 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
                        <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900">
                        <div className="h-3.5 w-20 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                        <div className="h-3.5 w-28 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function BrowseStartups({ searchParams }) {
    const sParams = await searchParams;
    const search = sParams?.search || "";
    const industry = sParams?.industry || "";
    const fundingStage = sParams?.fundingStage || "";

    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[40rem] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[130px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_30%,#000_60%,transparent_100%)] opacity-40" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-16 space-y-10">

                {/* Page header — centered */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide shadow-sm">
                        <Sparkles className="h-3 w-3 text-[#635BFF] animate-pulse" />
                        All Startups
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        Find Your Next <br />
                        <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-white">
                            Big Venture
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Browse every startup on the platform. Connect with founders, explore open roles, and join a team building something great.
                    </p>
                </div>

                {/* Filters — client component */}
                <Suspense fallback={null}>
                    <StartupFilters />
                </Suspense>

                {/* Startup grid — re-fetches on searchParam change */}
                <Suspense fallback={<StartupGridSkeleton />}>
                    <StartupGrid
                        search={search}
                        industry={industry}
                        fundingStage={fundingStage}
                    />
                </Suspense>

            </div>
        </div>
    );
}
