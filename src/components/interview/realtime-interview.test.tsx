import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RealtimeConnectionState } from "@/lib/realtime/connection-machine";
import type { RealtimeInterviewSessionSnapshot } from "@/lib/realtime/interview-session";

import { RealtimeInterview } from "./realtime-interview";

const connectedState: RealtimeConnectionState = {
  connection: "connected",
  presentation: "listening",
  generation: 1,
  error: undefined,
};

const activeSnapshot: RealtimeInterviewSessionSnapshot = {
  status: "active",
  generation: 1,
  currentQuestion: {
    sectionId: "intro",
    sectionTitle: "Introduction",
    questionId: "q1",
    prompt: "Tell me about a recent project.",
  },
  transcript: {
    partials: { candidate: "", interviewer: "" },
    finalizedTurns: [],
  },
};

describe("RealtimeInterview", () => {
  it("presents the authoritative current question and realtime controls", () => {
    render(
      <RealtimeInterview
        connectionState={connectedState}
        sessionSnapshot={activeSnapshot}
        muted={false}
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Introduction" })).toBeInTheDocument();
    expect(screen.getByText("Tell me about a recent project.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute microphone" })).toBeEnabled();
  });

  it("shows deterministic completion instead of inventing another question", () => {
    render(
      <RealtimeInterview
        connectionState={{ ...connectedState, connection: "ended", presentation: "idle" }}
        sessionSnapshot={{ ...activeSnapshot, status: "completed", currentQuestion: null }}
        muted={false}
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Interview complete");
    expect(screen.queryByText("Tell me about a recent project.")).not.toBeInTheDocument();
  });
});
