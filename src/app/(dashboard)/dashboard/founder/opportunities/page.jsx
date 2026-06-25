import DashboardHeading from '@/components/dashboard/DashboardHeading';
import ManageOpportunity from './ManageOpportunity';

const ManageOpportunities = () => {
    return (
        <div className="max-w-5xl py-4">
            <DashboardHeading title={"Manage Opportunities"} description={"View, edit, or remove your posted roles."} />
            <ManageOpportunity opportunities={[]} />
        </div>
    );
};

export default ManageOpportunities;

