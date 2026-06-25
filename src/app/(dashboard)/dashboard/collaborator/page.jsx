"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Search, FileText, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { fetchApplicantApplications } from "@/lib/api/applications/data";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS = { Pending: "#F59E0B", Accepted: "#10B981", Rejected: "#F43F5E" };

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
    const pending = applications.filter((a) => a.status === "pending" || !a.status).length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    const stats = [
        { label: "Total Applied", value: total, icon: FileText, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
        { label: "Pending Review", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        { label: "Accepted", value: accepted, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { label: "Rejected", value: rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
    ];

    const pieData = [
        { name: "Pending", value: pending },
        { name: "Accepted", value: accepted },
        { name: "Rejected", value: rejected },
    ].filter((d) => d.value > 0);

    return (
        <div className="max-w-4xl px-6 py-4 space-y-6">
            <DashboardHeading
                title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "Collaborator"} 👋`}
                description="Here's a snapshot of your collaboration activity."
            />

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : (
                <>
                    {/* Stats */}
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

                    {/* Pie chart + recent applications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">My Applications</h3>
                            <p className="text-xs text-slate-400 mb-4">Status distribution of all your applications</p>
                            {total === 0 ? (
                                <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-xs gap-2">
                                    <Search className="w-8 h-8 opacity-30" />
                                    <span>No applications yet — <Link href="/dashboard/collaborator/opportunities" className="text-[#635BFF] hover:underline font-medium">browse opportunities</Link></span>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                            {pieData.map((entry) => (
                                                <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: "10px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                                            formatter={(value, name) => [`${value} application${value !== 1 ? "s" : ""}`, name]}
                                        />
                                        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: "12px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Recent Applications */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between shrink-0">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Applications</h3>
                                <Link href="/dashboard/collaborator/applications" className="text-xs font-semibold text-[#635BFF] hover:underline">View all</Link>
                            </div>
                            {applications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 py-10 text-slate-400 text-xs gap-1">
                                    <FileText className="w-7 h-7 opacity-30" />
                                    Nothing here yet
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                    {applications.slice(0, 5).map((app) => (
                                        <div key={app._id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{app.opportunityTitle}</p>
                                                <p className="text-xs text-slate-400 truncate">{app.startupName}</p>
                                            </div>
                                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                                ${(app.status === "pending" || !app.status) ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                                                ${app.status === "accepted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                                                ${app.status === "rejected" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : ""}
                                            `}>
                                                {app.status || "pending"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
