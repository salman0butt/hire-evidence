# M07 — Evidence-Based Assessment Engine

Status: **IMPLEMENTATION COMPLETE — CLOSEOUT / MERGE GATE**

## Goal
Deliver a provider-neutral, runtime-validatable, evidence-grounded assessment engine that is reviewable, versioned, and safe for human hiring-team review without making autonomous hiring decisions.

## Authoritative PRD Milestone Definition

MILESTONE 07 — EVIDENCE-BASED ASSESSMENT ENGINE

Deliver: structured assessment, competency scores, rubric enforcement, evidence citations, evidence sufficiency, strengths, concerns, question coverage, guardrails, schema validation, prompt-injection defense, and assessment provenance. Do not include autonomous hire/reject. Exit: assessment is reviewable and every score is evidence-grounded.

## Dependencies
M06 Durable Transcript + Durable Session merged as `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`; post-merge main CI #875 passed before M07 activation. Jobs/competencies/rubrics/questions and immutable published interviewer versions were already verified from M03.

## Selected Design / Plan
- Design: `docs/superpowers/specs/2026-09-15-evidence-assessment-engine-design.md`.
- Plan: `docs/superpowers/plans/2026-09-15-evidence-assessment-engine.md`.

## Acceptance Criteria
- **PASS** — structured assessment is runtime validated.
- **PASS** — every non-null competency score is 1–5, rubric-aligned and backed by validated same-attempt candidate transcript evidence.
- **PASS** — insufficient evidence yields explicit insufficient state / `score: null`; no forced certainty.
- **PASS** — transcript instructions remain inert data and cannot alter policy/rubric/schema/evidence/guardrails.
- **PASS** — no autonomous hire/reject/strong-hire outcome or candidate success probability.
- **PASS** — prohibited protected-trait/biometric/appearance/emotion/accent/personality/deception/health/political/union/socioeconomic inference is rejected in model-authored evaluative text.
- **PASS** — generation/provenance/history are append-only, retry-safe and tenant/attempt scoped.
- **PASS** — all M07.1–M07.11 implementation iterations are complete.
- **PASS** — latest implementation exact-head CI is green and 0 known unresolved Critical/Important findings remain.
- **PENDING FINAL DOC HEAD** — closeout docs/traceability are being reconciled and require fresh exact-final-head CI before merge.

## Tasks / Iterations
1. **VERIFIED** — M07.1 runtime-validatable assessment domain/schema.
2. **VERIFIED** — M07.2 trusted immutable input and prompt composition.
3. **VERIFIED** — M07.3 configured rubric-aligned competency scoring.
4. **VERIFIED** — M07.4 bounded evidence citation structures.
5. **VERIFIED** — M07.5 durable same-attempt evidence validator and fabricated-citation rejection.
6. **VERIFIED** — M07.6 evidence sufficiency and deterministic question coverage with non-evaluative technical interruption context.
7. **VERIFIED** — M07.7 prompt-injection/prohibited-output defense.
8. **VERIFIED** — M07.8 application-owned assessment provenance.
9. **VERIFIED** — M07.9 idempotent tenant-safe generation persistence.
10. **VERIFIED** — M07.10 append-only regeneration/history.
11. **VERIFIED IMPLEMENTATION** — M07.11 integrated acceptance and safety closeout; final documentation head verification remains.

## TDD / Integration Evidence

M07 was developed through genuine RED→GREEN checkpoints. Late milestone evidence includes:
- M07.8 provenance RED `f374920e567231d91030144c8a37391437c964ca` → GREEN `a96e686474af27b5038146cd98637b325f415277`, CI #902 GREEN.
- M07.9 persistence migration RED `366218c1a633ba102e19423332bcddcd40c82a7a` → implementation `c595b89453335730080b163d902717c31a78cdd0`, CI #904 GREEN.
- M07.9 repository boundary RED `b2c10d6d8aa7248dd28a86cf5322118115558a80` → GREEN `cd1a4ec02df32625b544b1a01560ba3d59c73b99`, CI #906 GREEN.
- M07.10 history RED `55cc238d794a42671b43a1102fa37fc3cab6390b` → GREEN `86afd0179bd7f4ad004b0506aeb2ad6df81e695a`, CI #908 GREEN.
- M07.11 integrated RED `82a65ab8d3a81d0e3befe17166ef3d40da69078a`, CI #909, failed at the intended missing `assessment-pipeline` boundary.
- Integrated pipeline `77146dfef64e03290f03b05c5a9fdac0bfa9398e` plus rationale safety fix `121bfdf3452fc4ef1e02ce5f39a1feb8f8cb99fe`; exact-head CI #911 / run `35049947377` GREEN.

The integrated acceptance covers grounded scoring, explicit insufficient evidence, fabricated-citation rejection, candidate prompt-injection inertness, and prohibited inference in model-authored rationale.

## Security / AI-Safety Review

- Tenant/attempt isolation is enforced through RLS/security-definer RPC and repository boundaries; direct unsafe assessment mutation is denied.
- Completed generation mutation is not the regeneration mechanism; regeneration creates a new append-only generation.
- Candidate transcript text is untrusted evidence data and is not interpreted as policy or model rationale.
- Evidence validation rejects nonexistent sequence, wrong speaker, absent excerpt, duplicate transcript sequence and mixed fabricated evidence.
- Persistence completion is validation-gated and fail-closed.
- Application-owned provenance cannot be overridden by model output.
- No autonomous hiring decision or unsupported candidate-success probability exists.

## Code Review Findings

Critical: **0 known unresolved**.

Important: **0 known unresolved**. During M07.11 review, competency rationales were found to be omitted from prohibited-inference scanning. Fix `121bfdf3…` adds rationales to evaluative guardrail input while deliberately excluding raw candidate evidence excerpts. CI #911 verified the fix.

Minor/deferred: external GitHub Actions/Node maintenance notices remain informational and are not M07 correctness blockers.

## Performance / Accessibility Review

Evidence validation indexes transcript turns rather than repeatedly scanning for sequence lookup; generation history is bounded by attempt and ordered by generation. No new user-facing M07 interaction is introduced; full assessment-review UX/accessibility belongs to M08. Existing assessment data remains structured for accessible review presentation.

## Verification

Latest fully verified implementation head: `121bfdf3452fc4ef1e02ce5f39a1feb8f8cb99fe`.
CI #911 / run `35049947377`: **GREEN**.

Repository CI is the authoritative full gate. Closeout documentation commits after `121bfdf3…` create a new exact head and must receive fresh exact-final-head GREEN CI before merge.

## Known Limitations

Real external Gemini deployment smoke remains separately deferred from M05 and is not fabricated as M07 evidence. M07 intentionally does not implement the hiring-team review UI; that is M08 scope. M07 also does not make hire/reject decisions.

## Completion Checklist
- [x] Requirements and iterations accounted for.
- [x] Acceptance behavior implemented and verified at implementation head.
- [x] Required TDD/integration/security/adversarial evidence exists.
- [x] Security/performance/AI-safety review complete for M07 scope.
- [x] 0 known unresolved Critical / Important findings.
- [x] Traceability and feature matrix reconciled in closeout commits.
- [ ] Exact-final-documentation-head CI green.
- [ ] PR #9 merged under authorized merge gate.
- [ ] Post-merge `main` CI green.

## Next Milestone
M08 — Hiring Team Review Experience. Activate automatically only after M07 merge and post-merge `main` verification.