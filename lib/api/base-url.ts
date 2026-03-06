export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
