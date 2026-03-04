import { cookies } from "next/headers";
import { clearAuthCookies, getAuthToken, getUserData, setAuthToken, setUserData } from "@/lib/cookie";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("cookie.ts - Success Paths", () => {
  test("setAuthToken calls cookieStore.set", async () => {
    const set = jest.fn();
    (cookies as jest.Mock).mockResolvedValue({ set, get: jest.fn(), delete: jest.fn() });
    await setAuthToken("abc");
    expect(set).toHaveBeenCalledWith(expect.objectContaining({ name: "auth_token", value: "abc" }));
  });

  test("getAuthToken returns stored token", async () => {
    (cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => ({ value: "tok" })), set: jest.fn(), delete: jest.fn() });
    await expect(getAuthToken()).resolves.toBe("tok");
  });
});

describe("cookie.ts - Failure Paths", () => {
  test("getUserData returns null when cookie missing", async () => {
    (cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => undefined), set: jest.fn(), delete: jest.fn() });
    await expect(getUserData()).resolves.toBeNull();
  });

  test("clearAuthCookies deletes auth_token and user_data", async () => {
    const del = jest.fn();
    (cookies as jest.Mock).mockResolvedValue({ delete: del, set: jest.fn(), get: jest.fn() });
    await clearAuthCookies();
    expect(del).toHaveBeenCalledWith("auth_token");
  });
});
