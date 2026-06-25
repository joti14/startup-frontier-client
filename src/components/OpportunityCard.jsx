import { Briefcase, Building, Code2, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function OpportunityCard({ opportunity }) {
    return (
        <Link href={`/opportunities/${opportunity._id}`} className="block group">
            <div className="h-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-800/80 transition-all duration-300 flex flex-col gap-4 cursor-pointer">
                
                {/* Header: Role + Startup */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-[#635BFF] transition-colors duration-200">
                            {opportunity.roleTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {opportunity.startupName}
                        </p>
                    </div>
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40">
                        {opportunity.workType}
                    </span>
                </div>

                {/* Description: Skills */}
                <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <Code2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="line-clamp-2">{opportunity.requiredSkills || "No specific skills mentioned"}</span>
                    </p>
                </div>

                {/* Footer: Commitment + Deadline */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-violet-500" />
                        {opportunity.commitmentLevel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
                        Due: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                </div>

            </div>
        </Link>
    );
}
