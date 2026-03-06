export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/$/, "") || "http://localhost:5000";

const getApiBaseUrl = () => API_BASE_URL;

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
