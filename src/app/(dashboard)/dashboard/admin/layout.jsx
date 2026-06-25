import { roleValidator } from '@/lib/api/session';

export const metadata = {
    title: {
        template: "%s | Admin — Startup Frontier",
        default: "Admin Dashboard | Startup Frontier",
    },
};

export default async function AdminLayout({ children }) {
    await roleValidator("admin");
    return <>{children}</>;
}
