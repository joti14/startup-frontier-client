import { fetchLatestStartups } from "@/lib/api/startups/data";
import StartupCard from "./StartupCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FeaturedStartups() {
    const startups = await fetchLatestStartups();

    return (
        <section className="relative w-full py-20 px-6 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55rem] h-[35rem] rounded-full bg-violet-200/25 dark:bg-violet-900/10 blur-[120px]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50/80 to-transparent dark:from-slate-950/80" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-12">

                <div className="text-center flex flex-col items-center gap-4">
                    <div className="space-y-3 w-full">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Startups Building {" "}
                            <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-white">
                                Right Now
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            Discover the latest ventures looking for talented collaborators to help them grow fast.
                        </p>
                    </div>
                </div>

                {!startups || startups.length === 0 ? (
                    <div className="text-center py-20 text-sm text-slate-400 dark:text-slate-500">
                        No startups yet. Be the first to launch yours!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {startups.map((startup) => (
                            <StartupCard key={startup._id} startup={startup} />
                        ))}
                    </div>
                )}

                <div className="text-center pt-2">
                    <Button
                        asChild
                        className="rounded-full bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-50 text-white font-semibold text-xs tracking-wide h-11 px-8 shadow-md transition-all hover:scale-[1.01]"
                    >
                        <Link href="/startups" className="flex items-center gap-2">
                            Explore All Startups
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}