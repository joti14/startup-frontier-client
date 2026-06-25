import { roleValidator } from '@/lib/api/session';
import React from 'react';

export const metadata = {
    title: {
        template: "%s | Founder — Startup Frontier",
        default: "Founder Dashboard | Startup Frontier",
    },
};

const CollaboratorLayout = async ({children}) => {
    await roleValidator("founder", "admin");
    
    return children;
};

export default CollaboratorLayout;