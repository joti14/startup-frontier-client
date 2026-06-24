"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, FileText, Link as LinkIcon, RefreshCw, Building } from "lucide-react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchApplicantApplications } from "@/lib/api/applications/data";

export default function MyApplicationsPage() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchApps = useCallback(async (email) => {
        setIsLoading(true);
        try {
            const data = await fetchApplicantApplications(email);
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
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

    const email = session?.user?.email;

    return (
        <div className="max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between mb-6">
                <DashboardHeading title="My Applications" description="Track the status of roles you have applied for." />
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

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : !email ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Please log in to view your applications.</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm space-y-2">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">You haven't applied to any roles yet.</p>
                    <p className="text-xs text-slate-400">Start exploring opportunities and apply to join amazing startups!</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="w-[200px] text-xs font-bold uppercase text-slate-500">Role</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Startup</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">My Submission</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Status</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase text-slate-500">Date Applied</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                    <TableCell className="align-top py-4">
                                        <p className="text-sm font-semibold text-[#635BFF]">{app.opportunityTitle}</p>
                                    </TableCell>

                                    <TableCell className="align-top py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <Building className="w-4 h-4 text-slate-400" />
                                                {app.startupName}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-top py-4 max-w-xs">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Cover Letter</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2" title={app.coverLetter}>
                                                    {app.coverLetter}
                                                </p>
                                            </div>
                                            {app.resumeLink && (
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1"><LinkIcon className="w-3 h-3" /> Portfolio / Resume</p>
                                                    <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                        View Link
                                                    </a>
                                                </div>
                                            )}
                                        </div>
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
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
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
