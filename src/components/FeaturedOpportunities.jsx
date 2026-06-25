import { fetchLatestOpportunities } from "@/lib/api/opportunities/data";
import OpportunityCard from "./OpportunityCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FeaturedOpportunities() {
    const opportunities = await fetchLatestOpportunities();

    return (
        <section className="relative w-full py-20 px-6 overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[55rem] h-[35rem] rounded-full bg-blue-200/25 dark:bg-blue-900/10 blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-12">

                <div className="text-center flex flex-col items-center gap-4">
                    <div className="space-y-3 w-full">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Latest Open {" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                                Roles
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            Join fast-growing teams. Explore the newest opportunities across our startup ecosystem.
                        </p>
                    </div>
                </div>

                {!opportunities || opportunities.length === 0 ? (
                    <div className="text-center py-20 text-sm text-slate-400 dark:text-slate-500">
                        No opportunities posted yet. Check back soon!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {opportunities.map((opportunity) => (
                            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
                        ))}
                    </div>
                )}

                <div className="text-center pt-2">
                    <Button
                        asChild
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide h-11 px-8 shadow-md transition-all hover:scale-[1.01]"
                    >
                        <Link href="/opportunities" className="flex items-center gap-2">
                            Explore All Roles
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}
