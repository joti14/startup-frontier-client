"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Loader2, RefreshCw, Receipt } from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import toast from "react-hot-toast";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseURL}/api/admin/transactions`);
            const data = await res.json();
            setTransactions(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load transactions.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="space-y-4 mt-6 px-6">
            <div className="flex items-center justify-between">
                <DashboardHeading title="Transactions" description="All premium upgrade payments on the platform." />
                <button
                    onClick={fetchTransactions}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Revenue summary */}
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                        ${totalRevenue.toFixed(2)}
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                    <Receipt size={20} />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            ) : transactions.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-10 text-center shadow-sm">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No transactions yet.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">User</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Amount</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Date</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Payment Status</TableHead>
                                <TableHead className="text-xs font-bold uppercase text-slate-500">Transaction ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                    <TableCell className="py-3">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.userEmail || "—"}</p>
                                        <p className="text-xs text-slate-400 capitalize">{tx.paymentType || "subscription"}</p>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            {tx.amount != null ? `$${Number(tx.amount).toFixed(2)}` : "—"}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                            {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {tx.paidAt ? new Date(tx.paidAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                            ${tx.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}
                                        `}>
                                            {tx.paymentStatus || "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <p className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                                            {tx.transactionId || "—"}
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
