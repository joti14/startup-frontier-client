import { serverMutation } from "../server";

export const createStartup = async (data) => {
    const resData = await serverMutation('/api/founder', 'POST', data);
    return resData;
}