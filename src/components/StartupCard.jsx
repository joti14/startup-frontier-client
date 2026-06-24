import { Building2, Users, Layers, Rocket } from "lucide-react";
import Link from "next/link";

const INDUSTRY_COLORS = {
    "SaaS": "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40",
    "FinTech": "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40",
    "HealthTech": "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40",
    "EdTech": "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40",
    "CleanTech": "bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40",
    "Blockchain": "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/40",
    "Artificial Intelligence": "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40",
    "E-commerce": "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/40",
    "Media & Entertainment": "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/40",
};

const STAGE_LABELS = {
    "Pre-seed": "Pre-seed",
    "Seed": "Seed",
    "Series A": "Series A",
    "Series B+": "Series B+",
    "Bootstrapped": "Bootstrapped",
};

export default function StartupCard({ startup }) {
    const industryColor = INDUSTRY_COLORS[startup.industry] ||
        "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";

    return (
        <Link href={`/startups/${startup._id}`} className="block group">
            <div className="h-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-800/80 transition-all duration-300 flex flex-col gap-4 cursor-pointer">

                {/* Header: Logo + Name + Industry badge */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                            {startup.logoUrl ? (
                                <img
                                    src={startup.logoUrl}
                                    alt={startup.startupName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Rocket className="h-5 w-5 text-[#635BFF]" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-[#635BFF] transition-colors duration-200">
                                {startup.startupName}
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                {startup.founderEmail}
                            </p>
                        </div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${industryColor}`}>
                        {startup.industry}
                    </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
                    {startup.description || "No description provided."}
                </p>

                {/* Footer: Stage + Team size */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Layers className="h-3.5 w-3.5 text-violet-500" />
                        {STAGE_LABELS[startup.fundingStage] || startup.fundingStage || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5 text-emerald-500" />
                        {startup.teamSizeNeeded
                            ? `${startup.teamSizeNeeded} member${startup.teamSizeNeeded > 1 ? "s" : ""} needed`
                            : "Team TBD"}
                    </span>
                </div>

            </div>
        </Link>
    );
}
