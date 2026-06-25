"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Users, Rocket, Briefcase, DollarSign, Crown, Loader2, ShieldAlert } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ROLE_COLORS = { founder: "#635BFF", collaborator: "#10B981", admin: "#F59E0B" };

export default function AdminOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = session?.user?.role === "admin";

    useEffect(() => {
        if (!isAdmin) return;
        Promise.all([
            fetch(`${baseURL}/api/admin/stats`).then((r) => r.json()),
            fetch(`${baseURL}/api/admin/users`).then((r) => r.json()),
        ]).then(([statsData, usersData]) => {
            setStats(statsData);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <ShieldAlert className="w-10 h-10 text-rose-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Admin access required.</p>
            </div>
        );
    }

    const founders = users.filter((u) => u.role === "founder").length;
    const collaborators = users.filter((u) => u.role === "collaborator").length;
    const admins = users.filter((u) => u.role === "admin").length;
    const premiumUsers = users.filter((u) => u.isPremium).length;

    const rolePieData = [
        { name: "Founder", value: founders },
        { name: "Collaborator", value: collaborators },
        { name: "Admin", value: admins },
    ].filter((d) => d.value > 0);

    const statCards = [
        {
            label: "Total Users",
            value: stats?.totalUsers ?? "—",
            icon: Users,
            color: "text-[#635BFF]",
            bg: "bg-[#635BFF]/10",
            sub: `${premiumUsers} premium`,
        },
        {
            label: "Total Startups",
            value: stats?.totalStartups ?? "—",
            icon: Rocket,
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
            sub: "registered startups",
        },
        {
            label: "Total Opportunities",
            value: stats?.totalOpportunities ?? "—",
            icon: Briefcase,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            sub: "open positions",
        },
        {
            label: "Total Revenue",
            value: stats?.totalRevenue != null ? `$${stats.totalRevenue.toFixed(2)}` : "—",
            icon: DollarSign,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            sub: "from premium plans",
        },
    ];

    return (
        <div className="space-y-6 mt-6 px-6">
            <DashboardHeading
                title={`Admin Overview`}
                description="Platform-wide stats and user breakdown."
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
                            <div key={label} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
                                    <p className="text-xs text-slate-400">{sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${bg} ${color} shrink-0`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Users by role pie */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Users by Role</h3>
                            <p className="text-xs text-slate-400 mb-4">Distribution of founders, collaborators, and admins</p>
                            {users.length === 0 ? (
                                <div className="flex items-center justify-center h-44 text-slate-400 text-xs">No users yet</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={rolePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                            {rolePieData.map((entry) => (
                                                <Cell key={entry.name} fill={ROLE_COLORS[entry.name.toLowerCase()] || "#94a3b8"} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: "10px", fontSize: "12px", border: "1px solid #e2e8f0" }}
                                            formatter={(value, name) => [`${value} user${value !== 1 ? "s" : ""}`, name]}
                                        />
                                        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: "12px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Recent users table */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-900 shrink-0">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Users</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Latest registrations on the platform</p>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-900 overflow-y-auto">
                                {users.slice(0, 6).map((user) => (
                                    <div key={user._id} className="px-5 py-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=635BFF&color=fff&bold=true&size=32`}
                                                alt={user.name}
                                                className="w-7 h-7 rounded-lg object-cover shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name || "—"}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {user.isPremium && (
                                                <Crown className="w-3 h-3 text-amber-500" />
                                            )}
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                                ${user.role === "founder" ? "bg-[#635BFF]/10 text-[#635BFF]" : ""}
                                                ${user.role === "collaborator" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                                                ${user.role === "admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                                            `}>
                                                {user.role || "user"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
