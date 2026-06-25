"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { deleteStartup } from "@/lib/api/startups/actions";
import { Loader2 } from "lucide-react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import toast from "react-hot-toast";
import { myStartup } from "@/lib/api/startups/data";
import MyStartupCard from "@/components/dashboard/MyStartupCard";
import StartupForm from "@/components/dashboard/StartupForm";

export default function MyStartup() {
    const { data: session } = useSession();
    const [startup, setStartup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchStartup = async () => {
            if (!session?.user?.email) return;
            setIsLoading(true);
            try {
                const st = await myStartup(session.user.email);
                setStartup(st);
            } catch (error) {
                console.error("Failed to load startup", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStartup();
    }, [session]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your startup profile? This action cannot be undone.")) return;
        setIsDeleting(true);
        try {
            const res = await deleteStartup(startup._id);
            if (res?.deletedCount > 0) {
                toast.success("Startup Deleted");
                setStartup(null);
            }
        } catch (error) {
            toast.error("Failed to delete startup");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSuccess = (updatedStartup) => {
        setStartup(updatedStartup);
        setIsEditModalOpen(false);
    };

    return (
        <div className="max-w-2xl py-4">
            <DashboardHeading title={"My Startup"} description={"Create and manage your startup profile."} />

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : startup ? (
                <MyStartupCard 
                    startup={startup}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    onEditSuccess={handleSuccess}
                />
            ) : (
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/60 dark:hover:border-slate-800/60 group">
                    <StartupForm onSuccess={handleSuccess} />
                </div>
            )}
        </div>
    );
}
