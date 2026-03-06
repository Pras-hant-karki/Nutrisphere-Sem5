import { loginSchema, registerSchema } from "@/app/(auth)/schema";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("schema.ts - Success Paths", () => {
  test("login accepts valid email and password", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "123456" });
    expect(result.success).toBe(true);
  });

  test("login accepts long password", () => {
    const result = loginSchema.safeParse({ email: "user@mail.com", password: "verylongpass" });
    expect(result.success).toBe(true);
  });

  test("register accepts valid payload", () => {
    const payload = { fullName: "John Doe", email: "j@d.com", password: "123456", confirmPassword: "123456" };
    expect(registerSchema.safeParse(payload).success).toBe(true);
  });

  test("register accepts optional complex name", () => {
    const payload = { fullName: "A B", email: "ab@mail.com", password: "abcdef", confirmPassword: "abcdef" };
    expect(registerSchema.safeParse(payload).success).toBe(true);
  });

  test("register accepts uppercase email", () => {
    const payload = { fullName: "Jane Doe", email: "JANE@MAIL.COM", password: "123456", confirmPassword: "123456" };
    expect(registerSchema.safeParse(payload).success).toBe(true);
  });
});

describe("schema.ts - Failure Paths", () => {
  test("login rejects empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "123456" });
    expect(result.success).toBe(false);
  });

  test("login rejects malformed email", () => {
    const result = loginSchema.safeParse({ email: "not-email", password: "123456" });
    expect(result.success).toBe(false);
  });

  test("login rejects short password", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "123" });
    expect(result.success).toBe(false);
  });

  test("register rejects empty full name", () => {
    const payload = { fullName: "", email: "j@d.com", password: "123456", confirmPassword: "123456" };
    expect(registerSchema.safeParse(payload).success).toBe(false);
  });

  test("register rejects password mismatch", () => {
    const payload = { fullName: "John", email: "j@d.com", password: "123456", confirmPassword: "654321" };
    expect(registerSchema.safeParse(payload).success).toBe(false);
  });
});
