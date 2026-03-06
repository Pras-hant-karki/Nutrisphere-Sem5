import { getInitials, isAdmin, isAuthenticated, setAuth, getToken, getUser, logout } from "@/lib/auth-helpers";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("auth-helpers.ts - Success Paths", () => {
  test("setAuth persists token and user", () => {
    setAuth("t1", { id: "1", email: "u@mail.com", role: "user", fullName: "User One" });
    expect(getToken()).toBe("t1");
  });

  test("isAuthenticated returns true with token", () => {
    setAuth("t2", { id: "2", email: "a@mail.com", role: "admin", fullName: "Admin" });
    expect(isAuthenticated()).toBe(true);
  });

  test("isAdmin returns true for admin role", () => {
    setAuth("t3", { id: "3", email: "a@mail.com", role: "admin", fullName: "Admin" });
    expect(isAdmin()).toBe(true);
  });
});

describe("auth-helpers.ts - Failure Paths", () => {
  test("isAdmin returns false for user role", () => {
    setAuth("t4", { id: "4", email: "u@mail.com", role: "user", fullName: "User" });
    expect(isAdmin()).toBe(false);
  });

  test("logout clears token and user", () => {
    setAuth("t5", { id: "5", email: "x@mail.com", role: "user", fullName: "X" });
    logout();
    expect(getUser()).toBeNull();
  });

  test("getInitials trims to two letters", () => {
    expect(getInitials("Prashant Karki")).toBe("PK");
  });
});
