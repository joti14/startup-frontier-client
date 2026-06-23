import { serverFetch } from "../server";

export const myStartup = async (email) => {
  const result = await serverFetch(`/api/founder/${email}`);
  return result;
};
