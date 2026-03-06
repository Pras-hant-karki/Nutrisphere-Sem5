import axios from "@/lib/api/axios";
import { login, register } from "@/lib/api/auth";
import { API } from "@/lib/api/endpoints";

jest.mock("@/lib/api/axios", () => ({ post: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("api/auth.ts - Success Paths", () => {
  test("register posts to register endpoint", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
    await register({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" });
    expect(axios.post).toHaveBeenCalledWith(API.AUTH.REGISTER, expect.any(Object));
  });

  test("register returns response data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true, token: "x" } });
    await expect(register({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" })).resolves.toMatchObject({ success: true, token: "x" });
  });

  test("login posts to login endpoint", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
    await login({ email: "a@a.com", password: "123456" });
    expect(axios.post).toHaveBeenCalledWith(API.AUTH.LOGIN, expect.any(Object));
  });

  test("login returns response data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true, token: "y" } });
    await expect(login({ email: "a@a.com", password: "123456" })).resolves.toMatchObject({ success: true, token: "y" });
  });
});

describe("api/auth.ts - Failure Paths", () => {
  test("register throws API message", async () => {
    (axios.post as jest.Mock).mockRejectedValue({ response: { data: { message: "taken" } } });
    await expect(register({ fullName: "A", email: "a@a.com", password: "123456", confirmPassword: "123456" })).rejects.toThrow("taken");
  });

  test("login throws API message", async () => {
    (axios.post as jest.Mock).mockRejectedValue({ response: { data: { message: "invalid" } } });
    await expect(login({ email: "a@a.com", password: "123456" })).rejects.toThrow("invalid");
  });

  test("login falls back to generic error text", async () => {
    (axios.post as jest.Mock).mockRejectedValue({ message: "network" });
    await expect(login({ email: "a@a.com", password: "123456" })).rejects.toThrow("network");
  });
});

// npm test -- --coverage --watchAll=false (frontend to run tests with coverage report)
// npm test -- --coverage --verbose (backend to run tests with coverage report and verbose output)
// npm test -- --coverage (simple coverage test both frontend and backend)