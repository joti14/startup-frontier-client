import { fetchStartupById } from "@/lib/api/startups/data";
import { myOpportunities } from "@/lib/api/opportunities/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, Layers, Rocket, Monitor, Clock, CalendarDays } from "lucide-react";
import ApplyModal from "@/components/ApplyModal";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const startup = await fetchStartupById(id);
    if (!startup) return { title: "Startup Not Found" };
    return {
        title: startup.startupName,
        description: startup.description || `Learn about ${startup.startupName} and explore open roles.`,
    };
}

export default async function StartupDetailsPage({ params }) {
    const { id } = await params;
    const startup = await fetchStartupById(id);

    if (!startup) {
        notFound();
    }

    let opportunities = await myOpportunities(startup.founderEmail) || [];

    if (opportunities.length === 0) {
        opportunities = [
            {
                _id: `dummy-1-${startup._id}`,
                roleTitle: "Frontend Developer",
                workType: "Remote",
                commitmentLevel: "Full-time",
                deadline: "2026-12-31",
                requiredSkills: "React, Next.js, Tailwind CSS",
                title: "Frontend Developer"
            },
            {
                _id: `dummy-2-${startup._id}`,
                roleTitle: "Product Designer",
                workType: "Hybrid",
                commitmentLevel: "Part-time",
                deadline: "2026-11-15",
                requiredSkills: "Figma, UI/UX, User Research",
                title: "Product Designer"
            }
        ];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/startups" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Startups
                </Link>

                {/* Startup Header */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#635BFF]/10 to-transparent blur-3xl -z-10" />
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                            {startup.logoUrl ? (
                                <img src={startup.logoUrl} alt={startup.startupName} className="w-full h-full object-cover" />
                            ) : (
                                <Rocket className="h-10 w-10 text-[#635BFF]" />
                            )}
                        </div>
                        <div className="space-y-2 flex-1">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{startup.startupName}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300">
                                    {startup.industry}
                                </span>
                                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-violet-500" /> {startup.fundingStage}</span>
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500" /> {startup.teamSizeNeeded ? `${startup.teamSizeNeeded} members needed` : "Team TBD"}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About {startup.startupName}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{startup.description}</p>
                    </div>
                </div>

                {/* Open Positions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Available Positions</h2>
                    
                    <div className="space-y-4">
                        {opportunities.map((opp) => (
                            <div key={opp._id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{opp.roleTitle}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md"><Monitor className="w-3.5 h-3.5 text-blue-500" /> {opp.workType}</span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5 text-orange-500" /> {opp.commitmentLevel}</span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md"><CalendarDays className="w-3.5 h-3.5 text-rose-500" /> Deadline: {opp.deadline}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">Skills needed: </span>
                                        {opp.requiredSkills}
                                    </p>
                                </div>
                                <div className="shrink-0 w-full sm:w-auto">
                                    <ApplyModal opportunity={opp} startup={startup} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
