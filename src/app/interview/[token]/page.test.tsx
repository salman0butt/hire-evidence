import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolvePublicInvitation } from "@/lib/candidates/public-invitation";

vi.mock("@/lib/candidates/public-invitation", () => ({
  resolvePublicInvitation: vi.fn(),
}));

const mockedResolvePublicInvitation = vi.mocked(resolvePublicInvitation);
const token = "candidate-route-token";
const availableInvitation = {
  organizationName: "Evidence Labs",
  jobTitle: "Senior Engineer",
  durationSeconds: 2700,
  interviewType: "technical",
  language: "English",
  candidateInstructions: "Use a quiet room.",
} as const;

async function loadPage() {
  const modulePath = "./page";
  return (await import(modulePath)).default as (props: {
    params: Promise<{ token: string }>;
  }) => Promise<React.ReactNode>;
}

describe("public candidate invitation page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only the safe invitation projection for an available token", async () => {
    mockedResolvePublicInvitation.mockResolvedValue({
      status: "available",
      invitation: availableInvitation,
    });
    const Page = await loadPage();

    render(await Page({ params: Promise.resolve({ token }) }));

    expect(mockedResolvePublicInvitation).toHaveBeenCalledWith(token);
    expect(
      screen.getByRole("heading", { name: "Senior Engineer interview" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Evidence Labs")).toBeInTheDocument();
  });

  it("shows the required pre-interview information before the candidate can start", async () => {
    mockedResolvePublicInvitation.mockResolvedValue({
      status: "available",
      invitation: availableInvitation,
    });
    const Page = await loadPage();

    render(await Page({ params: Promise.resolve({ token }) }));

    expect(
      screen.getByRole("heading", { name: "Before you start" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Approximate duration")).toBeInTheDocument();
    expect(screen.getByText("Interview format")).toBeInTheDocument();
    expect(screen.getByText("Technical requirements")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Start prerequisites")).toBeInTheDocument();
  });

  it("shows duration and format from the published invitation snapshot", async () => {
    mockedResolvePublicInvitation.mockResolvedValue({
      status: "available",
      invitation: availableInvitation,
    });
    const Page = await loadPage();

    render(await Page({ params: Promise.resolve({ token }) }));

    expect(screen.getByText("45 minutes")).toBeInTheDocument();
    expect(screen.getByText("Technical")).toBeInTheDocument();
  });

  it("renders the explicit disclosure consent control for an available invitation", async () => {
    mockedResolvePublicInvitation.mockResolvedValue({
      status: "available",
      invitation: availableInvitation,
    });
    const Page = await loadPage();

    render(await Page({ params: Promise.resolve({ token }) }));

    expect(
      screen.getByRole("heading", { name: "AI and privacy disclosures" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /I have read these disclosures and consent/i,
      }),
    ).toBeRequired();
  });

  it("renders one generic safe failure state without invitation details", async () => {
    mockedResolvePublicInvitation.mockResolvedValue({ status: "unavailable" });
    const Page = await loadPage();

    render(await Page({ params: Promise.resolve({ token }) }));

    expect(
      screen.getByRole("heading", { name: "Invitation unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Evidence Labs")).not.toBeInTheDocument();
  });
});
