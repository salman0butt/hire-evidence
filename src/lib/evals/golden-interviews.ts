export type GoldenInterviewCategory =
  | "normal"
  | "insufficient-evidence"
  | "interruption"
  | "boundary";

export type GoldenInterviewProvenance = "synthetic" | "de-identified";

export type GoldenInterviewTranscriptTurn = {
  sequence: number;
  speaker: "interviewer" | "candidate";
  text: string;
};

export type GoldenInterviewFixture = {
  id: string;
  version: string;
  category: GoldenInterviewCategory;
  provenance: GoldenInterviewProvenance;
  transcript: GoldenInterviewTranscriptTurn[];
  expected: {
    technicalFailure: boolean;
    evidenceSufficiency: "sufficient" | "insufficient";
  };
};

export type GoldenInterviewDataset = {
  id: string;
  version: string;
  fixtures: GoldenInterviewFixture[];
};

export function defineGoldenInterviewDataset(
  dataset: GoldenInterviewDataset,
): GoldenInterviewDataset {
  const ids = new Set<string>();

  for (const fixture of dataset.fixtures) {
    if (ids.has(fixture.id)) {
      throw new Error(`Duplicate golden interview fixture id: ${fixture.id}`);
    }
    ids.add(fixture.id);

    if (fixture.provenance !== "synthetic" && fixture.provenance !== "de-identified") {
      throw new Error(`Unsafe provenance for golden interview fixture: ${fixture.id}`);
    }

    const sequences = new Set<number>();
    for (const turn of fixture.transcript) {
      if (!Number.isSafeInteger(turn.sequence) || turn.sequence < 1 || sequences.has(turn.sequence)) {
        throw new Error(`Invalid transcript sequence for golden interview fixture: ${fixture.id}`);
      }
      sequences.add(turn.sequence);
    }
  }

  return {
    ...dataset,
    fixtures: dataset.fixtures.map((fixture) => ({
      ...fixture,
      transcript: fixture.transcript.map((turn) => ({ ...turn })),
      expected: { ...fixture.expected },
    })),
  };
}
