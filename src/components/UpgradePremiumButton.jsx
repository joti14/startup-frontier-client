'use client';

const UpgradePremiumButton = () => {
    const updateToPremium = async () => {
        const res = await fetch('/api/checkout_sessions', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        });
        const data = await res.json();
        if(data?.url) {
            window.location.href = data.url;
        }
    }
    return (
        <div>
            <button
                onClick={updateToPremium}
                type="button"
                className="w-full md:w-auto px-5 py-2.5 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-amber-600/10 transition-all duration-200 active:scale-[0.99]"
            >
                Upgrade Now
            </button>
        </div>
    );
};

export default UpgradePremiumButton;