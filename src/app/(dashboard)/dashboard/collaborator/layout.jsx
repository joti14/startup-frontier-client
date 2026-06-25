import { roleValidator } from '@/lib/api/session';
import React from 'react';

export const metadata = {
    title: {
        template: "%s | Collaborator — Startup Frontier",
        default: "Collaborator Dashboard | Startup Frontier",
    },
};

const CollaboratorLayout = async ({children}) => {
    await roleValidator("collaborator", "admin");
    
    return children;
};

export default CollaboratorLayout;