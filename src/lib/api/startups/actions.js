'use server';

import { serverMutation } from "../server";

export const createStartup = async (data) => {
    const resData = await serverMutation('/api/founder', 'POST', data);
    return resData;
}

export const updateStartup = async (data, id) => {
    const resData = await serverMutation(`/api/founder/${id}`, 'PATCH', data);
    return resData;
}

export const deleteStartup = async (id) => {
    const resData = await serverMutation(`/api/founder/${id}`, 'DELETE');
    return resData;
}