"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, CheckCircle, Trash2, RefreshCw, Rocket } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import { authHeaders } from "@/lib/api/authHeaders";
import toast from "react-hot-toast";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function AdminStartupsPage() {
    const [startups, setStartups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchStartups = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseURL}/api/admin/startups`, { headers: authHeaders(), credentials: "include" });
            const data = await res.json();
            setStartups(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load startups.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchStartups(); }, []);

    const handleApprove = async (id) => {
        setActionLoading(id + "_approve");
        try {
            const res = await fetch(`${baseURL}/api/admin/startups/approve/${id}`, { method: "PATCH", headers: authHeaders(), credentials: "include" });
            const result = await res.json();
            if (result?.modifiedCount > 0) {
                setStartups((prev) => prev.map((s) => s._id === id ? { ...s, approved: true } : s));
                toast.success("Startup approved.");
            } else {
                toast.error("Already approved or not found.");
            }
        } catch {
            toast.error("Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm("Remove this startup permanently?")) return;
        setActionLoading(id + "_remove");
        try {
            const res = await fetch(`${baseURL}/api/admin/startups/${id}`, { method: "DELETE", headers: authHeaders(), credentials: "include" });
            const result = await res.json();
            if (result?.deletedCount > 0) {
                setStartups((prev) => prev.filter((s) => s._id !== id));
                toast.success("Startup removed.");
            } else {
                toast.error("Not found.");
            }
        } catch {
            toast.error("Action failed.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
                <DashboardHeading title="Manage Startups" description="Approve or remove startups from the platform." />
                <button
                    onClick={fetchStartups}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : startups.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm">
                    <Rocket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No startups found.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <Table className="min-w-[640px]">
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Startup</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Founder</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Industry</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Status</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {startups.map((startup) => (
                                <TableRow key={startup._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            {startup.logoUrl ? (
                                                <img src={startup.logoUrl} alt={startup.startupName} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center shrink-0">
                                                    <Rocket className="w-4 h-4 text-[#635BFF]" />
                                                </div>
                                            )}
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{startup.startupName || "â€”"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="text-xs text-slate-600 dark:text-slate-300">{startup.founderEmail || "â€”"}</p>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{startup.industry || "â€”"}</span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                            ${startup.approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}
                                        `}>
                                            {startup.approved ? "Approved" : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!startup.approved && (
                                                <button
                                                    onClick={() => handleApprove(startup._id)}
                                                    disabled={actionLoading === startup._id + "_approve"}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === startup._id + "_approve"
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <><CheckCircle className="w-3.5 h-3.5" /> Approve</>
                                                    }
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemove(startup._id)}
                                                disabled={!!actionLoading}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === startup._id + "_remove"
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <><Trash2 className="w-3.5 h-3.5" /> Remove</>
                                                }
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

