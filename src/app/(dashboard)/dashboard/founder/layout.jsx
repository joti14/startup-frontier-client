import { roleValidator } from '@/lib/api/session';
import React from 'react';

const CollaboratorLayout = async ({children}) => {
    await roleValidator("founder");
    
    return children;
};

export default CollaboratorLayout;