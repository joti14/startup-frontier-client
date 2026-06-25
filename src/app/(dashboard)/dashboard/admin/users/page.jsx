"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, ShieldBan, ShieldCheck, Crown, RefreshCw } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import toast from "react-hot-toast";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseURL}/api/admin/users`, { credentials: "include" });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleBlock = async (user) => {
        const action = user.isBlocked ? "unblock" : "block";
        setActionLoading(user._id);
        try {
            const res = await fetch(`${baseURL}/api/admin/users/${action}/${user._id}`, { method: "PATCH" , credentials: "include"});
            const result = await res.json();
            if (result?.modifiedCount > 0) {
                setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
                toast.success(`User ${action}ed.`);
            } else {
                toast.error("No change made.");
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
                <DashboardHeading title="Manage Users" description="View, block, or unblock platform users." />
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">User</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Role</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Status</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Premium</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase text-slate-500">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=635BFF&color=fff&bold=true&size=32`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name || "â€”"}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                            ${user.role === "founder" ? "bg-[#635BFF]/10 text-[#635BFF]" : ""}
                                            ${user.role === "collaborator" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                                            ${user.role === "admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : ""}
                                        `}>
                                            {user.role || "user"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                            ${user.isBlocked ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}
                                        `}>
                                            {user.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {user.isPremium ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                                <Crown className="w-3 h-3" /> Premium
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">Free</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3 text-right">
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleToggleBlock(user)}
                                                disabled={actionLoading === user._id}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50
                                                    ${user.isBlocked
                                                        ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                        : "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                                    }`}
                                            >
                                                {actionLoading === user._id
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : user.isBlocked
                                                        ? <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</>
                                                        : <><ShieldBan className="w-3.5 h-3.5" /> Block</>
                                                }
                                            </button>
                                        )}
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

