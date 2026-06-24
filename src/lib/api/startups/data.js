import { baseURL } from "../baseUrl";

export const myStartup = async (email) => {
    const res = await fetch(`${baseURL}/api/founder/${email}`);
    if (!res.ok) return null;
    return res.json();
};

export const fetchLatestStartups = async () => {
    const res = await fetch(`${baseURL}/api/startups?featured=true&limit=6`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchAllStartups = async (params = {}) => {
    const qs = new URLSearchParams({ featured: "true", ...params }).toString();
    const res = await fetch(`${baseURL}/api/startups?${qs}`);
    if (!res.ok) return [];
    return res.json();
};

export const fetchStartupById = async (id) => {
    const res = await fetch(`${baseURL}/api/startups/${id}`);
    if (!res.ok) return null;
    return res.json();
};
