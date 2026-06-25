import { roleValidator } from '@/lib/api/session';
import React from 'react';

const CollaboratorLayout = async ({children}) => {
    await roleValidator("collaborator", "admin");
    
    return children;
};

export default CollaboratorLayout;