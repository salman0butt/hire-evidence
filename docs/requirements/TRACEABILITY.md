# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests / evidence | Status |
|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane + durable status/handoff/ledgers | framework verifier/CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | current autonomous recovery | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | intended RED checkpoints followed by minimal GREEN | M06.9 RED `02dfe470…` CI #863 → GREEN `ddf3d320…` CI #864 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/accessibility review | M06 closeout: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | implementation head `ddf3d320…`, CI #864 GREEN; final docs head pending | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | active PR reused and remote head checked before writes | PR #8 reused; no competing same-unit head during closeout writes | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | auth/profile shell | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | PR #5; post-merge CI #432 | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations | Candidates + Invitations | M04 design/plan | candidate records, secure invitations, lifecycle, public projection, consent, support path | PR #6; post-merge CI #517 | VERIFIED |
| M05-AUTH — Invitation/consent/version-gated realtime authorization | Realtime AI Interview | M05 design/plan | authoritative attempt binding + consent/version gates + realtime-session + capability-bound progress | PR #7 / post-merge main | VERIFIED |
| M05-PROVIDER — Short-lived Gemini provider credential boundary | Realtime AI Interview | M05 design/plan | server-only provider key + constrained ephemeral issuance | repository security/integration/browser acceptance | VERIFIED (REPOSITORY SCOPE) |
| M05-DIAGNOSTICS — Browser/network/microphone prerequisites | Realtime AI Interview | M05 design/plan | technical diagnostics and accessible check UI | unit/component/browser | VERIFIED |
| M05-AUDIO — Capture/playback/barge-in | Realtime AI Interview | M05 design/plan | mono worklet capture, serialized playback, interruption/stale-callback guards | unit/resource-lifecycle/browser | VERIFIED |
| M05-PLAN — Deterministic immutable interview execution | Realtime AI Interview | M05 design/plan | immutable plan/cursor, bounded follow-ups, pacing | unit/adversarial | VERIFIED |
| M05-RECOVERY — Same-attempt reconnect and technical recovery | Realtime AI Interview | M05 design/plan | generation-safe reconnect, capability-bound progress, bounded retry | unit/security/browser | VERIFIED |
| M05-LIVE-SMOKE — Real Gemini external-provider acceptance | Realtime AI Interview deployment | `docs/LOCAL-REALTIME-ACCEPTANCE.md` | deployment-only owner-supplied credential smoke | manual smoke; never claimed as repository CI | DEFERRED TO DEPLOYMENT |
| M06-TRANSPORT — Provider-neutral partial/final transcript events | Transcript + Durable Session | M06 design/plan | normalized speaker/finality transport vocabulary + Gemini mapping | M06.1 tests; CI #796 | VERIFIED |
| M06-STATE — Ephemeral partials vs immutable finalized turns | Transcript + Durable Session | M06 design/plan | transcript state integrated into realtime session snapshots | RED CI #800 → GREEN CI #804 | VERIFIED |
| M06-DURABLE — Attempt-scoped immutable finalized transcript storage | Transcript + Durable Session | M06 design/plan | migration + capability-bound repository/RPC + ordered server sequence | M06.3 RED CI #806/#809 → GREEN CI #810 | VERIFIED |
| M06-CORRECTNESS — Duplicate/order/speaker/immutability guards | Transcript + Durable Session | M06 design/plan | fail-closed repository/service validation | chronology RED CI #821 → GREEN CI #822 plus adversarial branch history | VERIFIED |
| M06-LIFECYCLE — Idempotent authoritative attempt lifecycle | Transcript + Durable Session | M06 design/plan | replay-safe attempt state/progress handling | terminal-replay RED CI #823 → GREEN CI #824 | VERIFIED |
| M06-RECONNECT — Same-attempt durable transcript restoration | Transcript + Durable Session | M06 design/plan | authorization transcript bootstrap + runtime hydration; partials discarded | branch tests + integrated CI #861 | VERIFIED |
| M06-TECHNICAL — Separate interruption event persistence | Transcript + Durable Session | M06 design/plan | provider/browser/microphone/reconnect events stored separately from transcript/evaluation | branch tests + integrated CI #861; M06.9 browser acceptance | VERIFIED |
| M06-FINALIZE — Idempotent session finalization | Transcript + Durable Session | M06 design/plan | seal/completion/duration + exactly-once assessment marker | branch tests + integrated CI #861 | VERIFIED |
| M06-E2E — Durable transcript/session browser acceptance | Transcript + Durable Session | M06 design/plan | accessible transcript presentation over restored runtime state + separate technical event path | RED `02dfe470…` CI #863 → GREEN `ddf3d320…` CI #864 | VERIFIED |
| PRD roadmap — Durable transcript/session continuity | Transcript + Durable Session | M06 design/plan | M06.1–M06.9 | PR #8 implementation complete; final docs exact-head CI/merge gate pending | CLOSEOUT / MERGE GATE |
| PRD roadmap — Evidence-grounded assessment | Evidence-Based Assessment | M07 | pending activation after M06 merge | pending | PLANNED |
| PRD roadmap — Hiring-team review | Hiring Team Review | M08 | pending | pending | PLANNED |

## Active requirement interpretation

M00–M05 are integrated on `main`. M06 implementation and repository/browser acceptance are complete on PR #8. The latest fully verified implementation head is `ddf3d32024fc6d5c67115326aba0405ba87d0d96`, which passed CI #864 / run `34907376635` across frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase migration/application checks, build, Chromium E2E and PRD coverage.

M06 preserves the evidence boundary: partial hypotheses remain ephemeral; only finalized candidate/interviewer turns become durable immutable evidence; ordering and speaker identity are authoritative rather than content-inferred; technical interruptions remain separate/non-evaluative; reconnect is constrained to the same authoritative attempt; transcript content is inert untrusted data; and finalization is idempotent with an exactly-once assessment marker.

Closeout documentation commits after `ddf3d320…` require one fresh exact-final-head CI run before PR #8 may be merged. Real Gemini live smoke remains a separate deployment acceptance item and is not fabricated as repository evidence.