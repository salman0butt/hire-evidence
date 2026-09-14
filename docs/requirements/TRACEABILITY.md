# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests / evidence | Status |
|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane + durable status/handoff/ledgers | framework verifier/CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | current autonomous recovery | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | intended RED checkpoints followed by minimal GREEN and regressions | provider-interruption RED `6d22bdf…` CI #772 → GREEN `d191b0d…` CI #773 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/accessibility review | 0 unresolved Critical/Important at latest M05 recovery | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | pre-closeout `5c871055…`, CI #781 GREEN; closeout head pending | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | PR #7 reused and remote head checked before writes | no competing same-unit head at latest recovery | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | auth/profile shell | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | PR #5; post-merge CI #432 | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations | Candidates + Invitations | M04 design/plan | candidate records, secure invitations, lifecycle, public projection, consent, support path | PR #6; post-merge CI #517 | VERIFIED |
| M05-AUTH — Invitation/consent/version-gated realtime authorization | Realtime AI Interview | M05 design/plan | authoritative attempt binding + consent/version gates + realtime-session + capability-bound progress | unit/provider/security/browser | VERIFIED |
| M05-PROVIDER — Short-lived Gemini provider credential boundary | Realtime AI Interview | M05 design/plan | server-only `GEMINI_API_KEY`, constrained ephemeral credential issuance | unit/security/integration + fail-closed browser path | VERIFIED (REPOSITORY SCOPE) |
| M05-DIAGNOSTICS — Browser/network/microphone prerequisites | Realtime AI Interview | M05 design/plan | secure-context/network/media/getUserMedia/AudioContext/AudioWorklet/permission/device/input-level diagnostics | unit/component/browser | VERIFIED |
| M05-DIAGNOSTICS-UI — Accessible candidate technical check | Realtime AI Interview | M05 design/plan | semantic status/error/retry UI, device selection, input-level readiness | component/browser | VERIFIED |
| M05-AUDIO-CAPTURE — Deterministic Web Audio capture | Realtime AI Interview | M05 design/plan | mono worklet capture, mute, stale-generation rejection, idempotent cleanup | unit/resource-lifecycle | VERIFIED |
| M05-TRANSPORT — Provider-neutral realtime transport | Realtime AI Interview | M05 design/plan | app-owned transport plus Gemini Live adapter with provider schema isolated | unit/integration/production composition | VERIFIED (REPOSITORY SCOPE) |
| M05-PLAYBACK — AI audio playback/barge-in | Realtime AI Interview | M05 design/plan | serialized PCM queue, interruption epoch, candidate/provider barge-in, stale callback rejection | RED CI #772 → GREEN CI #773 | VERIFIED |
| M05-CONNECTION — Explicit connection state | Realtime AI Interview | M05 design/plan | app-owned lifecycle + generation-scoped recovery + accessible controls | unit/component/browser | VERIFIED |
| M05-PLAN — Deterministic immutable interview-plan execution | Realtime AI Interview | M05 design/plan | immutable snapshot, exact cursor, replay/out-of-order rejection, current-question authority | unit/adversarial | VERIFIED |
| M05-PACING — Monotonic time budget | Realtime AI Interview | M05 design/plan | active-time accounting, backwards-clock resistance, deadline suppression | unit | VERIFIED |
| M05-FOLLOWUP — Bounded job-related follow-ups | Realtime AI Interview | M05 design/plan | deterministic allowed categories, configured + absolute limits, prohibited inference rejection | unit/adversarial | VERIFIED |
| M05-ORCHESTRATION — Multi-turn realtime controller | Realtime AI Interview | M05 design/plan | deterministic progression, playback/barge-in routing, production launcher/runtime composition, candidate-safe snapshots | unit/component/browser | VERIFIED (REPOSITORY SCOPE) |
| M05-RECOVERY — Timeout/error handling | Realtime AI Interview | M05 design/plan | bounded retry vs terminal-safe decisions with no evaluation mutation | unit/security/browser | VERIFIED |
| M05-RECONNECT — Same authoritative attempt | Realtime AI Interview | M05 design/plan | validated resume checkpoints, capability-bound progress, idempotency, persistence gating, browser reauthorization | unit/provider/security/browser | VERIFIED |
| M05-E2E — Stable multi-turn realtime interview repository acceptance | Realtime AI Interview | M05 design/plan | deterministic production launcher/runtime acceptance plus provider-boundary/failure coverage | browser E2E + security/accessibility/AI-safety gates | REPOSITORY ACCEPTANCE COMPLETE; FINAL EXACT-HEAD CI PENDING |
| M05-LIVE-SMOKE — Real Gemini external-provider acceptance | Realtime AI Interview deployment | `docs/LOCAL-REALTIME-ACCEPTANCE.md` | real provider/deployment configuration | manual local/deployment smoke using owner-supplied server credential | DEFERRED TO LOCAL/DEPLOYMENT; NOT CLAIMED AS EXECUTED |
| PRD 58+ / 200 — Realtime AI Interview milestone | Realtime AI Interview | M05 design/plan | M05.1–M05.14 | PR #7 final exact-head CI + merge + post-merge main | CLOSEOUT / MERGE GATE |
| PRD roadmap — Durable transcript/session continuity | Transcript + Durable Session | M06 | pending activation after M05 merge | pending | PLANNED |
| PRD roadmap — Evidence-grounded assessment | Evidence-Based Assessment | M07 | pending | pending | PLANNED |
| PRD roadmap — Hiring-team review | Hiring Team Review | M08 | pending | pending | PLANNED |

## Active requirement interpretation

M00–M04 are integrated on `main`. M05 repository implementation is complete on PR #7 and has deterministic coverage for the app-owned production path: authorization, short-lived credential boundary, Gemini adapter isolation, browser composition, microphone diagnostics, audio lifecycle, immutable plan execution, bounded follow-ups, pacing, interruption, timeout/error handling, authoritative persistence, and same-attempt reconnect.

The pre-closeout head `5c8710559ab1c40073843cb9a7909e626d8a0dc3` passed complete CI #781 / `34860464517`. The closeout documentation head requires a fresh exact-SHA run before merge.

On 2026-09-14 the owner explicitly chose to supply real Gemini credentials locally. The external live-provider smoke is therefore tracked separately as deployment acceptance and is not fabricated as repository evidence. `docs/LOCAL-REALTIME-ACCEPTANCE.md` defines the smoke and secret-handling rules. Any future smoke failure must be fixed before using that deployment for candidate interviews.