import { baseURL } from "../baseUrl";

export const fetchFounderApplications = async (email) => {
    const res = await fetch(`${baseURL}/api/applications/founder/${email}`, {
        cache: "no-store",
        credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
};

export const fetchApplicantApplications = async (email) => {
    const res = await fetch(`${baseURL}/api/applications/applicant/${email}`, {
        cache: "no-store",
        credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
};
