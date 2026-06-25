"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { baseURL } from "@/lib/api/baseUrl";

export function useJwtSync() {
    const { data: session } = useSession();
    const synced = useRef(false);

    useEffect(() => {
        if (synced.current || !session?.user?.email) return;
        synced.current = true;

        fetch(`${baseURL}/api/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: session.user.email, role: session.user.role }),
        })
            .then(r => r.json())
            .then(data => { if (data.token) localStorage.setItem("jwt_token", data.token); })
            .catch(() => {});
    }, [session?.user?.email]);
}
