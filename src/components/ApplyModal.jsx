"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { applyForOpportunity } from "@/lib/api/applications/actions";
import { useSession } from "@/lib/auth-client";
import { Loader2, FileText, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplyModal({ opportunity, startup }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            coverLetter: "",
            resumeLink: ""
        }
    });

    const onSubmit = async (data) => {
        if (!session?.user?.email) {
            setGlobalError("You must be logged in to apply.");
            return;
        }

        setIsSubmitting(true);
        setGlobalError("");

        const applicationData = {
            opportunityId: opportunity._id,
            opportunityTitle: opportunity.roleTitle,
            startupId: startup._id,
            startupName: startup.startupName,
            founderEmail: startup.founderEmail,
            applicantEmail: session.user.email,
            applicantName: session.user.name || "Unknown",
            coverLetter: data.coverLetter,
            resumeLink: data.resumeLink,
        };

        console.log("[ApplyModal] Submitting application:", applicationData);

        try {
            const res = await applyForOpportunity(applicationData);
            console.log("[ApplyModal] Response:", res);
            if (res?.insertedId) {
                toast.success("Application submitted successfully!");
                setIsOpen(false);
                reset();
            } else {
                console.error("[ApplyModal] No insertedId in response:", res);
                setGlobalError("Failed to submit application. Please try again.");
            }
        } catch (err) {
            console.error("[ApplyModal] Error:", err);
            setGlobalError("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOwner = session?.user?.email && session.user.email === startup.founderEmail;
    const isFounder = session?.user?.role === "founder";
    const cannotApply = isOwner || isFounder;

    if (!session?.user) {
        return (
            <Button
                onClick={() => router.push(`/login?redirect=/opportunities/${opportunity._id}`)}
                className="w-full sm:w-auto bg-[#635BFF] hover:bg-[#5249E0] text-white"
            >
                Apply Now
            </Button>
        );
    }

    if (cannotApply) {
        return (
            <div className="flex flex-col items-end gap-1">
                <Button disabled className="w-full sm:w-auto cursor-not-allowed opacity-60">Apply Now</Button>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {isOwner ? "You own this startup." : "Founders cannot apply to opportunities."}
                </p>
            </div>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-[#635BFF] hover:bg-[#5249E0] text-white">Apply Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Apply for {opportunity.roleTitle}</DialogTitle>
                </DialogHeader>
                <div className="pt-2">
                    <p className="text-sm text-slate-500 mb-4">
                        You are applying to join <span className="font-semibold">{startup.startupName}</span> as a <span className="font-semibold">{opportunity.roleTitle}</span>.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Cover Letter</label>
                            <div className="relative">
                                <textarea
                                    rows={4}
                                    placeholder="Why are you a great fit for this role?"
                                    {...register("coverLetter", { required: "Cover letter is required" })}
                                    className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 resize-none"
                                />
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.coverLetter && <span className="text-[11px] font-medium text-rose-500">{errors.coverLetter.message}</span>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Resume / Portfolio Link</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    placeholder="https://your-portfolio.com"
                                    {...register("resumeLink", { required: "Resume/Portfolio link is required" })}
                                    className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30"
                                />
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                            {errors.resumeLink && <span className="text-[11px] font-medium text-rose-500">{errors.resumeLink.message}</span>}
                        </div>

                        {globalError && (
                            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-3 py-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{globalError}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#635BFF] hover:bg-[#5249E0] text-white"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Submit Application
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
