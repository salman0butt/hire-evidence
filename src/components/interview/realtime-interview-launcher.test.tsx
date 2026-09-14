import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RealtimeInterviewLauncher } from "./realtime-interview-launcher";

describe("RealtimeInterviewLauncher", () => {
  it("authorizes the candidate capability only after an explicit start action", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized",
      attemptId: "attempt-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: {
        interviewerVersionId: "version-1",
        sections: [],
      },
      providerCredential: {
        value: "ephemeral-secret",
        expiresAt: "2026-09-14T11:30:00.000Z",
      },
    });

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
      />,
    );

    expect(authorize).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    await waitFor(() => {
      expect(authorize).toHaveBeenCalledWith("candidate-capability");
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Realtime session authorized",
    );
    expect(screen.queryByText("ephemeral-secret")).not.toBeInTheDocument();
  });

  it("shows one constant-safe failure when authorization is unavailable", async () => {
    const authorize = vi.fn().mockResolvedValue({ status: "unavailable" });

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("The live interview could not be started. Please try again.");
  });
});
