'use client';
import { Handshake, Users, Rocket } from "lucide-react";
import { motion } from "motion/react";

const reasons = [
    {
        icon: Handshake,
        title: "Vetted Opportunities",
        description:
            "Access to verified startup concepts and qualified founders.",
        featured: true,
    },
    {
        icon: Users,
        title: "Curated Teams",
        description:
            "Find the perfect balance of technical and creative talent.",
        featured: false,
    },
    {
        icon: Rocket,
        title: "Accelerated Growth",
        description:
            "Build faster, launch stronger with dedicated collaborators.",
        featured: false,
    },
];

const stats = [
    { value: "500+", label: "Startups launched" },
    { value: "3,200+", label: "Builders matched" },
    { value: "94%", label: "Founder satisfaction" },
    { value: "40+", label: "Countries represented" },
];

export default function WhyChooseUs() {
    return (
        <section className="relative w-full py-24 overflow-hidden bg-transparent">

            <div className="relative z-10 max-w-5xl mx-auto px-6">

                {/* ─── HEADING ─── */}
                <div className="text-center mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                        Why Choose Us
                    </motion.h2>
                </div>

                {/* ─── THREE CARDS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {reasons.map(({ icon: Icon, title, description, featured }, i) => (
                        <div
                            key={title}
                            className={`
                relative rounded-2xl p-8 flex flex-col gap-6
                transition-transform duration-300 hover:-translate-y-2
                ${featured
                                    ? "bg-slate-900 dark:bg-slate-950 border border-slate-700 shadow-xl"
                                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                                }
              `}
                            style={{
                                animation: `floatCard ${7 + i * 0.8}s ease-in-out infinite`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2
                ${featured
                                    ? "border-slate-600 bg-slate-800"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                }`}
                            >
                                <Icon
                                    className={`h-7 w-7 stroke-[1.25] ${featured ? "text-white" : "text-slate-700 dark:text-slate-300"}`}
                                />
                            </div>

                            {/* Text */}
                            <div className="space-y-2">
                                <h3 className={`text-lg font-bold tracking-tight ${featured ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                    {title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${featured ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 grid sm:grid-cols-2 gap-10 items-center">
                    {/* Left — trust statement */}
                    <div className="space-y-4">
                        <p className="text-[11px] font-semibold tracking-widest uppercase text-pink-600">
                            How it works
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                            From idea to team <br /> in three steps
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                            We stripped out the noise. No lengthy applications, no ghosting, no guesswork about who you're building with.
                        </p>
                    </div>

                    {/* Right — numbered steps */}
                    <div className="space-y-4">
                        {[
                            { n: "01", step: "Post your idea", detail: "Describe what you're building, the roles you need, and what you're offering." },
                            { n: "02", step: "Get matched", detail: "Builders with relevant skills discover your opportunity and apply in minutes." },
                            { n: "03", step: "Start building", detail: "Review profiles, connect directly, and hit the ground running together." },
                        ].map(({ n, step, detail }) => (
                            <div key={n} className="flex gap-4 items-start">
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 pt-0.5 w-6 shrink-0">
                                    {n}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{step}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}