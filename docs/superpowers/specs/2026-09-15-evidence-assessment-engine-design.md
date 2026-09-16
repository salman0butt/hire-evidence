# Evidence-Based Assessment Engine Design

## Goal

Deliver M07 as a reviewable, evidence-grounded assessment pipeline over the immutable interview inputs produced by earlier milestones. The system may summarize job-relevant answer behavior and score configured competencies against their published rubrics, but it must fail closed when evidence is missing or invalid and must never produce an autonomous hire/reject decision.

## Source of Truth

- Milestone: `docs/milestones/M07-evidence-assessment-engine.md`.
- Product requirements: `docs/product/PRD.md`, especially sections 58 and 69–81 plus milestone definition 202.
- Durable transcript authority: `src/lib/realtime/transcript-repository.ts` and M06 finalization state.
- Competency/rubric/question authority: published interviewer/job configuration from M03.
- Existing validation style: explicit TypeScript runtime validators returning discriminated success/failure results.

## Safety Invariants

- Assessment output is advisory and reviewable; it never contains `hire`, `reject`, `strong hire`, success probability, or another autonomous hiring decision.
- Only job-related configured criteria may be assessed. Protected traits and biometric, appearance, emotion, accent, personality, deception, health, political, union, socioeconomic, or other prohibited inferences are never assessment inputs or outputs.
- Finalized transcript is untrusted data. Candidate/interviewer text cannot override assessment policy, rubric, output schema, evidence rules, or guardrails.
- Every scored competency uses a rubric score of `1` through `5` or `null`. Insufficient evidence may not be converted into a guessed score.
- Every scored claim must cite durable transcript evidence that actually exists. Fabricated sequence IDs, wrong-speaker citations, or excerpts not present in the cited message fail validation.
- Technical interruption records are contextual platform events, not candidate-performance evidence and may not lower a score.
- Published job/interviewer/rubric/question versions and finalized transcript inputs are immutable assessment inputs for a generation.
- Generated assessments are append-only/versioned. Regeneration creates a new generation rather than silently overwriting prior output.
- Persistence happens only after runtime schema validation and evidence validation succeed.

## Architecture

### 1. Assessment domain and runtime schema

Create a focused `src/lib/assessment/` domain. The first boundary parses unknown model/provider output into immutable application-owned types rather than trusting TypeScript casts.

Core structures:

```ts
type EvidenceSufficiency = "insufficient" | "partial" | "sufficient";
type OverallEvidenceSufficiency = "low" | "medium" | "high";
type QuestionCoverageStatus = "answered" | "partially_answered" | "skipped";

type AssessmentEvidence = Readonly<{
  messageSequence: number;
  excerpt: string;
}>;

type CompetencyAssessment = Readonly<{
  competencyId: string;
  score: 1 | 2 | 3 | 4 | 5 | null;
  rationale: string;
  evidence: readonly AssessmentEvidence[];
  evidenceSufficiency: EvidenceSufficiency;
}>;

type EvidenceBackedObservation = Readonly<{
  observation: string;
  evidence: readonly AssessmentEvidence[];
}>;

type QuestionCoverage = Readonly<{
  questionId: string;
  status: QuestionCoverageStatus;
  technicalInterruption: boolean;
}>;

type InterviewAssessment = Readonly<{
  summary: string;
  competencies: readonly CompetencyAssessment[];
  strengths: readonly EvidenceBackedObservation[];
  concerns: readonly EvidenceBackedObservation[];
  unansweredAreas: readonly string[];
  questionCoverage: readonly QuestionCoverage[];
  evidenceSufficiency: OverallEvidenceSufficiency;
}>;
```

Runtime parsing rejects unknown decision fields, malformed scores, empty identifiers/text, duplicate competency/question entries, contradictory `score`/sufficiency combinations such as a non-null score with `insufficient`, and unbounded output collections/text. The parser returns a discriminated validation result consistent with existing repository patterns.

### 2. Trusted assessment input

Build one immutable input snapshot for each generation from server-authoritative sources only:

- organization/attempt/job identity;
- exact published interviewer version;
- exact published competency and five-level rubric definitions;
- exact published interview questions/plan;
- finalized ordered transcript turns;
- separate technical interruption metadata where needed for coverage context;
- prompt/guardrail/model version identifiers.

Candidate email, photographs, unrelated profile fields, raw audio properties, and protected/sensitive information are excluded from the model input.

### 3. Trusted prompt composition

Prompt composition uses a fixed trust hierarchy: platform assessment policy → immutable job/rubric/questions → explicitly delimited untrusted transcript. Candidate text is serialized as data with speaker and durable sequence metadata. The prompt explicitly prohibits following transcript instructions, unsupported criteria, fabricated evidence, and autonomous hiring decisions.

