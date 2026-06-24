"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition, useEffect } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
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

    // Live search with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateParams("search", search.trim());
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const clearAll = () => {
        setSearch("");
        startTransition(() => router.replace(pathname));
    };

    const hasActiveFilters =
        searchParams.get("search") ||
        searchParams.get("industry") ||
        searchParams.get("fundingStage");

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search startups by name, industry, or description..."
                        className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-700 shadow-sm"
                    />
                </div>

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

                {/* Refresh / Clear icon */}
                <button
                    onClick={clearAll}
                    title="Clear all filters"
                    className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 shrink-0 shadow-sm ${
                        hasActiveFilters
                            ? "border-[#635BFF] text-[#635BFF] bg-[#635BFF]/5 hover:bg-[#635BFF]/10"
                            : "border-slate-200 dark:border-slate-800 text-slate-400 bg-white dark:bg-slate-950 hover:text-slate-600"
                    }`}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </button>
            </div>

            {isPending && (
                <p className="text-[11px] text-slate-400 animate-pulse">Updating results...</p>
            )}
        </div>
    );
}
