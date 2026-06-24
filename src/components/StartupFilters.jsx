"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const INDUSTRIES = [
    "Technology", "SaaS", "FinTech", "HealthTech", "EdTech",
    "E-commerce", "Artificial Intelligence", "CleanTech",
    "Gaming", "Blockchain", "Media & Entertainment", "Cybersecurity",
];

const FUNDING_STAGES = ["Pre-seed", "Seed", "Series A", "Series B+", "Bootstrapped"];

export default function StartupFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");

    const updateParams = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }, [searchParams, pathname, router]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams("search", search.trim());
    };

    const clearSearch = () => {
        setSearch("");
        updateParams("search", "");
    };

    const hasActiveFilters =
        searchParams.get("search") ||
        searchParams.get("industry") ||
        searchParams.get("fundingStage");

    const clearAll = () => {
        setSearch("");
        startTransition(() => router.replace(pathname));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search startups by name, industry, or description..."
                        className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-700 shadow-sm"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </form>

                {/* Industry filter */}
                <div className="relative sm:w-48">
                    <Select
                        value={searchParams.get("industry") || "all"}
                        onValueChange={(val) => updateParams("industry", val)}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium h-auto py-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <SelectValue placeholder="Industry" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <SelectItem value="all" className="text-xs">All Industries</SelectItem>
                            {INDUSTRIES.map((ind) => (
                                <SelectItem key={ind} value={ind} className="text-xs">{ind}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Funding Stage filter */}
                <div className="relative sm:w-44">
                    <Select
                        value={searchParams.get("fundingStage") || "all"}
                        onValueChange={(val) => updateParams("fundingStage", val)}
                    >
                        <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium h-auto py-2.5 shadow-sm">
                            <SelectValue placeholder="Funding Stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <SelectItem value="all" className="text-xs">All Stages</SelectItem>
                            {FUNDING_STAGES.map((stage) => (
                                <SelectItem key={stage} value={stage} className="text-xs">{stage}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active filter chips + clear all */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">Filtering by:</span>
                    {searchParams.get("search") && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#635BFF]/10 border border-[#635BFF]/20 text-[11px] font-semibold text-[#635BFF]">
                            &ldquo;{searchParams.get("search")}&rdquo;
                            <button onClick={() => { setSearch(""); updateParams("search", ""); }}>
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {searchParams.get("industry") && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                            {searchParams.get("industry")}
                            <button onClick={() => updateParams("industry", "")}>
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {searchParams.get("fundingStage") && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {searchParams.get("fundingStage")}
                            <button onClick={() => updateParams("fundingStage", "")}>
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    <button
                        onClick={clearAll}
                        className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors ml-1"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {isPending && (
                <p className="text-[11px] text-slate-400 animate-pulse">Updating results...</p>
            )}
        </div>
    );
}
