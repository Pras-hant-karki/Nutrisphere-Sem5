import { API } from "@/lib/api/endpoints";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("endpoints.ts - Success Paths", () => {
  test("has auth group", () => {
    expect(API.AUTH).toBeDefined();
  });

  test("login endpoint matches expected path", () => {
    expect(API.AUTH.LOGIN).toBe("/api/auth/login");
  });

  test("register endpoint matches expected path", () => {
    expect(API.AUTH.REGISTER).toBe("/api/auth/register");
  });

  test("login endpoint starts with /api", () => {
    expect(API.AUTH.LOGIN.startsWith("/api")).toBe(true);
  });

  test("register endpoint starts with /api", () => {
    expect(API.AUTH.REGISTER.startsWith("/api")).toBe(true);
  });
});

describe("endpoints.ts - Failure Paths", () => {
  test("login and register are not identical", () => {
    expect(API.AUTH.LOGIN).not.toBe(API.AUTH.REGISTER);
  });

  test("login endpoint has no trailing slash", () => {
    expect(API.AUTH.LOGIN.endsWith("/")).toBe(false);
  });

  test("register endpoint has no trailing slash", () => {
    expect(API.AUTH.REGISTER.endsWith("/")).toBe(false);
  });
});
