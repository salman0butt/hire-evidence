# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane | framework tests | framework CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | recovery discipline | current autonomous runs recover live state | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | verifier tests | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | test-first behavioral history with intended failures | unit/provider/browser | M05 selected-input RED #562 → GREEN #563 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/accessibility review | review checks | implemented M05 slices: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | full repository quality gate | behavioral head `2708322…`, CI #563 / `34701331592` PASS; later doc head pending fresh CI | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | PR #7 reused; remote head checked before writes | head/CI checks | no competing head observed during current work | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | foundation suites | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | auth/profile shell | unit/E2E | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | unit/provider/E2E | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | unit/provider/browser | PR #5; post-merge CI #432 | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations | Candidates + Invitations | M04 design/plan | candidate records, secure invitations, lifecycle, public projection, consent, support path | unit/provider/browser | PR #6 merged `943e8a5…`; post-merge CI #517 | VERIFIED |
| M05-AUTH — Invitation/consent/version-gated realtime authorization | Realtime AI Interview | M05 design/plan | authorization service + authoritative attempt persistence + narrow handler/repository boundary | unit/provider/security | RED #519/#524/#526; GREEN #527 and later #543 | ACTIVE |
| M05-PROVIDER — Short-lived provider credential boundary | Realtime AI Interview | M05 design/plan | lifetime enforcement + injected provider-neutral boundary | unit/security | provider-neutral checks green; production issuer blocked on authoritative provider choice | BLOCKED |
| M05-DIAGNOSTICS — Browser/network/microphone prerequisites | Realtime AI Interview | M05 design/plan | typed secure-context/media/getUserMedia/AudioContext/AudioWorklet/permission/input-count/network diagnostics | unit/component | RED #544; GREEN #545; network integration GREEN #561 | ACTIVE |
| M05-DIAGNOSTICS-UI — Accessible candidate technical check | Realtime AI Interview | M05 design/plan | semantic status/error/retry UI integrated before consent | component/browser | UI RED #547; existing browser gate through CI #563 | ACTIVE |
| M05-SELECTED-INPUT — Candidate-selected microphone verification | Realtime AI Interview | M05 design/plan | selected `deviceId` constraint supported by transient acquisition verifier | unit/typecheck | RED `1ac380e…` CI #562 → GREEN `2708322…` CI #563 | ACTIVE |
| M05-INPUT-LEVEL — Usable microphone input-level readiness | Realtime AI Interview | M05 design/plan | not implemented yet | pending | pending | PLANNED |
| M05-AUDIO-CAPTURE — Deterministic Web Audio capture | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-TRANSPORT — Provider-neutral realtime transport | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-PLAYBACK — AI audio playback/barge-in | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-CONNECTION — Explicit connection state | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-PLAN — Deterministic immutable interview-plan execution | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-PACING — Monotonic time budget | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-FOLLOWUP — Bounded job-related follow-ups | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| M05-RECOVERY — Timeout/error/reconnect same attempt | Realtime AI Interview | M05 design/plan | pending | pending | pending | PLANNED |
| PRD 58+ / 200 — Stable multi-turn realtime interview milestone | Realtime AI Interview | M05 design/plan | M05.1–M05.14 | full realtime E2E + security/accessibility/AI-safety gates | PR #7 exact-final-head + post-merge main pending | ACTIVE |
| PRD roadmap — Durable transcript/session continuity | Transcript + Durable Session | future M06 | pending | pending | pending | PLANNED |
| PRD roadmap — Evidence-grounded assessment | Evidence-Based Assessment | future M07 | pending | pending | pending | PLANNED |
| PRD roadmap — Hiring-team review | Hiring Team Review | future M08 | pending | pending | pending | PLANNED |

## Active requirement interpretation

M00–M04 are integrated on `main`; M04 is verified by post-merge CI #517. M05 is active on draft PR #7. M05.2 has a verified provider-neutral authorization/persistence boundary but cannot honestly complete provider-specific issuance until authoritative provider configuration exists. M05.3 is independently active: network/capability/permission/input diagnostics, accessible candidate readiness UI, explicit transient acquisition, and selected-device verification exist. Exact behavioral head `2708322cd406eb3e2877295bfe25f495cff422c5` passed complete CI #563 / `34701331592`. Candidate device-selection UX, usable input-level readiness, and focused keyboard/narrow-viewport verification remain before M05.3 can be marked VERIFIED. Later M05 realtime execution/recovery work remains planned and may not be skipped merely because provider-specific issuance is unresolved.
