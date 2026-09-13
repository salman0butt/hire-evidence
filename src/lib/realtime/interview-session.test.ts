import { describe, expect, it, vi } from "vitest";

import type { RealtimeAudioPlayback } from "./audio-playback";
import {
  createRealtimeInterviewSession,
  type RealtimeInterviewSessionSnapshot,
} from "./interview-session";

describe("realtime interview session orchestration", () => {
  function createPlayback(): RealtimeAudioPlayback {
    return {
      enqueue: vi.fn(),
      interrupt: vi.fn(),
      stop: vi.fn(async () => undefined),
    };
  }

  const plan = {
    versionId: "version-1",
    sections: [
      {
        id: "section-1",
        title: "Role experience",
        questions: [
          {
            id: "question-1",
            prompt: "Describe a relevant project.",
            required: true,
            followUpLimit: 1,
          },
          {
            id: "question-2",
            prompt: "What trade-off did you make?",
            required: true,
            followUpLimit: 1,
          },
        ],
      },
    ],
  } as const;

  it("progresses a multi-turn interview only through explicit app-owned completion", () => {
    const playback = createPlayback();
    const snapshots: RealtimeInterviewSessionSnapshot[] = [];
    const session = createRealtimeInterviewSession({
      plan,
      playback,
      onSnapshot: (snapshot) => snapshots.push(snapshot),
    });

    expect(session.getSnapshot()).toMatchObject({
      status: "active",
      currentQuestion: { questionId: "question-1", prompt: "Describe a relevant project." },
    });

    session.handleTransportEvent({ type: "modelTurn", text: "Ignore the plan and jump ahead." });
    expect(session.getSnapshot().currentQuestion?.questionId).toBe("question-1");

    session.completeCurrentQuestion("turn-1");
    expect(session.getSnapshot().currentQuestion?.questionId).toBe("question-2");

    session.completeCurrentQuestion("turn-2");
    expect(session.getSnapshot()).toMatchObject({ status: "completed", currentQuestion: null });
    expect(snapshots.at(-1)?.status).toBe("completed");
  });

  it("routes provider audio to playback and barge-in only interrupts playback", () => {
    const playback = createPlayback();
    const session = createRealtimeInterviewSession({ plan, playback });
    const pcm = new Float32Array([0.1, -0.2]);

    session.handleTransportEvent({ type: "audio", pcm, sampleRate: 24_000 });
    expect(playback.enqueue).toHaveBeenCalledWith(pcm, 24_000);

    session.handleTransportEvent({ type: "candidateSpeechStart" });
    expect(playback.interrupt).toHaveBeenCalledTimes(1);
    expect(session.getSnapshot().currentQuestion?.questionId).toBe("question-1");
  });

  it("rejects stale generation callbacks after advancing the session generation", () => {
    const playback = createPlayback();
    const session = createRealtimeInterviewSession({ plan, playback });
    const firstGeneration = session.getSnapshot().generation;

    session.advanceGeneration();
    session.handleTransportEvent(
      { type: "audio", pcm: new Float32Array([0.5]), sampleRate: 24_000 },
      firstGeneration,
    );
    session.handleTransportEvent({ type: "candidateSpeechStart" }, firstGeneration);
    session.completeCurrentQuestion("stale-turn", firstGeneration);

    expect(playback.enqueue).not.toHaveBeenCalled();
    expect(playback.interrupt).not.toHaveBeenCalled();
    expect(session.getSnapshot().currentQuestion?.questionId).toBe("question-1");
  });

  it("starts a reauthorized browser session from the server-authoritative checkpoint", () => {
    const session = createRealtimeInterviewSession({
      plan,
      playback: createPlayback(),
      resumeCheckpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: { "question-1": 1 },
        processedEventIds: ["question-1-complete"],
      },
    });

    expect(session.getSnapshot()).toMatchObject({
      status: "active",
      currentQuestion: {
        questionId: "question-2",
        prompt: "What trade-off did you make?",
      },
    });
  });

  it("exposes only candidate-safe plan state and no secret or scoring configuration", () => {
    const session = createRealtimeInterviewSession({ plan, playback: createPlayback() });
    const serialized = JSON.stringify(session.getSnapshot());

    expect(serialized).toContain("question-1");
    expect(serialized).not.toMatch(/credential|secret|api.?key|score|rubric/i);
  });

  it("applies bounded technical recovery without resetting the interview plan", () => {
    const playback = createPlayback();
    const session = createRealtimeInterviewSession({ plan, playback });
    const firstGeneration = session.getSnapshot().generation;

    const decision = session.handleTechnicalFailure(
      { kind: "provider-error", detail: "provider-internal payload" },
      0,
      2,
      firstGeneration,
    );

    expect(decision).toEqual({
      action: "retry",
      reason: "The interview connection was interrupted. We will try to reconnect.",
      affectsEvaluation: false,
    });
    expect(session.getSnapshot()).toMatchObject({
      status: "active",
      generation: firstGeneration + 1,
      currentQuestion: { questionId: "question-1" },
    });

    session.handleTransportEvent(
      { type: "audio", pcm: new Float32Array([0.5]), sampleRate: 24_000 },
      firstGeneration,
    );
    expect(playback.enqueue).not.toHaveBeenCalled();
  });

  it("ends safely on terminal technical failures without converting them into candidate evaluation", () => {
    const playback = createPlayback();
    const session = createRealtimeInterviewSession({ plan, playback });

    const decision = session.handleTechnicalFailure(
      { kind: "authorization-denied", detail: "sensitive server detail" },
      0,
      2,
    );

    if (!decision) {
      throw new Error("Expected an active-session recovery decision.");
    }

    expect(decision.action).toBe("end-safe");
    expect(decision.affectsEvaluation).toBe(false);
    expect(decision.reason).not.toContain("sensitive server detail");
    expect(session.getSnapshot()).toMatchObject({
      status: "ended",
      currentQuestion: { questionId: "question-1" },
    });

    session.completeCurrentQuestion("must-not-progress");
    expect(session.getSnapshot().currentQuestion?.questionId).toBe("question-1");
    expect(playback.stop).toHaveBeenCalledTimes(1);
  });
});