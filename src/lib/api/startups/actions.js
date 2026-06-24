import { baseURL } from "../baseUrl";

export const createStartup = async (data) => {
    console.log("[createStartup] sending data:", data);
    const res = await fetch(`${baseURL}/api/founder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.text();
        console.error("[createStartup] server error:", res.status, err);
        return null;
    }
    const result = await res.json();
    console.log("[createStartup] result:", result);
    return result;
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