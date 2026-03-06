import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AdminSessionsPage from "@/app/admin/sessions/page";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";

jest.mock("axios");
jest.mock("@/lib/auth-helpers", () => ({ getToken: jest.fn(() => "tok") }));
jest.mock("@/lib/api/base-url", () => ({ buildApiUrl: jest.fn((p: string) => `http://x${p}`) }));
jest.mock("@/app/components/notification-bell", () => () => <div>bell</div>);
jest.mock("next/navigation", () => ({ useRouter: jest.fn(() => ({ push: jest.fn() })) }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

const oneSession = [{ _id: "1", day: "Monday", sessionName: "Morning PT", timeRange: "7:00 AM", location: "Gym", workoutTitle: "Core", exercises: [], isActive: true }];

describe("admin/sessions/page.tsx - Success Paths", () => {
  test("renders page heading", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [] } });
    render(<AdminSessionsPage />);
    expect(screen.getByText("Manage Sessions")).toBeInTheDocument();
  });

  test("fetches sessions with auth header", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [] } });
    render(<AdminSessionsPage />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(axios.get).toHaveBeenCalledWith("http://x/api/sessions/admin", { headers: { Authorization: "Bearer tok" } });
  });

  test("displays fetched session item", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: oneSession } });
    render(<AdminSessionsPage />);
    expect(await screen.findByText("Morning PT")).toBeInTheDocument();
  });

  test("opens modal when clicking Add Session", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [] } });
    render(<AdminSessionsPage />);
    fireEvent.click(screen.getByText("Add Session"));
    expect(await screen.findAllByText("Add Session")).toHaveLength(2);
  });
});

describe("admin/sessions/page.tsx - Failure Paths", () => {
  test("shows API failure message", async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { data: { message: "fetch failed" } } });
    render(<AdminSessionsPage />);
    expect(await screen.findByText("fetch failed")).toBeInTheDocument();
  });
});
