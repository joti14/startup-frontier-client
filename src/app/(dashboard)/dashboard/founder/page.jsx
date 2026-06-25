"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import UpgradePremiumButton from "@/components/UpgradePremiumButton";
import { Briefcase, Users2, UserCheck, Crown, ArrowRight, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS = { Pending: "#F59E0B", Accepted: "#10B981", Rejected: "#F43F5E" };

export default function FounderOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ totalOpportunities: 0, totalApplications: 0, acceptedMembers: 0, pending: 0, rejected: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const isPremium = session?.user?.isPremium;
    const firstName = session?.user?.name?.split(" ")[0] || "Founder";

    useEffect(() => {
        const email = session?.user?.email;
        if (!email) return;

        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const [oppsRes, appsRes] = await Promise.all([
                    fetch(`${baseURL}/api/opportunities/${email}`),
                    fetch(`${baseURL}/api/applications/founder/${email}`),
                ]);
                const opps = oppsRes.ok ? await oppsRes.json() : [];
                const apps = appsRes.ok ? await appsRes.json() : [];
                const appList = Array.isArray(apps) ? apps : [];
                setStats({
                    totalOpportunities: Array.isArray(opps) ? opps.length : 0,
                    totalApplications: appList.length,
                    acceptedMembers: appList.filter((a) => a.status === "accepted").length,
                    pending: appList.filter((a) => a.status === "pending" || !a.status).length,
                    rejected: appList.filter((a) => a.status === "rejected").length,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [session?.user?.email]);

    const pieData = [
        { name: "Pending", value: stats.pending },
        { name: "Accepted", value: stats.acceptedMembers },
        { name: "Rejected", value: stats.rejected },
    ].filter((d) => d.value > 0);

    const statCards = [
        { label: "Total Opportunities", value: stats.totalOpportunities, icon: Briefcase, color: "text-[#4F46E5] dark:text-[#818CF8]", bg: "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-100/30 dark:border-indigo-900/30" },
        { label: "Total Applications", value: stats.totalApplications, icon: Users2, color: "text-[#635BFF] dark:text-[#a5b4fc]", bg: "bg-[#EEF2FF] dark:bg-[#4F46E5]/10 border-indigo-100/20 dark:border-indigo-900/20" },
        { label: "Accepted Members", value: stats.acceptedMembers, icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/30 dark:border-emerald-900/30" },
    ];

    return (
        <div className="space-y-6 mt-6 px-6">
            <DashboardHeading
                title={`Welcome back, ${firstName} 👋`}
                description="Monitor your active roles, track incoming applications, and scale your team."
            />

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
                                <div className="space-y-1">
                                    <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">{label}</span>
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h2>
                                </div>
                                <div className={`p-3.5 ${bg} ${color} rounded-xl border transition-transform duration-200 group-hover:scale-105`}>
                                    <Icon size={22} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pie chart + quick actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Applications by Status</h3>
                            <p className="text-xs text-slate-400 mb-4">Breakdown of all applicant statuses</p>
                            {stats.totalApplications === 0 ? (
                                <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-xs gap-2">
                                    <Users2 className="w-8 h-8 opacity-30" />
                                    No applications yet
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
                                            contentStyle={{ borderRadius: "10px", fontSize: "12px", border: "1px solid #e2e8f0", background: "var(--tooltip-bg, #fff)" }}
                                            formatter={(value, name) => [`${value} application${value !== 1 ? "s" : ""}`, name]}
                                        />
                                        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: "12px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 justify-center">
                            <Link href="/dashboard/founder/add-opportunity" className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#635BFF]/30 transition-all duration-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-[#635BFF]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Post Opportunity</p>
                                        <p className="text-xs text-slate-400">Add a new role to your startup</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#635BFF] transition-colors" />
                            </Link>

                            <Link href="/dashboard/founder/applications" className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#635BFF]/30 transition-all duration-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                        <Users2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Review Applications</p>
                                        <p className="text-xs text-slate-400">Accept or reject applicants</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#635BFF] transition-colors" />
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/* Premium banner */}
            {!isLoading && (!isPremium ? (
                <div className="bg-white dark:bg-slate-950 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Crown size={16} className="text-amber-500 fill-amber-500/20" />
                            Unlock Unlimited Opportunity Postings
                        </h3>
                        <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xl leading-relaxed">
                            Free accounts are limited to <strong>3 roles</strong>. Upgrade to Premium to post unlimited opportunities.
                        </p>
                    </div>
                    <div className="shrink-0 w-full md:w-auto">
                        <UpgradePremiumButton />
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Crown size={18} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Premium Membership Active</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Post unlimited roles and scale your dream startup.</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
