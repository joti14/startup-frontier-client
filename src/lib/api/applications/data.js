import { baseURL } from "../baseUrl";
import { authHeaders } from "../authHeaders";

export const fetchFounderApplications = async (email) => {
    const res = await fetch(`${baseURL}/api/applications/founder/${email}`, {
        cache: "no-store",
        headers: authHeaders(),
        credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
};

export const fetchApplicantApplications = async (email) => {
    const res = await fetch(`${baseURL}/api/applications/applicant/${email}`, {
        cache: "no-store",
        headers: authHeaders(),
        credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
};
