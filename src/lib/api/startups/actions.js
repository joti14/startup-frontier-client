import { baseURL } from "../baseUrl";
import { authHeaders } from "../authHeaders";

export const createStartup = async (data) => {
    const res = await fetch(`${baseURL}/api/founder`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const updateStartup = async (data, id) => {
    const res = await fetch(`${baseURL}/api/founder/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const deleteStartup = async (id) => {
    const res = await fetch(`${baseURL}/api/founder/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
};
