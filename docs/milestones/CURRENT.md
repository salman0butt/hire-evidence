# Current Milestone

Milestone:
Realtime AI Interview

Legacy roadmap identifier:
M05

Status:
ACTIVE

Branch:
`feat/realtime-ai-interview`

Base:
`main` at verified M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`

PR:
#7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged. Reuse this PR for M05; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M05.1 — Reference characterization — **VERIFIED**.
2. M05.2 — Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**; provider-neutral authorization/persistence/token lifetime boundaries exist, while provider-specific credential issuance remains blocked on authoritative provider selection.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**.
5. M05.5 — Provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**; provider adapter remains blocked until provider selection is authoritative.
6. M05.6 — AI audio playback — **VERIFIED**.
7. M05.7 — Connection state machine + accessible controls — **VERIFIED**.
8. M05.8 — Deterministic interview-plan execution — **VERIFIED**.
9. M05.9 — Pacing/time budget — **VERIFIED**.
10. M05.10 — Bounded follow-ups — **VERIFIED**.
11. M05.11 — Realtime orchestration — **ACTIVE / PARTIALLY VERIFIED**; provider-neutral controller/presentation behavior is verified, live provider/page composition remains blocked.
12. M05.12 — Timeout/error handling — **VERIFIED (provider-neutral scope)**.
13. M05.13 — Same-attempt reconnect — **VERIFIED (provider-neutral scope)**. Authoritative resume/persistence state and runtime persistence gating are implemented; malformed/conflicting persistence fails closed. Provider-backed reconnect remains blocked by provider selection.
14. M05.14 — Full realtime E2E and closeout — **ACTIVE / PARTIALLY VERIFIED**. Deterministic candidate-page browser coverage now proves microphone denial → retry recovery, keyboard focus, input enumeration/selection, mobile no-overflow, and that the readiness check does not start recording. The stable live multi-turn provider-backed exit remains blocked.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

Latest verified M05 browser head `1c4635618aa1d3471284ca30cfb8658981afdd94` passed CI #682 / `34734661625`: frozen dependencies, lint, typecheck, 480 unit/component tests, framework/source verification, local Supabase, production build, 25 Chromium E2E tests including the new realtime readiness/recovery scenario, PRD coverage, and cleanup all GREEN.

M05.14 browser evidence history:
- initial browser checkpoint `829d9d92c3f9b92d32944b54622436b1a54b63a5`, CI #681 / `34734365068` — **NOT GREEN**: product behavior was correct but the test used an ambiguous `role=alert` locator that also matched the Next.js route announcer; 24 existing E2E tests passed.
- reviewed browser GREEN `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — locator narrowed to the technical-check alert; complete repository gate GREEN.

Recent M05.13 evidence:
- runtime persistence RED `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547` — orchestration lacked the required authoritative persistence boundary.
- runtime persistence implementation `cff7cc7e0c3c5ce0db27319bc4728811c7a1f53c` — local progression waits for server persistence and consumes the returned checkpoint.
- review RED `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412` — malformed persisted checkpoint escaped as an exception.
- reviewed GREEN `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242` — invalid/conflicting/rejected persistence fails closed; complete repository gate GREEN.

## Review State

- Unresolved Critical findings: **0** for implemented M05 slices.
- Unresolved Important findings: **0** for verified provider-neutral slices through the latest browser slice.
- PR #7 had no unresolved review threads at the latest recovery check.
- The M05.14 CI failure was a test-locator defect, not a production behavior defect; it is fixed and exact-head verified.

## Blocker

No authoritative realtime provider SDK/configuration has been selected. Do not invent one. This blocks provider credential issuance, provider adapter composition, live interview page wiring, provider-backed reconnect, and the final stable live multi-turn browser exit criterion. It does not block further deterministic provider-neutral verification.

## Next Action

Continue M05.14 with the next largest deterministic browser/E2E verification slice that can exercise real candidate-facing behavior without fabricated provider coupling. Keep PR #7 draft and unmerged until the live provider path and all milestone acceptance gates are genuinely satisfied.
