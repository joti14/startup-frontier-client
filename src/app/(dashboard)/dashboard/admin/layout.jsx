import { roleValidator } from '@/lib/api/session';

export default async function AdminLayout({ children }) {
    await roleValidator("admin");
    return <>{children}</>;
}
