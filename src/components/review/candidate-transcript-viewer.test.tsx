import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CandidateReviewTranscriptTurn } from "@/lib/review/candidate-transcript-repository";
import { CandidateTranscriptViewer } from "./candidate-transcript-viewer";

const turns: readonly CandidateReviewTranscriptTurn[] = [
  {
    id: "message-1",
    eventId: "event-1",
    sequence: 1,
    speaker: "interviewer",
    text: "Describe a difficult scaling problem.",
    startedAt: null,
    endedAt: null,
    finalizedAt: "2026-09-18T08:00:00.000Z",
  },
  {
    id: "message-2",
    eventId: "event-2",
    sequence: 2,
    speaker: "candidate",
    text: "I partitioned writes by tenant and made retries idempotent.",
    startedAt: null,
    endedAt: null,
    finalizedAt: "2026-09-18T08:00:05.000Z",
  },
];

describe("candidate transcript viewer", () => {
  it("renders ordered speaker-separated transcript turns as review evidence", () => {
    render(<CandidateTranscriptViewer turns={turns} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Interview transcript" }),
    ).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Turn 1");
    expect(items[0]).toHaveTextContent("Interviewer");
    expect(items[0]).toHaveTextContent("Describe a difficult scaling problem.");
    expect(items[1]).toHaveTextContent("Turn 2");
    expect(items[1]).toHaveTextContent("Candidate");
    expect(items[1]).toHaveTextContent(
      "I partitioned writes by tenant and made retries idempotent.",
    );
  });

  it("filters transcript text with an accessible case-insensitive search", () => {
    render(<CandidateTranscriptViewer turns={turns} />);

    const search = screen.getByRole("searchbox", { name: "Search transcript" });
    fireEvent.change(search, { target: { value: "TENANT" } });

    expect(
      screen.queryByText("Describe a difficult scaling problem."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "I partitioned writes by tenant and made retries idempotent.",
      ),
    ).toBeInTheDocument();
  });

  it("announces when a search has no matching transcript turns", () => {
    render(<CandidateTranscriptViewer turns={turns} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search transcript" }),
      { target: { value: "kubernetes" } },
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "No transcript turns match your search.",
    );
  });
});
