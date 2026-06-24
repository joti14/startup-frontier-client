import { serverFetch } from "../server";

export const myStartup = async (email) => {
  const result = await serverFetch(`/api/founder/${email}`);
  return result;
};

export const fetchLatestStartups = async () => {
  const result = await serverFetch(`/api/startups?featured=true&limit=6`);
  return result;
};

export const fetchAllStartups = async () => {
  const result = await serverFetch(`/api/startups?featured=true`);
  return result;
};
