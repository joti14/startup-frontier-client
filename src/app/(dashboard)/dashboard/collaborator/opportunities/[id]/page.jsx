"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
    ArrowLeft, Briefcase, Monitor, Clock, CalendarDays,
    Code2, Building2, Mail, Loader2, AlertCircle
} from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";
import ApplyModal from "@/components/ApplyModal";

export default function OpportunityDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [opportunity, setOpportunity] = useState(null);
    const [startup, setStartup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setIsLoading(true);
            try {
                // Fetch opportunity
                const oppRes = await fetch(`${baseURL}/api/opportunities/detail/${id}`);
                const opp = oppRes.ok ? await oppRes.json() : null;
                setOpportunity(opp);

                // Fetch associated startup by founderEmail
                if (opp?.founderEmail) {
                    const stRes = await fetch(`${baseURL}/api/founder/${opp.founderEmail}`);
                    const st = stRes.ok ? await stRes.json() : null;
                    setStartup(st);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="max-w-2xl px-6 py-10 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Opportunity not found.</p>
                <button onClick={() => router.back()} className="text-xs text-[#635BFF] hover:underline">Go back</button>
            </div>
        );
    }

    const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
    const isPast = opportunity.deadline && new Date(opportunity.deadline) < new Date();

    return (
        <div className="max-w-3xl px-6 py-4 space-y-5">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunities
            </button>

            {/* Header Card */}
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{opportunity.roleTitle}</h1>
                        {startup && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> {startup.startupName}
                            </p>
                        )}
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${
                        isPast
                            ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/40"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/40"
                    }`}>
                        {isPast ? "Closed" : "Open"}
                    </span>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { icon: Monitor, label: opportunity.workType, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                        { icon: Clock, label: opportunity.commitmentLevel, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
                        { icon: CalendarDays, label: `Deadline: ${deadlineDate}`, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
                    ].map(({ icon: Icon, label, color, bg }) => (
                        <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bg} text-xs font-semibold ${color}`}>
                            <Icon className="w-3.5 h-3.5" /> {label}
                        </span>
                    ))}
                </div>

                {/* Apply button */}
                {!isPast && startup && (
                    <div className="pt-2">
                        <ApplyModal opportunity={opportunity} startup={startup} />
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#635BFF]" /> Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {(opportunity.requiredSkills || "").split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-[#635BFF]/8 border border-[#635BFF]/15 text-xs font-semibold text-[#635BFF]">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Startup info */}
            {startup && (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#635BFF]" /> About the Startup
                    </h2>
                    <div className="flex items-center gap-4">
                        {startup.logoUrl && (
                            <img src={startup.logoUrl} alt={startup.startupName} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                        )}
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{startup.startupName}</p>
                            <p className="text-xs text-slate-400">{startup.industry} · {startup.fundingStage}</p>
                        </div>
                    </div>
                    {startup.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{startup.description}</p>
                    )}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {opportunity.founderEmail}
                    </p>
                </div>
            )}
        </div>
    );
}
