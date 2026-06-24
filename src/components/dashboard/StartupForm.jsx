"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "@/lib/auth-client";
import { createStartup, updateStartup } from "@/lib/api/startups/actions";
import {
    Rocket,
    Building2,
    FileText,
    Mail,
    Image as ImageIcon,
    Loader2,
    Layers,
    ShieldAlert,
    Check,
    Users
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

async function uploadToImgbb(file) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.data.url;
}

export default function StartupForm({ existingStartup, onSuccess }) {
    const fileInputRef = useRef(null);
    const { data: session } = useSession();
    const [logoState, setLogoState] = useState({ file: null, preview: null, url: null, state: "idle" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            startupName: "",
            industry: "",
            description: "",
            fundingStage: "Pre-seed",
            founderEmail: "",
            logoUrl: "",
            teamSizeNeeded: ""
        }
    });

    useEffect(() => {
        if (session?.user?.email) {
            setValue("founderEmail", session.user.email);
        }
    }, [session, setValue]);

    useEffect(() => {
        if (existingStartup) {
            reset({
                startupName: existingStartup.startupName || "",
                industry: existingStartup.industry || "",
                description: existingStartup.description || "",
                fundingStage: existingStartup.fundingStage || "Pre-seed",
                founderEmail: existingStartup.founderEmail || session?.user?.email || "",
                logoUrl: existingStartup.logoUrl || "",
                teamSizeNeeded: existingStartup.teamSizeNeeded || ""
            });
        }
    }, [existingStartup, reset]);

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) return setGlobalError("Logo must be under 2 MB.");

        setGlobalError("");
        setLogoState({ file, preview: URL.createObjectURL(file), url: null, state: "uploading" });

        try {
            const url = await uploadToImgbb(file);
            setLogoState((prev) => ({ ...prev, url, state: "done" }));
            setValue("logoUrl", url);
        } catch (err) {
            setLogoState((prev) => ({ ...prev, state: "error" }));
            setGlobalError("Logo connection asset stream upload failed.");
        }
    };

    const onSubmitForm = async (data) => {
        if (logoState.state === "uploading") {
            return setGlobalError("Please wait for your startup brand logo to finish uploading.");
        }

        setIsSubmitting(true);
        setGlobalError("");

        const startupData = {
            startupName: data.startupName,
            logoUrl: data.logoUrl,
            industry: data.industry,
            description: data.description,
            fundingStage: data.fundingStage,
            founderEmail: session?.user?.email || data.founderEmail,
            teamSizeNeeded: data.teamSizeNeeded ? parseInt(data.teamSizeNeeded, 10) : 0,
        };

        try {
            if (existingStartup) {
                const updatedRes = await updateStartup(startupData, existingStartup._id);
                if (updatedRes?.modifiedCount > 0 || updatedRes?.matchedCount > 0) {
                    toast.success('Startup Profile Updated');
                    if(onSuccess) onSuccess({ ...startupData, _id: existingStartup._id, status: existingStartup.status || 'pending' });
                }
            } else {
                const resData = await createStartup(startupData);
                if (resData?.insertedId) {
                    toast.success("Startup Added");
                    if(onSuccess) onSuccess({ ...startupData, _id: resData.insertedId, status: 'pending' });
                }
            }
        } catch (err) {
            setGlobalError("Could not save profile setup. Verify network state.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadLabel =
        logoState.state === "uploading"
            ? "Uploading..."
            : logoState.state === "done"
                ? logoState.file?.name?.length > 25
                    ? logoState.file.name.slice(0, 25) + "..."
                    : logoState.file?.name
                : logoState.state === "error"
                    ? "Upload failed"
                    : "Choose logo";

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">
            {/* Startup Name & Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Startup Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. Stripe, Acme Corp"
                            {...register("startupName", { required: "Startup name is required" })}
                            className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30"
                        />
                        <Rocket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.startupName && <span className="text-[11px] font-medium text-rose-500">{errors.startupName.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Startup Logo</label>
                    <div className="flex gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                            {logoState.preview ? (
                                <img src={logoState.preview} alt="Startup Logo Preview" className="w-full h-full object-cover" />
                            ) : existingStartup?.logoUrl && logoState.state === "idle" ? (
                                <img src={existingStartup.logoUrl} alt="Startup Logo Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-1 px-3 py-2 text-xs font-bold border rounded-lg transition-all duration-200 text-left truncate shadow-sm flex items-center justify-between ${logoState.state === "done"
                                    ? "border-emerald-500 bg-emerald-50/10 text-emerald-600 dark:text-emerald-400"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                        >
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoChange} />
                            <span>{uploadLabel}</span>
                            {logoState.state === "done" && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Industry & Funding Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Industry</label>
                    <Controller
                        name="industry"
                        control={control}
                        rules={{ required: "Industry type is required" }}
                        render={({ field }) => (
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                </div>
                                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                                    <SelectTrigger className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                        <SelectItem value="Technology" className="text-xs">Technology</SelectItem>
                                        <SelectItem value="FinTech" className="text-xs">FinTech</SelectItem>
                                        <SelectItem value="HealthTech" className="text-xs">HealthTech</SelectItem>
                                        <SelectItem value="EdTech" className="text-xs">EdTech</SelectItem>
                                        <SelectItem value="E-commerce" className="text-xs">E-commerce</SelectItem>
                                        <SelectItem value="Artificial Intelligence" className="text-xs">Artificial Intelligence</SelectItem>
                                        <SelectItem value="SaaS" className="text-xs">SaaS</SelectItem>
                                        <SelectItem value="CleanTech" className="text-xs">CleanTech</SelectItem>
                                        <SelectItem value="Gaming" className="text-xs">Gaming</SelectItem>
                                        <SelectItem value="Real Estate" className="text-xs">Real Estate</SelectItem>
                                        <SelectItem value="Food & Beverage" className="text-xs">Food & Beverage</SelectItem>
                                        <SelectItem value="Transportation" className="text-xs">Transportation</SelectItem>
                                        <SelectItem value="Media & Entertainment" className="text-xs">Media & Entertainment</SelectItem>
                                        <SelectItem value="Cybersecurity" className="text-xs">Cybersecurity</SelectItem>
                                        <SelectItem value="Blockchain" className="text-xs">Blockchain</SelectItem>
                                        <SelectItem value="Other" className="text-xs">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                    {errors.industry && <span className="text-[11px] font-medium text-rose-500">{errors.industry.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Funding Stage</label>
                    <Controller
                        name="fundingStage"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <Layers className="h-4 w-4 text-slate-400" />
                                </div>
                                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                                    <SelectTrigger className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto">
                                        <SelectValue placeholder="Select funding stage" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                        <SelectItem value="Pre-seed" className="text-xs">Pre-seed</SelectItem>
                                        <SelectItem value="Seed" className="text-xs">Seed</SelectItem>
                                        <SelectItem value="Series A" className="text-xs">Series A</SelectItem>
                                        <SelectItem value="Series B+" className="text-xs">Series B+</SelectItem>
                                        <SelectItem value="Bootstrapped" className="text-xs">Bootstrapped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Founder Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Founder Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            readOnly
                            {...register("founderEmail", {
                                required: "Contact email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email formatting" }
                            })}
                            className="w-full bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none cursor-not-allowed"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.founderEmail && <span className="text-[11px] font-medium text-rose-500">{errors.founderEmail.message}</span>}
                </div>

                {/* Team Size Needed */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Team Size Needed</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            placeholder="e.g. 2"
                            {...register("teamSizeNeeded", { required: "Team size needed is required" })}
                            className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30"
                        />
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.teamSizeNeeded && <span className="text-[11px] font-medium text-rose-500">{errors.teamSizeNeeded.message}</span>}
                </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Description</label>
                <div className="relative">
                    <textarea
                        rows={3}
                        placeholder="Provide a high-impact overview of what your startup is building..."
                        {...register("description", { required: "A brief startup profile description is required" })}
                        className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 resize-none"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
                {errors.description && <span className="text-[11px] font-medium text-rose-500">{errors.description.message}</span>}
            </div>

            {/* Global Notifications */}
            {globalError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-3 py-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{globalError}</span>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 bg-[#635BFF] hover:bg-[#5249E0] text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#635BFF]/10 active:scale-[0.995] disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Saving Workspace...</span>
                    </>
                ) : (
                    <span>{existingStartup ? "Save Changes" : "Create Startup Profile ✨"}</span>
                )}
            </button>
        </form>
    );
}