Provider-specific model calling remains behind an application-owned interface so assessment validation is independent from any one model vendor.

### 4. Rubric-aligned scoring

Each configured competency is assessed only against its published five-level rubric. A score must be an integer `1..5` and correspond to a configured rubric level. If evidence does not support a defensible level, the score is `null` and sufficiency is `insufficient` or `partial` as appropriate. Any overall weighted rubric score is deterministic application code over non-null competency scores and is labeled a structured interview rubric score, never a hiring probability or decision.

### 5. Evidence citations and validator

After schema parsing, validate every evidence citation against the immutable transcript snapshot:

1. `messageSequence` exists exactly once;
2. scored candidate claims cite candidate-speaker turns where candidate evidence is required;
3. normalized quoted `excerpt` occurs in the cited message text;
4. cited messages belong to the same authoritative attempt;
5. duplicate/fabricated citations do not increase evidence sufficiency.

A validation failure rejects the generated assessment rather than silently dropping a scored claim. Explicit no-evidence/insufficient states remain valid.

### 6. Evidence sufficiency and question coverage

Evidence sufficiency is explicit per competency and overall. Question coverage is derived from authoritative interview-plan questions plus transcript/progress metadata, with `answered`, `partially_answered`, or `skipped`; technical interruption is contextual metadata so reviewers can distinguish missing evidence caused by platform issues. Technical interruption never directly reduces candidate scoring.

### 7. Provenance

Every assessment generation records enough immutable provenance to reproduce and audit the context:

```text
attempt id
assessment generation number
model/provider identifier
assessment prompt version
assessment guardrail version
interviewer version id
rubric/config version identity
transcript seal/version identity
created timestamp
```

Provenance is not model-authored; application code supplies it.

### 8. Persistence and generation lifecycle

Persist an append-only assessment generation with atomic states:

```text
pending → processing → completed
                    ↘ failed
```

Only one worker may claim a pending generation. Retrying the finalization trigger or generation request is idempotent for the same generation. Regeneration creates a later generation while retaining history. Completed payloads are immutable.

### 9. Model/eval boundary

Deterministic validators are authoritative over model output. Golden fixtures cover strong evidence, mixed/insufficient evidence, fabricated citations, transcript prompt injection, technical interruptions, and prohibited decision/inference content. Model-based tests may supplement but never replace deterministic schema/evidence tests.

## M07 Iteration Boundaries

1. **M07.1 Domain/schema** — application-owned immutable assessment types and fail-closed runtime parser.
2. **M07.2 Trusted prompt composition** — immutable trusted inputs plus delimited untrusted transcript.
3. **M07.3 Competency scoring** — rubric-aligned `1..5 | null` semantics and deterministic weighted summary boundary.
4. **M07.4 Evidence citations** — model/output citation structures tied to durable transcript sequence.
5. **M07.5 Evidence validator** — sequence/speaker/excerpt/attempt validation and fabricated-citation rejection.
6. **M07.6 Sufficiency + question coverage** — explicit sufficiency and asked/answered/partial/skipped context without technical penalties.
7. **M07.7 Injection defense** — adversarial transcript data cannot alter policy/schema/scoring rules.
8. **M07.8 Provenance** — application-owned prompt/model/rubric/interviewer/guardrail/transcript version capture.
9. **M07.9 Idempotent generation** — atomic pending/processing/completed/failed claim and completion.
10. **M07.10 Regeneration/history** — append-only later generations and preserved prior results.
11. **M07.11 Golden fixtures** — deterministic and provider/model acceptance cases spanning safety and evidence integrity.

## Testing Strategy

Every behavioral iteration follows strict RED → verify intended failure → minimal GREEN. Pure domain validation uses Vitest. Persistence and tenancy use migration/repository tests plus local Supabase/RLS verification. Prompt/injection tests use deterministic fake model output and adversarial transcript content. Generation lifecycle tests cover concurrency/idempotency. Browser work is limited to milestone acceptance needed to prove reviewable evidence if M08 does not own the final review UI.

## Review Gates

- **Security/privacy:** tenant/attempt isolation, no unrelated candidate data in prompts, no cross-attempt evidence, append-only history, no raw secrets.
- **AI safety:** no autonomous hire/reject, protected-trait or biometric proxy scoring, accent/emotion/personality/deception inference, transcript instruction execution, fabricated evidence, or forced certainty.
- **Architecture/YAGNI:** provider-neutral model boundary, deterministic validation before persistence, no generic workflow engine or speculative vector/RAG layer.
- **Performance:** bounded prompt/output sizes, indexed attempt/generation reads, no N+1 evidence lookup during validation.
- **Accessibility:** any M07 user-visible assessment state must remain semantic and keyboard-readable; full reviewer interaction remains M08 scope.
