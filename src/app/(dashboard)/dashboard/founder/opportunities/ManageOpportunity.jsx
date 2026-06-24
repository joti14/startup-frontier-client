"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, X, Loader2, Briefcase, Code2, Monitor, Clock, CalendarDays } from "lucide-react";
import { deleteOpportunity, updateOpportunity } from "@/lib/api/opportunities/actions";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { myOpportunities } from "@/lib/api/opportunities/data";

export default function ManageOpportunity({ opportunities: initialOpportunities }) {
    const [opportunities, setOpportunities] = useState(initialOpportunities || []);
    const [editingOpp, setEditingOpp] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

    const { data: session } = useSession();

    useEffect(() => {
        const loadOpportunity = async () => {
            const opportunityData = await myOpportunities(session?.user?.email);
            setOpportunities(opportunityData);
        };
        loadOpportunity();
    }, [session]);

    const openEdit = (opp) => {
        setEditingOpp(opp);
        reset({
            roleTitle: opp.roleTitle,
            requiredSkills: opp.requiredSkills,
            workType: opp.workType,
            commitmentLevel: opp.commitmentLevel,
            deadline: opp.deadline,
        });
    };

    const closeEdit = () => {
        setEditingOpp(null);
        reset();
    };

    const onUpdate = async (data) => {
        setIsUpdating(true);
        try {
            const res = await updateOpportunity(data, editingOpp._id);
            if (res?.modifiedCount > 0) {
                setOpportunities((prev) =>
                    prev.map((o) => (o._id === editingOpp._id ? { ...o, ...data } : o))
                );
                toast.success("Opportunity updated!");
                closeEdit();
            } else {
                toast.error("No changes were saved.");
            }
        } catch {
            toast.error("Update failed. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const id = confirmDeleteId;
        setDeletingId(id);
        setConfirmDeleteId(null);
        try {
            const res = await deleteOpportunity(id);
            if (res?.deletedCount > 0) {
                setOpportunities((prev) => prev.filter((o) => o._id !== id));
                toast.success("Opportunity deleted.");
            } else {
                toast.error("Could not delete opportunity.");
            }
        } catch {
            toast.error("Delete failed. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    //  dynamic status
    const getStatusStyle = (status) => {
        const normalize = status?.toLowerCase() || "pending";
        switch (normalize) {
            case "approved":
                return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
            case "rejected":
                return "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400";
            case "pending":
            default:
                return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
        }
    };

    return (
        <>
            <div className="mt-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 dark:border-slate-900 hover:bg-transparent">
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Role
                                </TableHead>
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Work Type
                                </TableHead>
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Commitment
                                </TableHead>
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Deadline
                                </TableHead>
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Status
                                </TableHead>
                                <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 px-5">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {opportunities.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-12 text-sm text-slate-400 dark:text-slate-500"
                                    >
                                        No opportunities posted yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                opportunities.map((opp) => (
                                    <TableRow
                                        key={opp._id}
                                        className="border-b border-slate-50 dark:border-slate-900 last:border-b-0 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors duration-150"
                                    >
                                        <TableCell className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200 text-sm">
                                            <span className="truncate max-w-50 block">{opp.roleTitle}</span>
                                        </TableCell>
                                        <TableCell className="py-3.5 px-5 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                            {opp.workType}
                                        </TableCell>
                                        <TableCell className="py-3.5 px-5 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                            {opp.commitmentLevel}
                                        </TableCell>
                                        <TableCell className="py-3.5 px-5 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                            {formatDate(opp.deadline)}
                                        </TableCell>
                                        <TableCell className="py-3.5 px-5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(opp.status)}`}>
                                                {opp.status || "pending"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-3.5 px-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(opp)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border border-[#635BFF]/20 bg-[#635BFF]/8 text-[#635BFF] hover:bg-[#635BFF]/15 transition-all duration-200"
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(opp._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border border-rose-500/20 bg-rose-500/8 text-rose-500 hover:bg-rose-500/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={deletingId === opp._id}
                                                >
                                                    {deletingId === opp._id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingOpp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeEdit}
                    />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-2xl p-5 z-10">

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                            <div className="flex items-center gap-2">
                                <Pencil className="h-4 w-4 text-[#635BFF]" />
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    Edit Opportunity
                                </h3>
                            </div>
                            <button
                                onClick={closeEdit}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onUpdate)} className="space-y-3">

                            {/* Role Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                    Role Title <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        {...register("roleTitle", { required: "Role title is required" })}
                                        className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                                    />
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.roleTitle && <span className="text-[11px] font-medium text-rose-500">{errors.roleTitle.message}</span>}
                            </div>

                            {/* Required Skills */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                    Required Skills <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        {...register("requiredSkills", { required: "Required skills are needed" })}
                                        className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                                    />
                                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.requiredSkills && <span className="text-[11px] font-medium text-rose-500">{errors.requiredSkills.message}</span>}
                            </div>

                            {/* Work Type & Commitment Level */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                        Work Type <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Controller
                                            name="workType"
                                            control={control}
                                            rules={{ required: "Work type is required" }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-9 text-xs font-medium h-auto py-2">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                                        <SelectItem value="Remote" className="text-xs">Remote</SelectItem>
                                                        <SelectItem value="On-site" className="text-xs">On-site</SelectItem>
                                                        <SelectItem value="Hybrid" className="text-xs">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    {errors.workType && <span className="text-[11px] font-medium text-rose-500">{errors.workType.message}</span>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                        Commitment <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Controller
                                            name="commitmentLevel"
                                            control={control}
                                            rules={{ required: "Commitment level is required" }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-9 text-xs font-medium h-auto py-2">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                                        <SelectItem value="Full-time" className="text-xs">Full-time</SelectItem>
                                                        <SelectItem value="Part-time" className="text-xs">Part-time</SelectItem>
                                                        <SelectItem value="Contract" className="text-xs">Contract</SelectItem>
                                                        <SelectItem value="Internship" className="text-xs">Internship</SelectItem>
                                                        <SelectItem value="Volunteer" className="text-xs">Volunteer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    {errors.commitmentLevel && <span className="text-[11px] font-medium text-rose-500">{errors.commitmentLevel.message}</span>}
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                    Deadline <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        {...register("deadline", { required: "Deadline is required" })}
                                        className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                                    />
                                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.deadline && <span className="text-[11px] font-medium text-rose-500">{errors.deadline.message}</span>}
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#5249E0] text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setConfirmDeleteId(null)}
                    />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-2xl p-5 z-10">

                        <div className="flex items-start gap-3 mb-4">
                            <div className="shrink-0 w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center">
                                <Trash2 className="h-4 w-4 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    Delete Opportunity
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    This action is permanent and cannot be undone. Are you sure you want to delete this opportunity?
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Yes, Delete
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}