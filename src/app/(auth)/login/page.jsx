"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authClient, signIn } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = watch("email") || "";
  const password = watch("password") || "";

  const handleGoogleLogin = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/founder",
      });
    } catch (err) {
      const message = err?.message || "Google sign-in failed.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormReady = email.includes("@") && password.length >= 6 && !isSubmitting;

  const onSubmit = async (data) => {
    if (!isFormReady) return;

    setIsSubmitting(true);
    setSubmitError("");

    const { data: authData, error: authError } = await signIn.email({
      email: data.email.trim(),
      password: data.password,
    });

    if (authError) {
      setSubmitError(authError.message ?? "Invalid email or password.");
      setIsSubmitting(false);
    } else {
      toast.success('Login Successful');
      const userRole = authData?.user?.role || "founder";
      router.push(userRole === "founder" ? "/dashboard/founder" : "/dashboard/collaborator");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-indigo-100/40 dark:bg-indigo-950/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-purple-100/30 dark:bg-purple-950/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 group">
        {/* Card Wrapper */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-8 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-slate-200/60 dark:group-hover:border-slate-800/60">
          
          {/* Logo Branding */}
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#635BFF] rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-[#635BFF]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">StartupFrontier</span>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-xs text-center text-slate-400 mt-1 mb-6">Sign in to continue building your startup</p>

          {/* Social Authentication */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] mb-5 h-auto"
          >
            <FcGoogle className="h-4 w-4 mr-2.5" />
            Continue with Google
          </Button>

          {/* Section Splitter */}
          <div className="flex items-center gap-3 my-5 text-[11px] font-medium text-slate-400">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
            <span>or sign in with email</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
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

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-400">Password</Label>
                <Link href="/forgot-password" className="text-[11px] font-medium text-[#635BFF] hover:underline transition-all">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs font-medium placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 dark:focus:border-slate-600 focus:bg-slate-50/30 dark:focus:bg-slate-900/30 h-auto"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔒</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-rose-500">{errors.password.message}</span>}
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
              disabled={!isFormReady}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm h-auto ${isFormReady ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 hover:shadow-md active:scale-[0.995]" : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 cursor-not-allowed"}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-xs font-medium text-slate-400 mt-6">
            Don't have an account? <Link href="/register" className="text-[#635BFF] font-bold hover:underline ml-0.5 transition-all">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}