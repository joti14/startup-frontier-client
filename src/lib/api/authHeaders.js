export function authHeaders(extra = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...extra,
    };
}
