"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Rocket, 
  PlusCircle, 
  Briefcase, 
  Users2, 
  Crown, 
  LogOut, 
  Home, 
  Sparkles,
  Search,
  FileText,
  Bookmark,
  User
} from "lucide-react";
import { Logo } from "../Logo";

export default function DashboardSideBar({ onPremiumTrigger }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role || "founder";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const founderMenuItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/founder" },
    { key: "startup", label: "My Startup", icon: Rocket, href: "/dashboard/founder/startup" },
    { key: "add-opportunity", label: "Add Opportunity", icon: PlusCircle, href: "/dashboard/founder/add-opportunity" },
    { key: "opportunities", label: "Manage Opportunities", icon: Briefcase, href: "/dashboard/founder/opportunities" },
    { key: "applications", label: "Applications", icon: Users2, href: "/dashboard/founder/applications" },
  ];

  const collaboratorMenuItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/collaborator" },
    { key: "browse", label: "Browse Opportunities", icon: Search, href: "/dashboard/collaborator/opportunities" },
    { key: "applications", label: "My Applications", icon: FileText, href: "/dashboard/collaborator/applications" },
    { key: "saved", label: "Saved Startups", icon: Bookmark, href: "/dashboard/collaborator/saved" },
    { key: "profile", label: "Profile", icon: User, href: "/dashboard/collaborator/profile" },
  ];

  const menuItems = userRole === "founder" ? founderMenuItems : userRole === "collaborator" ? collaboratorMenuItems : userRole === "admin" ? adminMenu : null;

  return (
    <aside className="w-64 h-screen border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-col z-20 shrink-0 overflow-hidden">
      
      {/* ─── BRAND LOGO BLOCK  ─── */}
      <div className="px-6 h-15 border-b border-slate-100 dark:border-slate-900 flex items-center gap-2.5 shrink-0">
        <Logo />
      </div>

      {/* ─── USER IDENTIFICATION BLOCK ─── */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/15 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950 shadow-inner flex items-center justify-center">
            <Image
              width={40}
              height={40}
              src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}&background=635BFF&color=fff&bold=true`}
              alt="Avatar Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-slate-900 dark:text-slate-100 text-xs font-bold truncate leading-tight">
              {session?.user?.name || "Frontier User"}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#818CF8] mt-0.5">
              {userRole === "founder" ? "🚀 Founder" : "🤝 Collaborator"}
            </span>
          </div>
        </div>
      </div>

      {/* ─── INTERACTIVE NAVIGATION  ─── */}
      <nav className="grow overflow-y-auto px-3 py-5 space-y-1 custom-scrollbar">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-3 pb-2">Workspace</p>
        {menuItems.map(({ key, label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={key}
              href={href}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 text-left cursor-pointer group ${
                isActive 
                  ? "bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#4F46E5]/15 dark:text-[#818CF8]" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive 
                  ? "bg-[#635BFF] text-white" 
                  : "bg-slate-100 text-slate-400 dark:bg-slate-900 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              }`}>
                <Icon size={15} />
              </span>
              <span className="flex-1 truncate">{label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />}
            </Link>
          );
        })}
      </nav>

      {/* ─── FOOTER LINK ACTIONS BLOCK ─── */}
      <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-900 space-y-1 shrink-0 bg-white dark:bg-slate-950">

        {/* Back home pointer */}
        <Link href="/" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-200">
          <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center shrink-0">
            <Home size={14} />
          </span>
          Back to Site
        </Link>

        {/* User security exit profile */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center shrink-0">
            <LogOut size={14} />
          </span>
          Sign Out
        </button>
      </div>

    </aside>
  );
}