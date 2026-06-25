"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { baseURL } from "@/lib/api/baseUrl";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { User, Code2, FileText, ImageIcon, Loader2, Check, ShieldAlert } from "lucide-react";
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

export default function ProfileForm() {
    const { data: session } = useSession();
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [imgState, setImgState] = useState({ preview: null, url: null, uploading: false, fileName: "" });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const email = session?.user?.email;
        if (!email) return;
        fetch(`${baseURL}/api/users/profile/${email}`)
            .then((r) => r.json())
            .then((data) => {
                reset({ name: data?.name || "", skills: data?.skills || "", bio: data?.bio || "" });
                if (data?.image) setImgState((s) => ({ ...s, preview: data.image, url: data.image }));
                setIsLoading(false);
            });
    }, [session?.user?.email, reset]);

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setGlobalError("Image must be under 2 MB."); return; }
        setGlobalError("");
        setImgState({ preview: URL.createObjectURL(file), url: null, uploading: true, fileName: file.name });
        try {
            const url = await uploadToImgbb(file);
            setImgState({ preview: url, url, uploading: false, fileName: file.name });
            setValue("image", url);
        } catch {
            setImgState((s) => ({ ...s, uploading: false }));
            setGlobalError("Image upload failed. Please try again.");
        }
    };

    const onSubmit = async (data) => {
        const email = session?.user?.email;
        if (!email) return;
        if (imgState.uploading) { setGlobalError("Please wait for the image to finish uploading."); return; }
        setIsSubmitting(true);
        setGlobalError("");
        try {
            const res = await fetch(`${baseURL}/api/users/profile/${email}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, image: imgState.url || undefined }),
            });
            if (!res.ok) throw new Error();
            toast.success("Profile updated successfully!");
        } catch {
            setGlobalError("Failed to save changes. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
    }

    const uploadLabel = imgState.uploading ? "Uploading..."
        : imgState.fileName ? (imgState.fileName.length > 28 ? imgState.fileName.slice(0, 28) + "..." : imgState.fileName)
        : "Choose photo";

    return (
        <div className="max-w-2xl px-6 py-4">
            <DashboardHeading title="My Profile" description="Update your name, photo, skills, and bio." />

            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-900">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                        {imgState.preview ? (
                            <img src={imgState.preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{session?.user?.name}</p>
                        <p className="text-xs text-slate-400">{session?.user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Full Name</label>
                        <div className="relative">
                            <input type="text" placeholder="Your full name" {...register("name", { required: "Name is required" })}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-600" />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        {errors.name && <span className="text-[11px] text-rose-500">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Profile Photo</label>
                        <div className="flex gap-2 items-center">
                            <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                {imgState.preview ? <img src={imgState.preview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="h-4 w-4 text-slate-400" />}
                            </div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imgState.uploading}
                                className={`flex-1 px-3 py-2 text-xs font-bold border rounded-lg transition-all duration-200 text-left truncate shadow-sm flex items-center justify-between ${imgState.url ? "border-emerald-500 bg-emerald-50/10 text-emerald-600 dark:text-emerald-400" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"} disabled:opacity-60 disabled:cursor-not-allowed`}>
                                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                                <span>{imgState.uploading ? <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</span> : uploadLabel}</span>
                                {imgState.url && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400">JPG, PNG or WebP · max 2 MB</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Skills <span className="text-slate-400 font-normal">(comma separated)</span></label>
                        <div className="relative">
                            <input type="text" placeholder="e.g. React, Node.js, Figma, Python" {...register("skills")}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-600" />
                            <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Bio</label>
                        <div className="relative">
                            <textarea rows={4} placeholder="Tell others a bit about yourself..." {...register("bio")}
                                className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-600 resize-none" />
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    {globalError && (
                        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-3 py-2">
                            <ShieldAlert className="h-4 w-4 shrink-0" /><span>{globalError}</span>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting || imgState.uploading}
                        className="w-full mt-1 py-2.5 bg-[#635BFF] hover:bg-[#5249E0] text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                        {isSubmitting ? <><Loader2 className="animate-spin w-4 h-4" /> Saving...</> : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
