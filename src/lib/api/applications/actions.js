import { baseURL } from "../baseUrl";
import { authHeaders } from "../authHeaders";

export const applyForOpportunity = async (data) => {
    const res = await fetch(`${baseURL}/api/applications`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const updateApplicationStatus = async (id, status) => {
    const res = await fetch(`${baseURL}/api/applications/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ status }),
    });
    if (!res.ok) return null;
    return res.json();
};
