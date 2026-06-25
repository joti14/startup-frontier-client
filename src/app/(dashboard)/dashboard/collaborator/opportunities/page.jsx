"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import OpportunityCard from "@/components/OpportunityCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LIMIT = 9;

export default function BrowseOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");
    const [workType, setWorkType] = useState("");
    const [industry, setIndustry] = useState("");

    const fetchOps = useCallback(async (currentPage = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: currentPage, limit: LIMIT });
            if (searchQuery) params.set("search", searchQuery);
            if (workType && workType !== "All") params.set("workType", workType);
            if (industry && industry !== "All") params.set("industry", industry);

            const res = await fetch(`${baseURL}/api/opportunities?${params}`);
            const json = await res.json();
            setOpportunities(Array.isArray(json.data) ? json.data : []);
            setTotal(json.total ?? 0);
            setTotalPages(json.totalPages ?? 1);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, workType, industry]);

    // Reset to page 1 and debounce when filters change
    useEffect(() => {
        setPage(1);
        const timeout = setTimeout(() => fetchOps(1), 400);
        return () => clearTimeout(timeout);
    }, [searchQuery, workType, industry]);

    // Fetch when page changes (no debounce needed)
    useEffect(() => {
        fetchOps(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClear = () => {
        setSearchQuery("");
        setWorkType("");
        setIndustry("");
        setPage(1);
    };

    const pageNumbers = () => {
        const pages = [];
        const delta = 1;
        for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="max-w-6xl px-6 py-4">
            <DashboardHeading
                title="Browse Opportunities"
                description="Find the perfect role to match your skills and aspirations."
            />

            {/* Filters */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by role title or skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                </div>

                <div className="w-full md:w-48 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex items-center gap-1"><Filter className="w-3 h-3" /> Work Type</label>
                    <Select value={workType} onValueChange={setWorkType}>
                        <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium outline-none">
                            <SelectValue placeholder="All Work Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Work Types</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="On-site">On-site</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-48 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex items-center gap-1"><Filter className="w-3 h-3" /> Industry</label>
                    <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium outline-none">
                            <SelectValue placeholder="All Industries" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Industries</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                            <SelectItem value="FinTech">FinTech</SelectItem>
                            <SelectItem value="HealthTech">HealthTech</SelectItem>
                            <SelectItem value="EdTech">EdTech</SelectItem>
                            <SelectItem value="CleanTech">CleanTech</SelectItem>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Blockchain">Blockchain</SelectItem>
                            <SelectItem value="Artificial Intelligence">AI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    onClick={handleClear}
                    title="Clear all filters"
                    className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 shrink-0 ${
                        searchQuery || workType || industry
                            ? "border-[#635BFF] text-[#635BFF] bg-[#635BFF]/5 hover:bg-[#635BFF]/10"
                            : "border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900 hover:text-slate-600"
                    }`}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : opportunities.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No opportunities match your search criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <>
                    {/* Result count */}
                    <p className="text-xs text-slate-400 mb-4">
                        Showing <span className="font-semibold text-slate-600 dark:text-slate-300">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}</span> of <span className="font-semibold text-slate-600 dark:text-slate-300">{total}</span> opportunities
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {opportunities.map((opportunity) => (
                            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {page > 2 && (
                                <>
                                    <button onClick={() => handlePageChange(1)} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">1</button>
                                    {page > 3 && <span className="text-slate-400 text-xs">…</span>}
                                </>
                            )}

                            {pageNumbers().map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                                        p === page
                                            ? "bg-[#635BFF] border-[#635BFF] text-white"
                                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            {page < totalPages - 1 && (
                                <>
                                    {page < totalPages - 2 && <span className="text-slate-400 text-xs">…</span>}
                                    <button onClick={() => handlePageChange(totalPages)} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">{totalPages}</button>
                                </>
                            )}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
