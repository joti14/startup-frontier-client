"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authClient, signIn } from "@/lib/auth-client";
import { User, Eye, EyeOff, Loader2, ShieldAlert, Check, Sparkles, Rocket, Users } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import toast from "react-hot-toast";
import { uploadToImgbb } from "@/utils/uploadImage";

// PASSWORD RULE COMPONENT  
function PasswordRule({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-200 ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${ok ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400" : "border-slate-200 dark:border-slate-800"}`}>
        {ok ? <Check className="w-2 h-2" strokeWidth={3} /> : <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />}
      </span>
      {label}
    </span>
  );
}

// ─── MAIN REGISTER COMPONENT ─────
export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "founder",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [photo, setPhoto] = useState({ file: null, preview: null, url: null, state: "idle" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = watch("password") || "";
  const role = watch("role");
  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";
  const email = watch("email") || "";

  // ─── VALIDATION ──────────────────────────────────────────────────────────
  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };
  const allRulesPass = rules.length && rules.upper && rules.lower;
  const isFormReady = firstName.trim() && lastName.trim() && email.includes("@") && allRulesPass && !isSubmitting && photo.state !== "uploading";

  // ─── DYNAMIC LABELS FOR UPLOAD ZONE ──────────────────────────────────────
  const uploadLabel =
    photo.state === "uploading"
      ? "Uploading..."
      : photo.state === "done"
        ? photo.file?.name?.length > 22
          ? photo.file.name.slice(0, 22) + "..."
          : photo.file?.name
        : photo.state === "error"
          ? "Upload failed - try again"
          : "Choose photo or drag & drop";

  // ─── HANDLERS ────────────────────────────────────────────────────────────
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSubmitError("Photo must be under 2 MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSubmitError("Only JPG, PNG, or WEBP allowed.");
      return;
    }

    setSubmitError("");
    setPhoto({ file, preview: URL.createObjectURL(file), url: null, state: "uploading" });

    try {
      console.log("Starting upload to ImgBB...");
      const url = await uploadToImgbb(file);
      console.log("Upload successful, URL:", url);
      setPhoto((prev) => ({ ...prev, url, state: "done" }));
      toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      setPhoto((prev) => ({ ...prev, state: "error", url: null }));
      setSubmitError(err.message || "Photo upload failed. Please try again.");
      toast.error("Photo upload failed");
    }
  };

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log('Photo state:', photo);

    if (!isFormReady) {
      console.log('Form not ready');
      return;
    }

    if (photo.state === "uploading") {
      setSubmitError("Please wait for photo upload to complete.");
      return;
    }

    // If photo was selected but upload failed, don't proceed
    if (photo.file && photo.state === "error") {
      setSubmitError("Photo upload failed. Please try uploading again or remove the photo.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const imageUrl = photo.url || "";

    console.log('Submitting with image URL:', imageUrl);

    const { error: authError } = await authClient.signUp.email({
      name: fullName,
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      image: imageUrl,
    });

    if (authError) {
      console.error('Auth error:', authError);
      setSubmitError(authError.message ?? "Something went wrong.");
      setIsSubmitting(false);
    } else {
      console.log('Account created successfully');
      toast.success('Successfully Created Account');
      router.push(data.role === "founder" ? "/dashboard/founder" : "/dashboard/collaborator");
    }
  };

  const handleGoogleRegister = async () => {
    setSubmitError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/founder",
      });
    } catch (err) {
      const message = err?.message || "Google sign-in failed.";
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-indigo-100/40 dark:bg-indigo-950/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-purple-100/30 dark:bg-purple-950/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10 group">
        {/* Card Wrapper */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-8 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-slate-200/60 dark:group-hover:border-slate-800/60">

          {/* Logo Branding */}
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <Logo link={false} />
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white tracking-tight">Create your account</h1>
          <p className="text-xs text-center text-slate-400 mt-1 mb-6">Join thousands of founders and collaborators building together.</p>

          {/* Social Authentication */}
          <Button
            type="button"
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] mb-5 h-auto"
          >
            <FcGoogle className="h-4 w-4 mr-2.5" />
            Continue with Google
          </Button>

          {/* Section Splitter */}
          <div className="flex items-center gap-3 my-5 text-[11px] font-medium text-slate-400">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
            <span>or sign up with email</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">I WANT TO</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue("role", "founder")}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${role === 'founder' ? 'border-[#635BFF] bg-[#EEF2FF] dark:bg-[#635BFF]/10' : 'border-slate-200 cursor-pointer dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'}`}
                >
                  <Rocket className={`w-5 h-5 mb-2 mx-auto ${role === 'founder' ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                  <div className={`text-xs font-bold ${role === 'founder' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>Post a startup</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Recruit collaborators</div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("role", "collaborator")}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${role === 'collaborator' ? 'border-[#635BFF] bg-[#EEF2FF] dark:bg-[#635BFF]/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 cursor-pointer dark:hover:border-slate-700 bg-white dark:bg-slate-900'}`}
                >
                  <Users className={`w-5 h-5 mb-2 mx-auto ${role === 'collaborator' ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                  <div className={`text-xs font-bold ${role === 'collaborator' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>Find opportunities</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Join a startup</div>
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700 dark:text-slate-400">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                  className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto"
                />
                {errors.firstName && <span className="text-[10px] text-rose-500">{errors.firstName.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700 dark:text-slate-400">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name is required" })}
                  className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto"
                />
                {errors.lastName && <span className="text-[10px] text-rose-500">{errors.lastName.message}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-400">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                  className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">✉</span>
              </div>
              {errors.email && <span className="text-[10px] text-rose-500">{errors.email.message}</span>}
            </div>

            {/* Profile Photo Upload */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Profile Photo <span className="text-slate-400 font-normal">(via imgbb)</span></Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${photo.state === "error"
                    ? "border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {photo.preview ? (
                    <img src={photo.preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold ${photo.state === "error"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-[#635BFF] dark:text-[#818CF8]"
                    }`}>
                    {uploadLabel}
                  </div>
                  <div className="text-[10px] text-slate-400">PNG, JPG, WEBP - max 2 MB</div>
                </div>
                {photo.state === "done" && (
                  <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/30 px-2 py-1 rounded-full">✓ Uploaded</div>
                )}
                {photo.state === "uploading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-[#635BFF]" />
                )}
                {photo.state === "idle" && (
                  <div className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Optional</div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-400">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔒</span>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-rose-500">{errors.password.message}</span>}
              {password && (
                <div className="flex gap-3 pt-1">
                  <PasswordRule ok={rules.length} label="6+ chars" />
                  <PasswordRule ok={rules.upper} label="Uppercase" />
                  <PasswordRule ok={rules.lower} label="Lowercase" />
                </div>
              )}
            </div>

            {/* Error Alert */}
            {submitError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-3 py-2">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormReady || photo.state === "uploading"}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm h-auto ${isFormReady && photo.state !== "uploading" ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 hover:shadow-md active:scale-[0.995]" : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed"}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Creating Account...</span>
                </>
              ) : photo.state === "uploading" ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Uploading Photo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create account</span>
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs font-medium text-slate-400 mt-6">
            Already have an account? <Link href="/login" className="text-[#635BFF] font-bold hover:underline ml-0.5 transition-all">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}