# Current Milestone

Milestone:
Candidates + Invitations

Legacy roadmap identifier:
M04

Status:
CLOSEOUT / MERGE GATE

Branch:
`feat/candidates-invitations`

Base:
`main` at verified M03 merge SHA `729474ffb03075c93dfa2564f0004f1590533753`

PR:
#6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged pending final documentation-head CI.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M04.1 — Candidate records — **VERIFIED**.
2. M04.2 — Secure token service + invitation persistence — **VERIFIED**.
3. M04.3 — Invitation lifecycle — **VERIFIED**.
4. M04.4 — Public candidate route / invitation resolution — **VERIFIED**.
5. M04.5 — Pre-interview experience — **VERIFIED**.
6. M04.6 — Disclosure + consent — **VERIFIED**.
7. M04.7 — Accommodation/support path — **VERIFIED**.
8. M04.8 — Security/browser closeout — **VERIFIED** on implementation head `8a6f6cc8adba2d39f2b255a74db166e3285527ba`, CI #507 / `34691558117`.

## Latest Verification

CI #507 passed the complete repository quality gate on `8a6f6cc8adba2d39f2b255a74db166e3285527ba`: frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase startup, production build, Chromium E2E, PRD coverage, and cleanup.

The M04.8 browser closeout proves a valid invitation renders the safe public projection on a 390×844 viewport without horizontal overflow; consent is keyboard reachable and recordable; trusted organization support links are exposed; and wrong, expired, revoked, and completed tokens all collapse to the same unavailable browser state.

The immediately preceding CI #505 failure was diagnosed as a stale organization-settings keyboard expectation after two legitimate candidate-support inputs were added. Commit `ac047aff7cffb335226702e24b443cd1706796a9` updated the accessibility test to traverse those fields; exact-head CI #506 / `34691250632` passed the complete gate.

## Review State

- Unresolved Critical findings: **0**.
- Unresolved Important findings: **0**.
- Unresolved GitHub review threads: **0** at latest recovery.
- Security review confirms raw invitation tokens are hashed server-side and never persisted; RLS/constraints/RPCs remain authoritative; public resolution exposes only a narrow safe projection; invalid/unusable tokens fail closed; consent evidence is append-only from browser roles; interview start requires current disclosure consent; organization support settings remain owner/admin constrained by organization RLS.
- Accessibility review confirms semantic disclosure/support sections, explicit required consent, keyboard reachability, status/error semantics, and narrow viewport no-overflow coverage.
- Performance/YAGNI review found no unbounded public read or speculative abstraction; token resolution is a single hash lookup and bounded projection.
- AI-safety review preserves human hiring decisions and discloses AI/transcription/data-processing/retention before start.

## Next Action

Reconcile final durable status/traceability/feature-matrix/PR description. Because those documentation commits create a new head, run and verify fresh exact-final-head CI. If it is green and PR/review/concurrency/mergeability gates remain satisfied, mark PR #6 ready if required and squash-merge automatically under the repository owner's standing authorization. Then verify post-merge `main` CI and immediately activate M05 — Realtime AI Interview.
