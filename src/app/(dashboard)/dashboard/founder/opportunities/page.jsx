import DashboardHeading from '@/components/dashboard/DashboardHeading';
import { myOpportunities } from '@/lib/api/opportunities/data';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import ManageOpportunity from './ManageOpportunity';

const ManageOpportunities = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    const opportunities = await myOpportunities(session?.user?.email);

    return (
        <div className="max-w-5xl px-6 py-4">
            <DashboardHeading title={"Manage Opportunities"} description={"View, edit, or remove your posted roles."} />
            <ManageOpportunity opportunities={opportunities} />
        </div>
    );
};

export default ManageOpportunities;
