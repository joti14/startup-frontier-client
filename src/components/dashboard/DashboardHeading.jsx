import React from 'react';

const DashboardHeading = ({ title, description }) => {
    return (
        <div>
            <div className='flex flex-col gap-1 text-left pb-2'>
                <h1 className='text-2xl font-bold text-slate-900 dark:text-white tracking-tight'>
                    {title}
                </h1>
                <p className='text-xs text-slate-400 dark:text-slate-500'>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default DashboardHeading;