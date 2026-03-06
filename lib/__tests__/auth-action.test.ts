import { handleLogin, handleLogout, handleRegister } from "@/lib/actions/auth-action";
import { login, register } from "@/lib/api/auth";
import { clearAuthCookies, setAuthToken, setUserData } from "@/lib/cookie";
import { redirect } from "next/navigation";

jest.mock("@/lib/api/auth", () => ({ login: jest.fn(), register: jest.fn() }));
jest.mock("@/lib/cookie", () => ({ setAuthToken: jest.fn(), setUserData: jest.fn(), clearAuthCookies: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn(), redirect: jest.fn((p: string) => p) }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("auth-action.ts - Success Paths", () => {
  test("handleRegister returns success object", async () => {
    (register as jest.Mock).mockResolvedValue({ success: true, token: "t", data: { id: "1" } });
    const res = await handleRegister({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" });
    expect(res).toMatchObject({ success: true, message: "Registration successful", data: { id: "1" } });
  });

  test("handleRegister stores token", async () => {
    (register as jest.Mock).mockResolvedValue({ success: true, token: "t", data: { id: "1" } });
    await handleRegister({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" });
    expect(setAuthToken).toHaveBeenCalledWith("t");
  });

  test("handleRegister stores user data", async () => {
    (register as jest.Mock).mockResolvedValue({ success: true, token: "t", data: { id: "1" } });
    await handleRegister({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" });
    expect(setUserData).toHaveBeenCalledWith({ id: "1" });
  });

  test("handleLogin returns success object", async () => {
    (login as jest.Mock).mockResolvedValue({ success: true, token: "tk", user: { id: "9" } });
    const res = await handleLogin({ email: "u@mail.com", password: "123456" });
    expect(res).toMatchObject({ success: true, message: "Login successful", data: { id: "9" } });
  });

  test("handleLogin stores token", async () => {
    (login as jest.Mock).mockResolvedValue({ success: true, token: "tk", user: { id: "9" } });
    await handleLogin({ email: "u@mail.com", password: "123456" });
    expect(setAuthToken).toHaveBeenCalledWith("tk");
  });

  test("handleLogout clears cookies and redirects", async () => {
    await handleLogout();
    expect(clearAuthCookies).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});

describe("auth-action.ts - Failure Paths", () => {
  test("handleRegister returns failure for API false", async () => {
    (register as jest.Mock).mockResolvedValue({ success: false, message: "bad" });
    await expect(handleRegister({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" })).resolves.toMatchObject({ success: false, message: "bad" });
  });

  test("handleRegister catches thrown error", async () => {
    (register as jest.Mock).mockRejectedValue(new Error("boom"));
    await expect(handleRegister({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" })).resolves.toMatchObject({ success: false, message: "boom" });
  });

  test("handleLogin returns failure for API false", async () => {
    (login as jest.Mock).mockResolvedValue({ success: false, message: "invalid" });
    await expect(handleLogin({ email: "u@mail.com", password: "123456" })).resolves.toMatchObject({ success: false, message: "invalid" });
  });

  test("handleLogin catches thrown error", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("down"));
    await expect(handleLogin({ email: "u@mail.com", password: "123456" })).resolves.toMatchObject({ success: false, message: "down" });
  });
});
