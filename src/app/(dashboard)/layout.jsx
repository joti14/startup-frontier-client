import DashboardSideBar from '@/components/dashboard/DashboardSidebar';
import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div className='h-screen flex overflow-hidden bg-slate-50 dark:bg-[#090d16]'>
            <DashboardSideBar />
            
            <main className='flex-1 overflow-y-auto'>
                <div className='px-6 py-6 max-w-6xl mx-auto'>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;