import BrowseOpportunities from "@/components/BrowseOpportunities";
import DashboardHeading from "@/components/dashboard/DashboardHeading";

export default function BrowseOpportunitiesPage() {
    return (
        <BrowseOpportunities
            heading={
                <DashboardHeading
                    title="Browse Opportunities"
                    description="Find the perfect role to match your skills and aspirations."
                />
            }
        />
    );
}
