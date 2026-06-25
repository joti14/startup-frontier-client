"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Search, FileText, TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { fetchApplicantApplications } from "@/lib/api/applications/data";
import { Loader2 } from "lucide-react";

export default function CollaboratorOverview() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const email = session?.user?.email;
        if (!email) return;
        fetchApplicantApplications(email).then((data) => {
            setApplications(Array.isArray(data) ? data : []);
            setIsLoading(false);
        });
    }, [session?.user?.email]);

    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    const stats = [
        { label: "Total Applied", value: total, icon: FileText, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
        { label: "Pending Review", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        { label: "Accepted", value: accepted, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { label: "Rejected", value: rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
    ];

    return (
        <div className="max-w-4xl px-6 py-4 space-y-6">
            <DashboardHeading
                title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "Collaborator"} 👋`}
                description="Here's a snapshot of your collaboration activity."
            />

            {/* Stats */}
            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/dashboard/collaborator/opportunities" className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#635BFF]/30 transition-all duration-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
                            <Search className="w-5 h-5 text-[#635BFF]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Browse Opportunities</p>
                            <p className="text-xs text-slate-400 mt-0.5">Find your next role</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#635BFF] transition-colors" />
                </Link>

                <Link href="/dashboard/collaborator/applications" className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#635BFF]/30 transition-all duration-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">My Applications</p>
                            <p className="text-xs text-slate-400 mt-0.5">Track your submissions</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#635BFF] transition-colors" />
                </Link>
            </div>

            {/* Recent Applications */}
            {!isLoading && applications.length > 0 && (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Applications</h3>
                        <Link href="/dashboard/collaborator/applications" className="text-xs font-semibold text-[#635BFF] hover:underline">View all</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-900">
                        {applications.slice(0, 4).map((app) => (
                            <div key={app._id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{app.opportunityTitle}</p>
                                    <p className="text-xs text-slate-400 truncate">{app.startupName}</p>
                                </div>
                                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                    ${app.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                                    ${app.status === "accepted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                                    ${app.status === "rejected" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : ""}
                                `}>
                                    {app.status || "pending"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
