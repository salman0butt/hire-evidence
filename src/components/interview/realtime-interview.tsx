"use client";

import type { RealtimeConnectionState } from "@/lib/realtime/connection-machine";
import type { RealtimeInterviewSessionSnapshot } from "@/lib/realtime/interview-session";

import { RealtimeControls } from "./realtime-controls";

type RealtimeInterviewProps = Readonly<{
  connectionState: RealtimeConnectionState;
  sessionSnapshot: RealtimeInterviewSessionSnapshot;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  onEnd: () => void;
  onRetry?: () => void;
}>;

export function RealtimeInterview({
  connectionState,
  sessionSnapshot,
  muted,
  onMutedChange,
  onEnd,
  onRetry,
}: RealtimeInterviewProps) {
  const currentQuestion = sessionSnapshot.currentQuestion;
  const completed = sessionSnapshot.status === "completed";

  return (
    <section aria-label="Realtime interview" className="space-y-6">
      {completed ? (
        <p role="status" aria-live="polite">
          Interview complete
        </p>
      ) : currentQuestion ? (
        <article className="space-y-2" aria-labelledby="realtime-section-title">
          <h2 id="realtime-section-title" className="text-xl font-semibold">
            {currentQuestion.sectionTitle}
          </h2>
          <p>{currentQuestion.prompt}</p>
        </article>
      ) : (
        <p role="status" aria-live="polite">
          Preparing the next interview question
        </p>
      )}

      <RealtimeControls
        state={connectionState}
        muted={muted}
        onMutedChange={onMutedChange}
        onEnd={onEnd}
        onRetry={onRetry}
      />
    </section>
  );
}
