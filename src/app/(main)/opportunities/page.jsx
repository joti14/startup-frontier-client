import BrowseOpportunities from "@/components/BrowseOpportunities";

export const metadata = {
    title: "Browse Opportunities | Startup Frontier",
    description: "Explore open roles at early-stage startups. Filter by work type, industry, and more.",
};

export default function OpportunitiesPage() {
    return (
        <BrowseOpportunities
            heading={
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Browse Opportunities</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Discover open roles at early-stage startups looking for talented collaborators.
                    </p>
                </div>
            }
        />
    );
}
