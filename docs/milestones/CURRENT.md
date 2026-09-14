# Current Milestone

Milestone:
Evidence-Based Assessment Engine

Legacy roadmap identifier:
M07

Status:
IMPLEMENTING — M07.1 ASSESSMENT DOMAIN / SCHEMA

Branch:
`feat/evidence-assessment-engine`

Base:
`main` at verified M06 merge SHA `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`.

PR:
No active M07 PR yet. Create one draft after the first coherent implementation state; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

Selected design:
`docs/superpowers/specs/2026-09-15-evidence-assessment-engine-design.md`

Selected plan:
`docs/superpowers/plans/2026-09-15-evidence-assessment-engine.md`

## Iterations

1. M07.1 — Assessment domain/schema — **ACTIVE**.
2. M07.2 — Trusted prompt composition — **NOT STARTED**.
3. M07.3 — Competency scoring — **NOT STARTED**.
4. M07.4 — Evidence citations — **NOT STARTED**.
5. M07.5 — Evidence validator — **NOT STARTED**.
6. M07.6 — Evidence sufficiency + question coverage — **NOT STARTED**.
7. M07.7 — Prompt-injection defense — **NOT STARTED**.
8. M07.8 — Provenance — **NOT STARTED**.
9. M07.9 — Idempotent generation — **NOT STARTED**.
10. M07.10 — Regeneration/history — **NOT STARTED**.
11. M07.11 — Golden fixtures and closeout — **NOT STARTED**.

## Latest Verification

M06 PR #8 final head `a2bfed802c54b43ce76ea3cc590d52244b16b1de` passed CI #874 / run `34908831048`, then squash-merged as `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`.

Post-merge `main` CI #875 / run `34909208645` passed the complete repository gate on `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`.

M07 design commit: `a8b270c2e676b37ffde38a54851cdda10cb00e09`.
M07 plan commit: `7a68209f8352b4f1a5090712be828362ace7eb2f`.
No M07 behavioral RED/GREEN evidence exists yet; do not fabricate it.

## Review State

- Unresolved Critical findings: **0 known** at activation.
- Unresolved Important findings: **0 known** at activation.
- Fresh implementation review is required after meaningful M07 units.

## Constraints

- No autonomous hire/reject/strong-hire decision or candidate success probability.
- Score only configured job-relevant competencies against immutable published rubrics using `1..5 | null`.
- Insufficient evidence remains explicit and must not be converted into invented certainty.
- Every scored claim requires validated same-attempt durable transcript evidence.
- Transcript text is untrusted data, never assessment instruction.
- Technical interruptions remain separate, contextual and non-evaluative.
- No protected-trait, biometric, appearance, emotion, accent, personality, deception, health, political, union, socioeconomic or other prohibited inference.
- Assessment output must pass runtime schema, evidence and safety validation before persistence.
- Assessment generations and provenance are append-only/versioned.

## Next Action

Execute M07.1 under strict TDD: recheck the branch head for concurrency, commit the smallest meaningful failing assessment-schema test, verify the intended exact-SHA RED, implement the minimal runtime parser, verify GREEN, review/reconcile evidence, then continue to M07.2 without treating task completion as a stop condition.
