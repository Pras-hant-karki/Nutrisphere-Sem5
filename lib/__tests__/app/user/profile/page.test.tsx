import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ProfilePage from "@/app/user/profile/page";
import { getToken, getUser, logout, setAuth } from "@/lib/auth-helpers";

const push = jest.fn();
jest.mock("axios");
jest.mock("next/navigation", () => ({ useRouter: jest.fn(() => ({ push })) }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));
jest.mock("@/app/components/notification-bell", () => () => <div>bell</div>);
jest.mock("@/lib/auth-helpers", () => ({
  getToken: jest.fn(() => "tok"),
  logout: jest.fn(),
  setAuth: jest.fn(),
  getUser: jest.fn(() => ({ _id: "1", email: "user@mail.com", role: "user", fullName: "User One", phone: "123" })),
}));

describe("user/profile/page.tsx - Success Paths", () => {
  test("renders profile heading", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: null } });
    render(<ProfilePage />);
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  test("loads initial user email from helper", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: null } });
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("user@mail.com")).toBeInTheDocument();
  });

  test("calls /api/auth/me when token exists", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: null } });
    render(<ProfilePage />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect((axios.get as jest.Mock).mock.calls[0][0]).toContain("/api/auth/me");
  });

  test("sync success updates auth cache", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { _id: "1", email: "s@mail.com", role: "user", fullName: "Synced" } } });
    render(<ProfilePage />);
    await waitFor(() => expect(setAuth).toHaveBeenCalled());
    expect(setAuth).toHaveBeenCalledWith("tok", expect.objectContaining({ email: "s@mail.com" }));
  });
});

describe("user/profile/page.tsx - Failure Paths", () => {
  test("logout button triggers logout and redirect", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: null } });
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Logout"));
    expect(logout).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/login");
  });
});
