import { baseURL } from "../baseUrl";

export const createStartup = async (data) => {
    const res = await fetch(`${baseURL}/api/founder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const updateStartup = async (data, id) => {
    const res = await fetch(`${baseURL}/api/founder/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const deleteStartup = async (id) => {
    const res = await fetch(`${baseURL}/api/founder/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) return null;
    return res.json();
};