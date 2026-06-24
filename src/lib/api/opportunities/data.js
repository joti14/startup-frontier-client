'use server';

import { serverFetch } from "../server";

export const myOpportunities = async (email) => {
    const result = await serverFetch(`/api/opportunities/${email}`);
    return result;
};
