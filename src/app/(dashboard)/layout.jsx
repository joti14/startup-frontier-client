"use client";

import DashboardSideBar from '@/components/dashboard/DashboardSidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='fixed inset-0 flex overflow-hidden bg-slate-50 dark:bg-[#090d16]'>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <DashboardSideBar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <main className='flex-1 overflow-y-auto min-w-0'>
                {/* Mobile top bar */}
                <div className='lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800'>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className='p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                    >
                        <Menu className='w-5 h-5' />
                    </button>
                    <span className='text-sm font-bold text-slate-900 dark:text-white'>Dashboard</span>
                </div>

                <div className='px-4 sm:px-6 py-6 max-w-6xl mx-auto'>
                    {children}
                </div>
            </main>
        </div>
    );
}
