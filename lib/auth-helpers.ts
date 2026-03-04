/**
 * Authentication Helper Functions
 * Manages token and user data in localStorage
 */

export interface User {
  id: string;
  _id?: string; // MongoDB ID for API calls
  email: string;
  role: "user" | "admin";
  fullName: string;
  phone?: string;
  image?: string;
  profilePicture?: string;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Store authentication token and user data
 */
export const setAuth = (token: string, user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieve authentication token
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Retrieve user data
 */
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Clear authentication data (logout)
 */
export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Check if user is authenticated and has admin role
 */
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin";
};

/**
 * Generate initials avatar from full name
 * Example: "Prashant Karki" => "PK"
 */
export const getInitials = (fullName: string): string => {
  return fullName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
