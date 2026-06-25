import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const roleValidator = async (...roles) => {
  const user = await getUser();
  if (!user || !roles.includes(user.role)) {
    redirect('/unauthorized');
  }
};