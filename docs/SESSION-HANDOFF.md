# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `729474ffb03075c93dfa2564f0004f1590533753` (M03 PR #5); post-merge CI #432 / `34677775158` passed.
- Active branch: `feat/candidates-invitations`
- Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.
- Latest verified implementation head: `8a6f6cc8adba2d39f2b255a74db166e3285527ba`.
- CI #507 / `34691558117` passed the full repository gate on that implementation head.
- Durable-document reconciliation creates newer branch heads; fresh exact-final-head CI is mandatory before merge.

## Current milestone

M04 — Candidates + Invitations is at **CLOSEOUT / MERGE GATE**.

All iterations M04.1–M04.8 are verified: candidate persistence; secure hash-at-rest opaque invitations; lifecycle/replay controls; public token resolution; pre-interview UI; AI/transcription/data/retention disclosure and append-only consent; trusted accommodation/support path; provider/browser security closeout.

## Latest debugging / closeout evidence

CI #505 failed only in the older organization settings keyboard E2E after two legitimate candidate-support inputs were added. The UI implementation was correct; the test expected Save immediately after Hiring use case. Commit `ac047aff7cffb335226702e24b443cd1706796a9` updated the focus sequence to include candidate support email/URL. CI #506 / `34691250632` then passed the complete gate.

M04.8 added `e2e/candidate-invitation-ui.spec.ts` at `8a6f6cc8adba2d39f2b255a74db166e3285527ba`. CI #507 / `34691558117` passed install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase, build, Chromium E2E, PRD coverage, and cleanup. The browser test verifies the valid mobile invitation and consent flow plus the same unavailable state for wrong, expired, revoked, and completed tokens.

## Review / safety state

- Critical findings: 0 unresolved.
- Important findings: 0 unresolved.
- GitHub review threads: 0 unresolved at latest recovery.
- Raw invitation tokens are not persisted/logged; server hashes before the narrow public RPC.
- Tenant/job/candidate/version constraints and RLS remain authoritative.
- Consent is versioned and append-only from browser roles; current consent is required before `started`.
- Candidate support settings remain owner/admin constrained and only safe parsed destinations leave the public boundary.
- Humans remain hiring decision makers; no autonomous hire/reject or prohibited inference capability was added.

## Exact next work

1. Recover the exact current PR head and ensure no competing autonomous run advanced it.
2. Finish durable closeout (`STATUS`, `CURRENT`, M04 ledger, handoff, feature matrix, traceability, known issues, PR body).
3. Verify fresh CI against the exact final documentation head.
4. Recheck unresolved threads, mergeability, base/head stability and concurrency.
5. If every authorized gate is green, mark PR #6 ready if required and squash-merge it automatically.
6. Recover the new `main` SHA and verify post-merge main CI.
7. Activate M05 — Realtime AI Interview, create/reuse its feature branch and draft PR according to repo conventions, update durable state, and immediately begin the first valid TDD unit.
