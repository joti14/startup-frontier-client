import { baseURL } from "../baseUrl";

export const addOpportunity = async (data) => {
    const res = await fetch(`${baseURL}/api/opportunities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updateOpportunity = async (data, id) => {
    const res = await fetch(`${baseURL}/api/opportunities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const deleteOpportunity = async (id) => {
    const res = await fetch(`${baseURL}/api/opportunities/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) return null;
    return res.json();
};