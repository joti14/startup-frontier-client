"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Edit, Trash2, Loader2 } from "lucide-react";
import StartupCard from "@/components/StartupCard";
import StartupForm from "./StartupForm";

export default function MyStartupCard({ startup, isDeleting, handleDelete, isEditModalOpen, setIsEditModalOpen, onEditSuccess }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg shrink-0">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Pending Approval</h4>
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">Your startup is pending, admin approval needs before it appears publicly.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mb-2">
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-500 hover:text-[#635BFF] hover:border-[#635BFF]/30 transition-all shadow-sm">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Startup Profile</DialogTitle>
                        </DialogHeader>
                        <div className="pt-2">
                            <StartupForm existingStartup={startup} onSuccess={onEditSuccess} />
                        </div>
                    </DialogContent>
                </Dialog>
                
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>Delete</span>
                </button>
            </div>
            
            <StartupCard startup={startup} />
        </div>
    );
}
