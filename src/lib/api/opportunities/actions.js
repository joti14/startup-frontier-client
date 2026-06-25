import { baseURL } from "../baseUrl";
import { authHeaders } from "../authHeaders";

export const addOpportunity = async (data) => {
    const res = await fetch(`${baseURL}/api/opportunities`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updateOpportunity = async (data, id) => {
    const res = await fetch(`${baseURL}/api/opportunities/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const deleteOpportunity = async (id) => {
    const res = await fetch(`${baseURL}/api/opportunities/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
};
