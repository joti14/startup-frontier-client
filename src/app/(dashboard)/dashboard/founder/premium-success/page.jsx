export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Upgrade Successful",
    description: "You're now a Premium founder on Startup Frontier.",
};

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getStripe } from '@/lib/stripe';
import { baseURL } from '@/lib/api/baseUrl';
import { Crown, CheckCircle2, ArrowRight, Sparkles, Zap, Infinity } from 'lucide-react';

export default async function PremiumSuccess({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)');

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent'],
    });

    if (session.status === 'open') redirect('/');

    const customerEmail = session?.customer_details?.email || session?.customer_email;

    const paymentData = {
        userEmail: customerEmail,
        transactionId: session?.subscription || session?.payment_intent?.id,
        paymentStatus: session?.payment_status,
        paymentType: 'subscription',
        amount: session?.amount_total / 100,
    };

    try {
        const upgradeRes = await fetch(`${baseURL}/api/users/upgrade-premium/${customerEmail}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        const upgradeData = await upgradeRes.json();
        console.log("[premium-success] upgrade result:", upgradeData);
    } catch (err) {
        console.error("[premium-success] upgrade fetch failed:", err);
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-lg">
                {/* Card */}
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-sm overflow-hidden">

                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#635BFF] via-yellow-400 to-yellow-500" />

                    <div className="p-8 flex flex-col items-center text-center gap-6">

                        {/* Crown icon */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 flex items-center justify-center">
                                <Crown className="w-9 h-9 text-yellow-500 animate-pulse" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                You&apos;re Premium Now!
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                <span className="text-slate-800 dark:text-white font-semibold">{customerEmail}</span> — your account has been upgraded.
                            </p>
                        </div>

                        {/* Perks box */}
                        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 space-y-3 text-left">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">What you unlocked</p>
                            {[
                                { icon: Infinity, text: "Post unlimited opportunities", color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
                                { icon: Zap, text: "Priority visibility for your startup", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
                                { icon: Sparkles, text: "Premium founder badge on your profile", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                            ].map(({ icon: Icon, text, color, bg }) => (
                                <div key={text} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/dashboard/founder"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-[#635BFF] hover:bg-[#5249E0] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:shadow-[#635BFF]/10 transition-all duration-200 active:scale-[0.98]"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <p className="text-[11px] text-slate-400">
                            A confirmation email has been sent to {customerEmail}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}