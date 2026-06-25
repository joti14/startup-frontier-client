"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, CheckCircle, XCircle, FileText, Link as LinkIcon, User, RefreshCw, Eye } from "lucide-react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { baseURL } from "@/lib/api/baseUrl";

export default function ApplicationsPage() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [viewApp, setViewApp] = useState(null);

    const fetchApps = useCallback(async (email) => {
        setIsLoading(true);
        try {
            console.log("[Applications] Fetching for founder email:", email);
            const res = await fetch(`${baseURL}/api/applications/founder/${email}`);
            console.log("[Applications] Response status:", res.status);
            const data = await res.json();
            console.log("[Applications] Data received:", data);
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("[Applications] Fetch error:", err);
            toast.error("Failed to load applications.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const email = session?.user?.email;
        if (!email) return;
        fetchApps(email);
    }, [session?.user?.email, fetchApps]);

    const handleUpdateStatus = async (appId, newStatus) => {
        setActionLoading(appId);
        try {
            const res = await fetch(`${baseURL}/api/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const result = await res.json();
            if (result?.modifiedCount > 0) {
                setApplications((prev) =>
                    prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
                );
                toast.success(`Application ${newStatus}!`);
            } else {
                toast.error("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred.");
        } finally {
            setActionLoading(null);
        }
    };

    const email = session?.user?.email;

    return (
        <>
        <div className="max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between mb-2">
                <DashboardHeading title="Applications" description="Review and manage applications for your open roles." />
                {email && (
                    <button
                        onClick={() => fetchApps(email)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                )}
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
                <p className="text-[10px] text-slate-400 mb-3">
                    Fetching as: <span className="font-mono text-slate-600 dark:text-slate-300">{email || "not logged in"}</span>
                    {" · "}{applications.length} application(s) found
                </p>
            )}

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : !email ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Please log in to view applications.</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm space-y-2">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No applications received yet.</p>
                    <p className="text-xs text-slate-400">Applications submitted to your startup&apos;s open positions will appear here.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="w-[200px] text-xs font-bold uppercase text-slate-500">Applicant</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Role</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Details</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Status</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                    <TableCell className="align-top py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-slate-400" />
                                                {app.applicantName || "Unknown Applicant"}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{app.applicantEmail}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-top py-4">
                                        <p className="text-sm font-semibold text-[#635BFF]">{app.opportunityTitle}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{app.startupName}</p>
                                    </TableCell>

                                    <TableCell className="align-top py-4">
                                        <button
                                            onClick={() => setViewApp(app)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#635BFF]/5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 hover:border-[#635BFF]/30 text-slate-600 dark:text-slate-300 hover:text-[#635BFF] rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                    </TableCell>

                                    <TableCell className="align-top py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                                            ${app.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                            ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                                            ${app.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                                        `}>
                                            {app.status || 'pending'}
                                        </span>
                                    </TableCell>

                                    <TableCell className="align-top py-4 text-right">
                                        {app.status === 'pending' ? (
                                            <div className="flex flex-col sm:flex-row items-end sm:justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "accepted")}
                                                    disabled={actionLoading === app._id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "rejected")}
                                                    disabled={actionLoading === app._id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No actions</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
        {/* View Application Modal */}
        <Dialog open={!!viewApp} onOpenChange={(open) => !open && setViewApp(null)}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                        Application — {viewApp?.opportunityTitle}
                    </DialogTitle>
                </DialogHeader>
                {viewApp && (
                    <div className="space-y-4 pt-1">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-[#635BFF]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{viewApp.applicantName}</p>
                                <p className="text-xs text-slate-400">{viewApp.applicantEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Motivation Message
                            </p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                                {viewApp.coverLetter || "—"}
                            </p>
                        </div>

                        {viewApp.resumeLink && (
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> Portfolio / Resume
                                </p>
                                <a
                                    href={viewApp.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-[#635BFF] hover:underline font-medium"
                                >
                                    <LinkIcon className="w-3 h-3" /> {viewApp.resumeLink}
                                </a>
                            </div>
                        )}

                        {viewApp.status === "pending" && (
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => { handleUpdateStatus(viewApp._id, "accepted"); setViewApp(null); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl text-xs font-bold transition-colors"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button
                                    onClick={() => { handleUpdateStatus(viewApp._id, "rejected"); setViewApp(null); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors"
                                >
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}