import DashboardHeading from "@/components/dashboard/DashboardHeading";
import UpgradePremiumButton from "@/components/UpgradePremiumButton";
import { getUser } from "@/lib/api/session";
import { Briefcase, Users2, UserCheck, Crown } from "lucide-react";

export default async function FounderOverviewPage() {
  const stats = {
    totalOpportunities: 8,
    totalApplications: 142,
    acceptedMembers: 12,
  };

 const user = await getUser();
  const isPremium = user?.isPremium;



  return (
    <div className="space-y-6 mt-6 px-6">
      
      <DashboardHeading title={"Overview"} description={"Monitor your active roles, track incoming applications, and scale your team."} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Opportunities Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-800/80 flex items-center justify-between group">
          <div className="space-y-1 text-left">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              Total Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.totalOpportunities}
            </h2>
          </div>
          <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/20 text-[#4F46E5] dark:text-[#818CF8] rounded-xl border border-indigo-100/30 dark:border-indigo-900/30 transition-transform duration-200 group-hover:scale-105">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-800/80 flex items-center justify-between group">
          <div className="space-y-1 text-left">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              Total Applications
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.totalApplications}
            </h2>
          </div>
          <div className="p-3.5 bg-[#EEF2FF] dark:bg-[#4F46E5]/10 text-[#635BFF] dark:text-[#a5b4fc] rounded-xl border border-indigo-100/20 dark:border-indigo-900/20 transition-transform duration-200 group-hover:scale-105">
            <Users2 size={22} />
          </div>
        </div>

        {/* Accepted Members Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-800/80 flex items-center justify-between group">
          <div className="space-y-1 text-left">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              Accepted Members
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.acceptedMembers}
            </h2>
          </div>
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100/30 dark:border-emerald-900/30 transition-transform duration-200 group-hover:scale-105">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {!isPremium ? (
        <div className="bg-white dark:bg-slate-950 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-8 shadow-sm bg-gradient-to-r from-amber-500/[0.02] via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
          <div className="space-y-2 text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown size={16} className="text-amber-500 fill-amber-500/20" /> 
              Unlock Unlimited Opportunity Postings
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xl leading-relaxed">
              Standard founder accounts are limited to listing <strong>3 roles</strong> simultaneously. Upgrade to our Premium tier for <strong>$49.99</strong> to host infinite team opportunities.
              </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <UpgradePremiumButton  />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-8 shadow-sm bg-gradient-to-r from-emerald-500/[0.02] via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown size={16} className="text-emerald-500 fill-emerald-500/10" /> 
              Premium Membership Active
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xl leading-relaxed">
              Your ecosystem constraints have been lifted. You can now post unlimited active roles to scale your dream startup.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}