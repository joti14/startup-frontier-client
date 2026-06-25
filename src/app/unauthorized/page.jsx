import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
    title: "Access Denied | Startup Frontier",
    description: "You don't have permission to view this page.",
};

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#090d16] px-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Access Denied</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
                You don&apos;t have permission to view this page.
            </p>
            <Link href="/" className="mt-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249E0] text-white rounded-xl text-sm font-bold transition-colors">
                Go Home
            </Link>
        </div>
    );
}
