# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane + durable status/handoff/ledgers | framework tests | framework CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | recovery discipline | current autonomous runs recover live state | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | verifier tests | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | intended RED checkpoints followed by minimal GREEN and review regressions | unit/provider/browser | M05 persistence RED #671/#673 → GREEN #674 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/accessibility review | review checks | implemented M05 slices: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | full repository quality gate | behavioral head `5e9328d2…`, CI #674 / `34733465242` PASS; later documentation head requires fresh exact-head CI | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | PR #7 reused; remote head checked before writes | head/CI checks | no competing same-unit head observed | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | foundation suites | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | auth/profile shell | unit/E2E | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | unit/provider/E2E | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | unit/provider/browser | PR #5; post-merge CI #432 | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations | Candidates + Invitations | M04 design/plan | candidate records, secure invitations, lifecycle, public projection, consent, support path | unit/provider/browser | PR #6 merged `943e8a5…`; post-merge CI #517 | VERIFIED |
| M05-AUTH — Invitation/consent/version-gated realtime authorization | Realtime AI Interview | M05 design/plan | authorization service + authoritative attempt persistence + narrow handler/repository boundary | unit/provider/security | provider-neutral authorization and attempt persistence exact-head verified | ACTIVE / PROVIDER-BLOCKED |
| M05-PROVIDER — Short-lived provider credential boundary | Realtime AI Interview | M05 design/plan | lifetime enforcement + injected provider-neutral boundary | unit/security | provider-neutral checks green; production issuer blocked on authoritative provider choice | BLOCKED |
| M05-DIAGNOSTICS — Browser/network/microphone prerequisites | Realtime AI Interview | M05 design/plan | secure-context/network/media/getUserMedia/AudioContext/AudioWorklet/permission/device/input-level diagnostics | unit/component/browser | complete repository gates through CI #674 | VERIFIED |
| M05-DIAGNOSTICS-UI — Accessible candidate technical check | Realtime AI Interview | M05 design/plan | semantic status/error/retry UI, device selection, input-level readiness integrated before consent | component/browser | component + Chromium E2E gate through CI #674 | VERIFIED |
| M05-AUDIO-CAPTURE — Deterministic Web Audio capture | Realtime AI Interview | M05 design/plan | mono worklet capture, mute, stale-generation rejection, idempotent cleanup | unit/resource-lifecycle | exact-head repository gates green | VERIFIED |
| M05-TRANSPORT — Provider-neutral realtime transport | Realtime AI Interview | M05 design/plan | normalized app-owned transport + deterministic fake adapter | unit | provider-neutral behavior verified; provider adapter blocked | VERIFIED / PROVIDER-BLOCKED |
| M05-PLAYBACK — AI audio playback/barge-in | Realtime AI Interview | M05 design/plan | serialized PCM queue, interrupt epoch, stale callback rejection, cleanup | unit | exact-head repository gates green | VERIFIED |
| M05-CONNECTION — Explicit connection state | Realtime AI Interview | M05 design/plan | app-owned lifecycle + generation-scoped recovery + accessible controls | unit/component | exact-head repository gates green | VERIFIED |
| M05-PLAN — Deterministic immutable interview-plan execution | Realtime AI Interview | M05 design/plan | immutable snapshot, exact cursor, replay/out-of-order rejection, current-question-only authority | unit/adversarial | reviewed RED→GREEN history; gates green | VERIFIED |
| M05-PACING — Monotonic time budget | Realtime AI Interview | M05 design/plan | active-time accounting, backwards-clock resistance, deadline suppression, graceful completion | unit | RED #629 → GREEN #630 and later gates | VERIFIED |
| M05-FOLLOWUP — Bounded job-related follow-ups | Realtime AI Interview | M05 design/plan | deterministic allowed categories, configured + absolute limits, prohibited inference rejection | unit/adversarial | RED #631 → GREEN #632 and later gates | VERIFIED |
| M05-ORCHESTRATION — Provider-neutral multi-turn controller | Realtime AI Interview | M05 design/plan | deterministic progression, playback/barge-in routing, candidate-safe snapshots/presentation | unit/component | orchestration/presentation RED→GREEN history; latest gate #674 | ACTIVE / PROVIDER-BLOCKED |
| M05-RECOVERY — Timeout/error handling | Realtime AI Interview | M05 design/plan | bounded retry vs terminal-safe decisions with no evaluation mutation | unit/security | provider-neutral scope exact-head verified | VERIFIED |
| M05-RECONNECT — Same authoritative attempt | Realtime AI Interview | M05 design/plan | validated resume checkpoints, capability-bound progress RPC, processed-event idempotency, runtime persistence gating | unit/provider/security | repository RED #665/#667; runtime RED #671/#673; GREEN #674 | VERIFIED / PROVIDER-BLOCKED |
| M05-E2E — Stable live multi-turn browser interview | Realtime AI Interview | M05 design/plan | provider-specific live composition + full browser closeout | full realtime E2E + security/accessibility/AI-safety gates | existing repository E2E green; live provider scenario unavailable | BLOCKED |
| PRD 58+ / 200 — Stable multi-turn realtime interview milestone | Realtime AI Interview | M05 design/plan | M05.1–M05.14 | full realtime E2E + milestone review | PR #7 exact-final-head + post-merge main pending | ACTIVE / BLOCKED |
| PRD roadmap — Durable transcript/session continuity | Transcript + Durable Session | future M06 | pending | pending | pending | PLANNED |
| PRD roadmap — Evidence-grounded assessment | Evidence-Based Assessment | future M07 | pending | pending | pending | PLANNED |
| PRD roadmap — Hiring-team review | Hiring Team Review | future M08 | pending | pending | pending | PLANNED |

## Active requirement interpretation

M00–M04 are integrated on `main`; M04 is verified by post-merge CI #517. M05 remains active on draft PR #7. Provider-neutral work through same-attempt authoritative progress persistence is implemented and the latest behavioral head `5e9328d2f945cd10eaecea312896f29fbc93b10e` passed complete CI #674 / `34733465242`.

M05 cannot be declared complete or merged yet because the repository has no authoritative realtime provider selection/configuration. That unresolved external dependency blocks production provider credential issuance, provider adapter/live page composition, provider-backed reconnect, and the PRD exit criterion requiring a stable live multi-turn voice interview. Do not convert provider-neutral test doubles into fabricated production evidence. Continue only deterministic work that remains valid without choosing a vendor; keep PR #7 draft until the blocker and all closeout gates are resolved.
