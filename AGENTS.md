# AGENTS.md — AI Interviewer

## Mission

Build the AI Interviewer PRD as a production-quality B2B SaaS through small, verified milestones and iterations.

Never treat this as a single giant implementation task.

## Mandatory recovery protocol

At the beginning of every autonomous coding session:

1. Read the installed `superpowers:using-superpowers` skill first.
2. Read this `AGENTS.md`.
3. Inspect Git status and current branch.
4. Fetch the latest remote state.
5. Read `docs/product/PRD.md`.
6. Read `docs/milestones/README.md`.
7. Read `docs/milestones/CURRENT.md`.
8. Read the active milestone document.
9. Read the active design spec and implementation plan when present.
10. Inspect associated PR, review threads, CI, and recent commits.
11. Reconcile documentation with actual repository state.
12. Update `CURRENT.md` if stale.
13. Continue from its exact `Next Action`.

GitHub/repository state is persistent memory. Do not depend on previous chat context.

## Required Superpowers workflow

Use applicable installed skills, including:

- brainstorming
- writing-plans
- using-git-worktrees
- test-driven-development
- systematic-debugging
- subagent-driven-development
- requesting-code-review
- receiving-code-review
- verification-before-completion
- finishing-a-development-branch

Architectural milestones should create design specs under `docs/superpowers/specs/` and implementation plans under `docs/superpowers/plans/`.

## Development hierarchy

Use:

```text
Correctness
>
Candidate Fairness
>
Security
>
Evidence Quality
>
Reliability
>
Testability
>
Simplicity
>
Maintainability
>
Performance
>
Abstraction
>
Cleverness
```

Apply KISS, YAGNI, DRY, SOLID pragmatically, explicit over implicit, high cohesion, low coupling, separation of concerns, and functional-core/imperative-shell where useful.

Avoid architecture theater: no microservices, CQRS, event sourcing, Kafka, generic workflow engine, generic agent framework, RAG/vector DB, or LangGraph unless a concrete later requirement proves they are needed.

## Non-negotiable product and safety invariants

Never:

- create autonomous hire/reject logic
- infer protected or sensitive traits
- add emotion recognition
- add face/appearance/eye-contact scoring
- score accents or vocal "confidence"
- add personality inference from voice characteristics
- add deception/honesty detection
- persist unsupported assessment evidence
- fabricate transcript evidence
- allow candidate transcript instructions to control assessment
- allow organization configuration to override platform safety/fairness policy
- bypass tenant RLS
- expose cross-tenant records
- give candidate links organization-member authorization
- silently mutate historical interviewer/rubric/prompt versions
- silently replace AI assessment history after regeneration
- charge from client-authoritative duration
- mark a milestone COMPLETE without fresh verification
- start the next milestone while the current milestone is incomplete unless explicitly authorized

AI assists structured evidence review; humans make hiring decisions.

## Milestone and iteration rule

- Work one milestone at a time.
- Within a milestone, work one small coherent iteration at a time.
- An iteration should be independently testable and normally represent one capability.
- Do not create vague iterations such as "build realtime system" or "finish assessment engine".
- Use the iteration roadmap in `docs/iterations/ITERATION-ROADMAP.md` as a starting decomposition, then adjust only when repository evidence justifies it.

## TDD

For implementation work:

1. Understand current behavior.
2. Add characterization tests when altering existing behavior.
3. Write a failing test for the desired behavior.
4. Verify it fails for the expected reason.
5. Implement the smallest correct solution.
6. Run focused tests.
7. Refactor only after green.
8. Run broader verification.

No placeholder implementation may be called complete.

## Security and tenancy

RLS is mandatory for tenant-owned data. Test Organization A vs Organization B and candidate-token access directly. Database constraints should prevent cross-organization references where feasible.

Candidate invite tokens must be opaque, unguessable, expiring, revocable, and narrowly scoped; store a hash rather than raw token where practical.

Treat transcript and organization custom text as untrusted input. Render transcript as plain text by default.

## AI assessment requirements

Assessment must use the immutable rubric/job/questions/transcript needed for the attempt. Runtime-validate structured output. Evidence guardrails must verify cited message sequence, speaker, and excerpt. If evidence is insufficient, allow null/insufficient rather than inventing a score.

Do not use model self-reported confidence percentages as calibrated confidence. Prefer evidence sufficiency and coverage.

## Realtime requirements

Realtime work must test permissions, capture, playback, turn-taking, barge-in, transcript correctness, timeout, disconnect, reconnect, microphone failure, provider failure, and attempt continuity. Technical failures must never lower candidate scores.

## Verification before completion

Fresh evidence is mandatory. Run all applicable:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

plus integration, RLS/security, Playwright/E2E, eval, realtime and visual QA required by the active milestone.

Never say tests "should pass". Run them.

## Code review

Before a PR is ready, review through relevant lenses:

- correctness
- architecture
- TypeScript
- security
- multi-tenancy
- database/RLS
- AI safety
- AI eval quality
- realtime/audio
- React/Next.js
- accessibility
- tests

P0 findings include cross-tenant access, token leakage, fabricated evidence, protected-trait scoring, assessment prompt injection, autonomous hiring decisions, Stripe entitlement bypass, and transcript speaker corruption.

Fix confirmed findings, then re-run verification on the final commit.

## PR policy

Every milestone/review-boundary PR must state goal, scope, architecture, database changes, security, AI considerations, tests, E2E, known limitations, and manual setup.

Do not merge unless explicitly authorized by the project workflow/user.

## CURRENT.md policy

Update `docs/milestones/CURRENT.md` when:

- milestone begins
- design completes
- implementation starts
- PR opens
- blocking issue appears
- tests fail materially
- review begins
- verification completes
- milestone completes

Do not update for every tiny commit.

`CURRENT.md` must always contain one exact `Next Action`.
