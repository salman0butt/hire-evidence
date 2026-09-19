"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { CandidateReviewTranscriptTurn } from "@/lib/review/candidate-transcript-repository";

type CandidateTranscriptEvidenceCitation = Readonly<{
  messageSequence: number;
  excerpt: string;
}>;

type CandidateTranscriptViewerProps = Readonly<{
  turns: readonly CandidateReviewTranscriptTurn[];
  evidenceCitations?: readonly CandidateTranscriptEvidenceCitation[];
}>;

function formatSpeaker(speaker: CandidateReviewTranscriptTurn["speaker"]): string {
  return speaker === "candidate" ? "Candidate" : "Interviewer";
}

function renderHighlightedText(
  text: string,
  excerpts: readonly string[],
): ReactNode {
  const ranges = excerpts
    .map((excerpt) => {
      const start = text.indexOf(excerpt);
      return start >= 0 ? { start, end: start + excerpt.length } : null;
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((left, right) => left.start - right.start || right.end - left.end);

  if (ranges.length === 0) return text;

  const mergedRanges = ranges.reduce<Array<{ start: number; end: number }>>(
    (merged, range) => {
      const previous = merged.at(-1);
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
        return merged;
      }

      merged.push({ ...range });
      return merged;
    },
    [],
  );

  const content: ReactNode[] = [];
  let cursor = 0;

  mergedRanges.forEach((range, index) => {
    if (range.start > cursor) {
      content.push(text.slice(cursor, range.start));
    }

    content.push(
      <mark
        key={`${range.start}-${range.end}-${index}`}
        className="rounded-sm bg-yellow-100 px-0.5 text-inherit"
      >
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });

  if (cursor < text.length) {
    content.push(text.slice(cursor));
  }

  return content;
}

export function CandidateTranscriptViewer({
  turns,
  evidenceCitations = [],
}: CandidateTranscriptViewerProps) {
  const [query, setQuery] = useState("");
  const [activeEvidenceSequence, setActiveEvidenceSequence] = useState<number | null>(null);

  useEffect(() => {
    const syncEvidenceTarget = () => {
      const match = window.location.hash.match(/^#transcript-turn-(\d+)$/);
      if (!match) {
        setActiveEvidenceSequence(null);
        return;
      }

      const sequence = Number(match[1]);
      const isValidatedEvidenceTarget =
        turns.some((turn) => turn.sequence === sequence) &&
        evidenceCitations.some(
          (citation) => citation.messageSequence === sequence,
        );
      if (!isValidatedEvidenceTarget) {
        setActiveEvidenceSequence(null);
        return;
      }

      setQuery("");
      setActiveEvidenceSequence(sequence);
    };

    syncEvidenceTarget();
    window.addEventListener("hashchange", syncEvidenceTarget);
    return () => window.removeEventListener("hashchange", syncEvidenceTarget);
  }, [evidenceCitations, turns]);

  useEffect(() => {
    if (activeEvidenceSequence === null) return;

    document
      .getElementById(`transcript-turn-${activeEvidenceSequence}`)
      ?.focus();
  }, [activeEvidenceSequence, query]);

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
          onChange={(event) => {
            if (activeEvidenceSequence !== null) {
              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${window.location.search}`,
              );
              setActiveEvidenceSequence(null);
            }
            setQuery(event.target.value);
          }}
          className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {visibleTurns.length ? (
        <ol className="space-y-3" aria-label="Interview transcript turns">
          {visibleTurns.map((turn) => (
            <li
              id={`transcript-turn-${turn.sequence}`}
              key={turn.id}
              tabIndex={-1}
              data-evidence-target={
                activeEvidenceSequence === turn.sequence ? "active" : undefined
              }
              className={`rounded-xl border bg-white p-4 focus:outline-none ${
                activeEvidenceSequence === turn.sequence
                  ? "border-neutral-900 outline outline-2 outline-offset-2"
                  : "border-neutral-200"
              }`}
            >
              <article className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{formatSpeaker(turn.speaker)}</h3>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Turn {turn.sequence}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                  {activeEvidenceSequence === turn.sequence
                    ? renderHighlightedText(
                        turn.text,
                        evidenceCitations
                          .filter(
                            (citation) =>
                              citation.messageSequence === turn.sequence,
                          )
                          .map((citation) => citation.excerpt),
                      )
                    : turn.text}
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
