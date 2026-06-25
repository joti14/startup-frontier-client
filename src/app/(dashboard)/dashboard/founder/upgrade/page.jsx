"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Crown, Check, Zap, Infinity, Sparkles, Users, BarChart3,
    Loader2, ArrowRight, Lock
} from "lucide-react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import toast from "react-hot-toast";
import { baseURL } from "@/lib/api/baseUrl";

const FREE_FEATURES = [
    "Post up to 3 opportunities",
    "Basic startup profile",
    "Apply to collaborations",
    "Browse startups & opportunities",
];

const PREMIUM_FEATURES = [
    { icon: Infinity, text: "Unlimited opportunity postings" },
    { icon: Zap, text: "Priority visibility for your startup" },
    { icon: Sparkles, text: "Premium founder badge on profile" },
    { icon: Users, text: "Access to exclusive collaborator pool" },
    { icon: BarChart3, text: "Advanced application analytics" },
    { icon: Crown, text: "Early access to new features" },
];

export default function UpgradePage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const isPremium = session?.user?.isPremium;

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseURL}/api/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: session?.user?.email, origin: window.location.origin }),
            });
            const data = await res.json();
            if (data?.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to start checkout. Please try again.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl py-4">
            <DashboardHeading
                title="Upgrade to Premium"
                description="Unlock the full potential of your founder account."
            />

            {isPremium ? (
                <div className="bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Crown className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">You&apos;re already on Premium</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All premium features are active on your account.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Plan</p>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Free</h2>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">$0 <span className="text-sm font-medium text-slate-400">/ month</span></p>
                        </div>
                        <ul className="space-y-2.5 flex-1">
                            {FREE_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                                    <Check className="w-4 h-4 text-slate-400 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 text-xs font-bold text-center cursor-not-allowed">
                            Current Plan
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="relative bg-white dark:bg-slate-950 border-2 border-[#635BFF] rounded-2xl p-6 shadow-md flex flex-col gap-5 overflow-hidden">
                        {/* Badge */}
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#635BFF] text-white text-[10px] font-extrabold uppercase tracking-wider">
                                <Crown className="w-3 h-3" /> Premium
                            </span>
                        </div>

                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#635BFF]/5 rounded-full blur-2xl -z-10" />

                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF] mb-1">Recommended</p>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pro Founder</h2>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                                $9 <span className="text-sm font-medium text-slate-400">/ month</span>
                            </p>
                        </div>

                        <ul className="space-y-2.5 flex-1">
                            {PREMIUM_FEATURES.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    <span className="w-5 h-5 rounded-md bg-[#635BFF]/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-3 h-3 text-[#635BFF]" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center cursor-pointer gap-2 py-2.5 px-4 rounded-xl bg-[#635BFF] hover:bg-[#5249E0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:shadow-[#635BFF]/20 transition-all duration-200 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
                            ) : (
                                <>Upgrade Now <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Secured by Stripe · Cancel anytime
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

