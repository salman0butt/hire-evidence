"use client";

import { useMemo, useState } from "react";

import type { CandidateReviewTranscriptTurn } from "@/lib/review/candidate-transcript-repository";

type CandidateTranscriptViewerProps = Readonly<{
  turns: readonly CandidateReviewTranscriptTurn[];
}>;

function formatSpeaker(speaker: CandidateReviewTranscriptTurn["speaker"]): string {
  return speaker === "candidate" ? "Candidate" : "Interviewer";
}

export function CandidateTranscriptViewer({
  turns,
}: CandidateTranscriptViewerProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleTurns = useMemo(() => {
    if (!normalizedQuery) return turns;

    return turns.filter((turn) =>
      turn.text.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, turns]);

  return (
    <section aria-labelledby="interview-transcript-title" className="space-y-5">
      <div className="space-y-2">
        <h2
          id="interview-transcript-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Interview transcript
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
          Review the finalized interview turns in their recorded order. Technical
          interruption events are kept separate from candidate evidence.
        </p>
      </div>

      <div className="max-w-xl">
        <label
          htmlFor="candidate-transcript-search"
          className="text-sm font-medium text-neutral-700"
        >
          Search transcript
        </label>
        <input
          id="candidate-transcript-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {visibleTurns.length ? (
        <ol className="space-y-3" aria-label="Interview transcript turns">
          {visibleTurns.map((turn) => (
            <li
              key={turn.id}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <article className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{formatSpeaker(turn.speaker)}</h3>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Turn {turn.sequence}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                  {turn.text}
                </p>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <p role="status" className="text-sm text-neutral-600">
          No transcript turns match your search.
        </p>
      )}
    </section>
  );
}
