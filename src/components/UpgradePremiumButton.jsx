'use client';

import Link from 'next/link';

const UpgradePremiumButton = () => {
    return (
        <Link
            href="/dashboard/founder/upgrade"
            className="w-full md:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-amber-600/10 transition-all duration-200 active:scale-[0.99] inline-block text-center"
        >
            Upgrade Now
        </Link>
    );
};

export default UpgradePremiumButton;