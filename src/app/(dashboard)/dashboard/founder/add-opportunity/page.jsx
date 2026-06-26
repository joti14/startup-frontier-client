"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "@/lib/auth-client";
import {
    Briefcase, Code2, Monitor, Clock, CalendarDays,
    Loader2, ShieldAlert, Plus, Crown, Lock, ArrowRight, Infinity,
} from "lucide-react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import toast from "react-hot-toast";
import { addOpportunity } from "@/lib/api/opportunities/actions";
import { myOpportunities } from "@/lib/api/opportunities/data";
import { baseURL } from "@/lib/api/baseUrl";
import { authHeaders } from "@/lib/api/authHeaders";

const FREE_LIMIT = 3;

export default function AddOpportunity() {
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [oppCount, setOppCount] = useState(null);
    const [isPremium, setIsPremium] = useState(false);

    const isLimitReached = !isPremium && oppCount !== null && oppCount >= FREE_LIMIT;

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: { roleTitle: "", requiredSkills: "", workType: "", commitmentLevel: "", deadline: "" },
    });

    useEffect(() => {
        const email = session?.user?.email;
        if (!email) return;
        Promise.all([
            myOpportunities(email),
            fetch(`${baseURL}/api/users/profile/${email}`, { headers: authHeaders(), credentials: "include" }).then(r => r.json()),
        ]).then(([opps, profile]) => {
            setOppCount(Array.isArray(opps) ? opps.length : 0);
            setIsPremium(!!profile?.isPremium);
        });
    }, [session?.user?.email]);

    const onSubmitForm = async (data) => {
        if (isLimitReached) return;
        setIsSubmitting(true);
        setGlobalError("");
        try {
            const res = await addOpportunity({ ...data, founderEmail: session?.user?.email });
            if (res?.insertedId) {
                toast.success("Opportunity posted successfully!");
                reset();
                setOppCount((c) => c + 1);
            } else {
                toast.error(res?.message || "Failed to post opportunity.");
                if (res?.message?.includes("limit")) setOppCount(FREE_LIMIT);
            }
        } catch {
            setGlobalError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl py-4">
            <DashboardHeading title="Add Opportunity" description="Post a new role for your startup." />

            {/* Limit banner — shown when free limit reached */}
            {isLimitReached && (
                <div className="mb-5 rounded-2xl border border-amber-200/70 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-5">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                            <Crown className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Free limit reached ({FREE_LIMIT}/{FREE_LIMIT} opportunities used)
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
                                Upgrade to Premium to post unlimited opportunities and scale your team.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {["Unlimited postings", "Priority visibility", "Premium badge"].map((f) => (
                                    <span key={f} className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                                        <Infinity className="w-2.5 h-2.5" /> {f}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href="/dashboard/founder/upgrade"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm"
                            >
                                Upgrade to Premium <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Usage indicator for free users */}
            {!isPremium && oppCount !== null && !isLimitReached && (
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#635BFF] transition-all duration-500"
                            style={{ width: `${(oppCount / FREE_LIMIT) * 100}%` }}
                        />
                    </div>
                    <span className="shrink-0 font-medium">{oppCount}/{FREE_LIMIT} free slots used</span>
                </div>
            )}

            <div className={`relative bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm transition-all duration-300 ${isLimitReached ? "opacity-50 pointer-events-none select-none" : "hover:shadow-md hover:border-slate-200/60 dark:hover:border-slate-800/60"}`}>

                {/* Lock overlay */}
                {isLimitReached && (
                    <div className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center bg-white/60 dark:bg-slate-950/60 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-1.5 text-slate-400">
                            <Lock className="w-6 h-6" />
                            <p className="text-xs font-semibold">Upgrade to unlock</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                    <Plus className="h-4 w-4 text-[#635BFF]" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Post a New Role</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                            Role Title <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. Frontend Engineer, Growth Lead"
                                {...register("roleTitle", { required: "Role title is required" })}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                            />
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        {errors.roleTitle && <span className="text-[11px] font-medium text-rose-500">{errors.roleTitle.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                            Required Skills <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. React, Node.js, TypeScript"
                                {...register("requiredSkills", { required: "Required skills are needed" })}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                            />
                            <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        {errors.requiredSkills && <span className="text-[11px] font-medium text-rose-500">{errors.requiredSkills.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                Work Type <span className="text-rose-500">*</span>
                            </label>
                            <Controller
                                name="workType"
                                control={control}
                                rules={{ required: "Work type is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-9 text-xs font-medium h-auto py-2">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Monitor className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <SelectValue placeholder="Select work type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                            <SelectItem value="Remote" className="text-xs">Remote</SelectItem>
                                            <SelectItem value="On-site" className="text-xs">On-site</SelectItem>
                                            <SelectItem value="Hybrid" className="text-xs">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.workType && <span className="text-[11px] font-medium text-rose-500">{errors.workType.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                                Commitment Level <span className="text-rose-500">*</span>
                            </label>
                            <Controller
                                name="commitmentLevel"
                                control={control}
                                rules={{ required: "Commitment level is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-9 text-xs font-medium h-auto py-2">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Clock className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <SelectValue placeholder="Select commitment" />
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
                            {errors.commitmentLevel && <span className="text-[11px] font-medium text-rose-500">{errors.commitmentLevel.message}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                            Deadline <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                {...register("deadline", { required: "Application deadline is required" })}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600"
                            />
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        {errors.deadline && <span className="text-[11px] font-medium text-rose-500">{errors.deadline.message}</span>}
                    </div>

                    {globalError && (
                        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-3 py-2">
                            <ShieldAlert className="h-4 w-4 shrink-0" /><span>{globalError}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || isLimitReached}
                        className="w-full mt-2 py-2.5 bg-[#635BFF] hover:bg-[#5249E0] text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#635BFF]/10 active:scale-[0.995] disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin w-4 h-4" /><span>Posting Opportunity...</span></>
                        ) : (
                            <span>Post Opportunity ✨</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
