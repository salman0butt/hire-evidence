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

function speakerLabel(speaker: "candidate" | "interviewer") {
  return speaker === "candidate" ? "You" : "Interviewer";
}

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
  const { transcript } = sessionSnapshot;
  const hasTranscript =
    transcript.finalizedTurns.length > 0 ||
    transcript.partials.candidate.length > 0 ||
    transcript.partials.interviewer.length > 0;

  if (completed) {
    return (
      <section aria-label="Realtime interview" className="space-y-6">
        <p role="status" aria-live="polite">
          Interview complete
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Realtime interview" className="space-y-6">
      {currentQuestion ? (
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

      {hasTranscript ? (
        <section aria-label="Interview transcript" className="space-y-3">
          <h3 className="text-sm font-semibold">Live transcript</h3>
          {transcript.finalizedTurns.length > 0 ? (
            <ol className="space-y-2">
              {transcript.finalizedTurns.map((turn, index) => (
                <li key={`${turn.speaker}-${index}`} className="text-sm leading-6">
                  <span className="font-medium">{speakerLabel(turn.speaker)}:</span>{" "}
                  <span>{turn.text}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {transcript.partials.interviewer ? (
            <p aria-live="polite" className="text-sm text-slate-600">
              <span className="font-medium">Interviewer:</span>{" "}
              {transcript.partials.interviewer}
            </p>
          ) : null}
          {transcript.partials.candidate ? (
            <p aria-live="polite" className="text-sm text-slate-600">
              <span className="font-medium">You:</span> {transcript.partials.candidate}
            </p>
          ) : null}
        </section>
      ) : null}

      <RealtimeControls
        state={connectionState}
        muted={muted}
        onMutedChange={onMutedChange}
        onEnd={onEnd}
        {...(onRetry ? { onRetry } : {})}
      />
    </section>
  );
}
