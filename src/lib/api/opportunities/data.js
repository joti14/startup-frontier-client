import { baseURL } from "../baseUrl";
import { authHeaders } from "../authHeaders";

export const myOpportunities = async (email) => {
    const res = await fetch(`${baseURL}/api/opportunities/${email}`, {
        headers: authHeaders(),
        credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
};

export const fetchLatestOpportunities = async () => {
    const res = await fetch(`${baseURL}/api/opportunities?limit=6`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
};

export const fetchAllOpportunities = async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${baseURL}/api/opportunities?${qs}`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
};
