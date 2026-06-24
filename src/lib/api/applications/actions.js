import { baseURL } from "../baseUrl";

export const applyForOpportunity = async (data) => {
    const res = await fetch(`${baseURL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
};

export const updateApplicationStatus = async (id, status) => {
    const res = await fetch(`${baseURL}/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) return null;
    return res.json();
};
