# M07 — Evidence-Based Assessment Engine

Status: **IMPLEMENTATION COMPLETE — CLOSEOUT / MERGE GATE**

## Goal
Deliver a provider-neutral, runtime-validatable, evidence-grounded assessment engine that is reviewable, versioned, and safe for human hiring-team review without making autonomous hiring decisions.

## Authoritative PRD Milestone Definition
Deliver structured assessment, competency scores, rubric enforcement, evidence citations/sufficiency, strengths, concerns, question coverage, guardrails, schema validation, prompt-injection defense and assessment provenance. Do not include autonomous hire/reject. Exit: assessment is reviewable and every score is evidence-grounded.

## Dependencies
M06 merged as `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`; post-merge CI #875 passed before M07 activation. M03 already verified jobs/competencies/rubrics/questions and immutable published interviewer versions.

## In Scope
Runtime-validatable assessment output; trusted immutable inputs/prompts; configured rubric scoring; transcript citations/evidence validation; evidence sufficiency/question coverage; prompt-injection and prohibited-output defense; application-owned provenance; tenant-safe append-only generation persistence; immutable regeneration/history; deterministic integrated/adversarial acceptance.

## Out of Scope
Autonomous hire/reject/strong-hire decisions, candidate success probability, M08 hiring-team review UX, coding sandbox, speculative later-milestone abstractions, and real-provider deployment smoke unrelated to deterministic M07 repository acceptance.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-15-evidence-assessment-engine-design.md`.
- Plan: `docs/superpowers/plans/2026-09-15-evidence-assessment-engine.md`.

## Acceptance Criteria
- **PASS** — structured assessment is runtime validated.
- **PASS** — every non-null competency score is 1–5, rubric-aligned and backed by validated same-attempt candidate transcript evidence.
- **PASS** — insufficient evidence remains explicit / `score: null`.
- **PASS** — transcript instructions remain inert data and cannot alter policy/rubric/schema/evidence/guardrails.
- **PASS** — no autonomous hiring outcome/probability or prohibited inference.
- **PASS** — generation/provenance/history are append-only, retry-safe and tenant/attempt scoped.
- **PASS** — all M07.1–M07.11 implementation iterations complete with 0 known unresolved Critical/Important findings.
- **PENDING FINAL HEAD** — framework-contract documentation fix requires fresh exact-head CI before merge.

## Tasks / Iterations
1. **VERIFIED** — M07.1 runtime-validatable assessment domain/schema.
2. **VERIFIED** — M07.2 trusted immutable input and prompt composition.
3. **VERIFIED** — M07.3 configured rubric-aligned competency scoring.
4. **VERIFIED** — M07.4 bounded evidence citations.
5. **VERIFIED** — M07.5 durable same-attempt evidence validator/fabricated-citation rejection.
6. **VERIFIED** — M07.6 evidence sufficiency/question coverage with non-evaluative technical context.
7. **VERIFIED** — M07.7 prompt-injection/prohibited-output defense.
8. **VERIFIED** — M07.8 application-owned provenance.
9. **VERIFIED** — M07.9 idempotent tenant-safe generation persistence.
10. **VERIFIED** — M07.10 append-only regeneration/history.
11. **VERIFIED IMPLEMENTATION** — M07.11 integrated/adversarial acceptance; final documentation head verification active.

## TDD Evidence
- M07.8 provenance RED `f374920e567231d91030144c8a37391437c964ca` → GREEN `a96e686474af27b5038146cd98637b325f415277`, CI #902 GREEN.
- M07.9 migration RED `366218c1a633ba102e19423332bcddcd40c82a7a` → `c595b89453335730080b163d902717c31a78cdd0`, CI #904 GREEN.
- M07.9 repository RED `b2c10d6d8aa7248dd28a86cf5322118115558a80` → GREEN `cd1a4ec02df32625b544b1a01560ba3d59c73b99`, CI #906 GREEN.
- M07.10 history RED `55cc238d794a42671b43a1102fa37fc3cab6390b` → GREEN `86afd0179bd7f4ad004b0506aeb2ad6df81e695a`, CI #908 GREEN.
- M07.11 integrated RED `82a65ab8d3a81d0e3befe17166ef3d40da69078a`, CI #909, reached the intended missing `assessment-pipeline` boundary.
- Integrated implementation `77146dfef64e03290f03b05c5a9fdac0bfa9398e` + safety fix `121bfdf3452fc4ef1e02ce5f39a1feb8f8cb99fe`, CI #911 GREEN.

## Integration Test Evidence
The integrated assessment pipeline proves grounded scoring, explicit insufficient evidence, fabricated-citation rejection, candidate prompt-injection inertness and prohibited-inference rejection in model-authored rationale. CI #911 verified the implementation head. CI #917 on the first closeout-doc head additionally passed lint, typecheck and all 622 unit/component tests before the framework verifier detected missing required documentation headings.

## E2E / Visual Verification
M07 introduces no new reviewer UI; M08 owns the full review experience. Existing repository browser gates remain part of the full CI gate and must pass on the final closeout head.

## Security Review
Tenant/attempt isolation is enforced through RLS/security-definer RPC/repository boundaries; direct unsafe assessment mutation is denied. Candidate transcript text is inert untrusted data. Evidence validation rejects nonexistent/wrong-speaker/absent/fabricated citations. Persistence completion is validation-gated/fail-closed. Application-owned provenance cannot be overridden by model output. No autonomous hiring decision/probability exists.

## Accessibility Review
No new user-facing M07 interaction. Structured assessment data is prepared for accessible human review in M08; existing application accessibility gates remain required.

## Performance Review
Evidence validation uses indexed transcript lookup; generation history is attempt-scoped and ordered. No unbounded cross-tenant history scan or speculative optimization introduced.

## AI / Eval Review
Deterministic validators remain authoritative. Candidate prompt injection is inert; model-authored summary/strengths/concerns/rationales are guardrail-scanned; insufficient evidence is explicit; fabricated evidence and prohibited inference fail closed.

## Code Review Findings
Critical: **0 known unresolved**.
Important: **0 known unresolved**. M07.11 review found competency rationales missing from prohibited-inference scanning; `121bfdf3…` fixed this while raw candidate evidence excerpts remain excluded from rationale scanning. CI #911 verified the fix.

## Fixes / Re-review
The rationale guardrail finding is resolved and re-verified. CI #917 later exposed a documentation-framework regression only: required ledger/status headings were omitted during closeout rewriting. Application tests were green; this commit restores the exact framework headings and requires fresh CI.

## Fresh Verification Commands
Repository CI executes frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase, build, Chromium E2E and PRD coverage.

## Fresh Verification Results
- Implementation head `121bfdf3452fc4ef1e02ce5f39a1feb8f8cb99fe`: CI #911 / run `35049947377` **GREEN**.
- First closeout-doc head `3e45d016575418494c8a9cdcf438109b02775633`: CI #917 / run `35054114221` **NOT GREEN**. Install/lint/typecheck/622 tests/verifier unit tests passed; `verify_autonomous_framework.py` failed solely because closeout docs omitted required headings/`CI status:`. Downstream Supabase/build/E2E/coverage were skipped. The stop-step Supabase error was a consequence of setup being skipped, not the root cause.
- Current framework-documentation fix: fresh exact-head CI required before merge.

## Known Limitations
Real external Gemini deployment smoke remains separately deferred from M05 and is not fabricated as M07 evidence. M07 intentionally does not implement hiring-team review UI or autonomous hiring decisions.

## Documentation Updated
`docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, `docs/requirements/TRACEABILITY.md`, `docs/FEATURE-MATRIX.md`, and PR #9 description are reconciled to M07 closeout reality.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → this ledger → requirements/traceability → selected spec/plan → PR #9/reviews/exact-head CI → source/tests.

## Completion Checklist
- [x] Requirements and iterations accounted for.
- [x] Acceptance behavior implemented and verified at implementation head.
- [x] Required TDD/integration/security/adversarial evidence exists.
- [x] Security/accessibility/performance/AI-safety reviews complete for M07 scope.
- [x] 0 known unresolved Critical / Important findings.
- [x] Traceability/feature matrix reconciled.
- [ ] Exact-final-documentation-head CI green.
- [ ] PR #9 merged under authorized merge gate.
- [ ] Post-merge `main` CI green.

## Next Milestone
M08 — Hiring Team Review Experience. Activate automatically only after M07 merge and post-merge `main` verification.