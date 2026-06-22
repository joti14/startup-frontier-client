import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div className='min-h-screen flex'>
            <aside className='w-64 h-screen border-r'>
                sidebar
            </aside>
            <div>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;