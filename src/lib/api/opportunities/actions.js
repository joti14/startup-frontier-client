'use server';

import { serverMutation } from "../server";

export const addOpportunity = async (data) => {
    const resData = await serverMutation('/api/opportunities', 'POST', data);
    return resData;
}

export const updateOpportunity = async (data, id) => {
    const resData = await serverMutation(`/api/opportunities/${id}`, 'PATCH', data);
    return resData;
}