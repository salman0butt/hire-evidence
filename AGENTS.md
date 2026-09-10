# AGENTS.md — AI Interviewer Autonomous Development

## Mission

Build the AI Interviewer PRD into production-quality B2B SaaS through small, dependency-aware, reviewable, verified capabilities across as many fresh sessions as necessary.

Never treat the complete PRD as a single-session implementation task.

## Operating truths

- **PRD = product source of truth.**
- **Git/GitHub = durable source of truth for execution.**
- **Superpowers = engineering methodology.**
- **CI/tests = objective verification source of truth.**

Do not depend on previous conversation memory for continuity.

When sources disagree, use the recovery precedence in `docs/AUTONOMOUS-DEVELOPMENT.md`: current Git graph and code/tests/current exact-SHA CI outrank stale progress text, which outranks old chat memory.

## Autonomous-mode activation

Treat a run as autonomous whenever the invocation says or implies autonomous, scheduled, recurring, hourly, unattended, continue, resume, or fresh session.

## Mandatory fresh-session recovery

Before any repository write:

1. invoke/read Superpowers `using-superpowers`;
2. read this `AGENTS.md`;
3. read `docs/AUTONOMOUS-DEVELOPMENT.md`;
4. fetch current repository metadata and default-branch SHA;
5. inspect recent commits and active branches;
6. inspect open/draft/relevant merged PRs;
7. inspect reviews and unresolved review threads;
8. inspect workflow/CI state, including exact-head CI for active work;
9. inspect source/tests relevant to current work;
10. read `docs/progress/STATUS.md` and `docs/progress/KNOWN-ISSUES.md`;
11. read `docs/milestones/CURRENT.md` and the active milestone ledger;
12. read relevant PRD/traceability entries;
13. read active Superpowers spec and implementation plan;
14. reconcile durable docs against actual Git/code/tests/PR/CI evidence;
15. repair stale docs when evidence proves them stale;
16. detect unfinished/concurrent work;
17. select work using the work-selection priority below;
18. only then modify code/docs.

`CODEX-START-HERE.md` is the concise entry point; this file and `docs/AUTONOMOUS-DEVELOPMENT.md` are mandatory policy.

## Required Superpowers workflow

Use applicable installed skills, including where relevant:

- `using-superpowers`
- `brainstorming`
- `writing-plans`
- `using-git-worktrees`
- `test-driven-development`
- `systematic-debugging`
- `subagent-driven-development`
- `executing-plans`
- `dispatching-parallel-agents`
- `requesting-code-review`
- `receiving-code-review`
- `verification-before-completion`
- `finishing-a-development-branch`

Architectural/capability designs belong under `docs/superpowers/specs/`; executable plans belong under `docs/superpowers/plans/`.

Where Superpowers normally pauses for design/spec/plan approval, the repository owner has pre-authorized routine internal decisions. Investigate alternatives, write/self-review the artifact, then continue without waiting. Auto-approval removes waiting, not rigor.

## Authorized routine actions

Without additional approval, autonomous workers may perform normal repository-local engineering necessary for the active PRD work: design, architecture, plans, task decomposition, schema/migrations, dependencies, naming, implementation, tests, refactors, security/performance fixes in scope, docs, branches/worktrees, commits, pushes, PR creation/updates, CI fixes, and review-finding fixes.

This authorization does not waive evidence gates or authorize irreversible external consequences outside the PRD.

## Evidence gates that are never auto-approved

Do not bypass failing tests/typecheck/lint/static analysis/build/CI; stale CI from older SHAs; unresolved Critical/Important review findings; security vulnerabilities; secret leakage; unauthorized destructive behavior/data loss; merge conflicts; unavailable required credentials/services; permission/protection failures; irreconcilable PRD contradictions; or irreversible external effects not authorized by requirements.

Never weaken tests, CI, security, authorization, or validation merely to keep moving.

## Development hierarchy

Use:

```text
Correctness
>
Candidate Fairness
>
Security
>
Data Integrity
>
Requirement Compliance
>
Evidence Quality
>
Reliability
>
Testability
>
Maintainability
>
Simplicity
>
Performance
>
Developer Convenience
```

Apply KISS, YAGNI, DRY, SOLID pragmatically, explicit over implicit, high cohesion, low coupling, separation of concerns, and functional-core/imperative-shell where useful.

Avoid architecture theater: no microservices, CQRS, event sourcing, Kafka, generic workflow engine, generic agent framework, RAG/vector DB, or speculative provider abstraction unless concrete requirements justify them.

## Non-negotiable product and safety invariants

Never:

- create autonomous hire/reject logic;
- infer protected or sensitive traits;
- add emotion recognition;
- add face/appearance/eye-contact scoring;
- score accents or vocal "confidence";
- add personality inference from voice characteristics;
- add deception/honesty detection;
- persist unsupported assessment evidence;
- fabricate transcript evidence;
- allow candidate transcript instructions to control assessment;
- allow organization configuration to override platform safety/fairness policy;
- bypass tenant RLS;
- expose cross-tenant records;
- give candidate links organization-member authorization;
- silently mutate historical interviewer/rubric/prompt/guardrail versions;
- silently replace AI assessment history after regeneration;
- charge from client-authoritative duration;
- mark a milestone COMPLETE without fresh verification;
- start the next milestone while the current milestone is incomplete unless explicitly authorized.

AI assists structured evidence review; humans make hiring decisions.

## Work-selection priority

Every run selects the highest-priority legitimate work in this order:

1. broken default branch;
2. failed post-merge CI;
3. failed CI on active work;
4. Critical review findings;
5. Important review findings;
6. unresolved blocking review threads;
7. unfinished active branch/PR;
8. unfinished task in current milestone;
9. milestone integration/closeout;
10. next milestone only after completion is proven.

Continue existing unfinished work before creating a new branch/spec/plan for the same or unrelated subsystem.

## Concurrency safety

Before writing, inspect active branches/PRs, recent commits, active CI, and status/task ownership. Do not duplicate another worker's current unit.

Introduce a durable task claim/lease only if overlapping scheduled workers become a real recurring problem. Until then, branch/PR + `docs/progress/STATUS.md` ownership is sufficient.

If another active worker clearly owns the same task and conflict cannot be safely avoided, do read-only recovery, record/report state, and make no conflicting writes.

## Milestone and iteration rule

- Work one milestone at a time unless explicit repository evidence authorizes otherwise.
- Within a milestone, use small dependency-ordered reviewable capabilities/iterations.
- A milestone ledger is an execution record, not a static checklist; keep it synchronized with real code/tests/PR/CI.
- Use `docs/iterations/ITERATION-ROADMAP.md` when available as starting decomposition, adjusting only when requirements/dependencies justify it.
- Do not create vague work units such as "finish backend" or "build realtime system".

## Requirements and traceability

Preserve the complete original requirements pack in Git as faithfully as practical. `docs/requirements/README.md` defines stable requirement-ID policy and `docs/requirements/TRACEABILITY.md` maps requirements through milestone/spec/plan/code/tests/verification.

Do not silently drop difficult/future requirements. Required functionality must remain PLANNED, ACTIVE, BLOCKED, VERIFIED, DEFERRED, or rejected with documented reason.

YAGNI means do not add functionality the PRD does not require; it does not permit ignoring requirements that are hard.

## TDD

For meaningful behavioral changes:

1. understand current behavior and acceptance criteria;
2. add characterization coverage when changing existing behavior if needed;
3. write the smallest meaningful failing test;
4. run it and verify genuine RED for the expected reason;
5. implement the minimum correct behavior;
6. run the focused test and verify GREEN;
7. refactor only while green;
8. run broader applicable tests.

Do not fabricate RED history, weaken assertions to match broken behavior, delete useful tests, or mock away the behavior under test. Add regression tests for bugs where practical.

## Security and tenancy

RLS is mandatory for tenant-owned data once persistence is introduced. Test Organization A vs Organization B and candidate-token access directly. Use database constraints to prevent cross-organization references where feasible.

Candidate invite tokens must be opaque, unguessable, expiring, revocable, and narrowly scoped; store a hash rather than raw token where practical.

Treat transcript and organization custom text as untrusted input. Render transcript as plain text by default.

## AI assessment requirements

Assessment must use the immutable rubric/job/questions/transcript needed for the attempt. Runtime-validate structured output. Evidence guardrails must verify cited message sequence, speaker, and excerpt. If evidence is insufficient, allow null/insufficient rather than inventing a score.

Do not use model self-reported confidence percentages as calibrated confidence. Prefer evidence sufficiency and coverage. Add AI evals when product quality depends on measurable model behavior.

## Realtime requirements

Realtime work must test permissions, capture, playback, turn-taking, barge-in, transcript correctness, timeout, disconnect, reconnect, microphone failure, provider failure, and attempt continuity. Technical failures must never lower candidate scores.

## Independent review

Before completion, review substantial work through skeptical perspectives: PRD compliance, correctness/races/edge cases, architecture/YAGNI, testing quality, security/tenancy, UI accessibility/responsiveness where applicable, and AI eval/tool/guardrail/failure behavior where applicable.

Classify findings as Critical, Important, or Minor. Critical and Important findings block completion until fixed or explicitly accepted by repository policy. Re-review after fixes.

## Verification before completion

Use Superpowers `verification-before-completion`. Fresh evidence is mandatory. Run all applicable commands, commonly:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

plus integration, RLS/security, migration, eval, realtime, visual/accessibility, package/import, performance, and smoke checks required by the active capability.

Never say tests/build/CI "should pass". Run and inspect them.

## Exact-SHA CI

Completion/PR-readiness evidence must correspond to the exact final commit being evaluated. Record the final head SHA, inspect CI for that SHA, confirm all required jobs pass, and verify no newer unverified commit exists.

Any relevant change after green CI creates a new head and requires fresh applicable verification.

## Git and PR policy

Use meaningful branches and focused, descriptive commits. Do not use vague titles such as "work", "changes", or milestone-code-only labels. Milestone codes may appear inside milestone/traceability docs but should not be meaningless commit or PR title prefixes.

Create/update PRs as reviewable integration boundaries. Prefer updating existing active PRs over duplicates.

Default:

```text
AUTO_CREATE_PR = true
AUTO_UPDATE_PR = true
AUTO_MERGE = false
```

Do not merge unless explicitly authorized. Never bypass branch protection or force-push protected branches.

PR descriptions should cover goal/scope, relevant requirements, architecture/data changes, security/AI considerations, tests/E2E, verification, known limitations, manual setup, and UI evidence where useful.

## Durable progress state

`docs/progress/STATUS.md` is the compact recovery index. It must contain current milestone, active task, active branch, active PR, CI status, blockers/findings, and exactly one `Exact next work:` action.

`docs/progress/KNOWN-ISSUES.md` tracks unresolved blockers/findings with severity, evidence, blocker state, and intended resolution.

`docs/milestones/CURRENT.md` remains the active milestone ledger/compatibility path. Actual Git/code/current CI wins if it becomes stale; repair it.

## End-of-run durable handoff

Before ending every meaningful run:

1. recover latest Git/PR/CI state again;
2. push completed safe work;
3. update active milestone/task evidence if state changed;
4. update `docs/progress/STATUS.md`;
5. update known issues, feature matrix, and traceability when their state changed;
6. record active branch and PR;
7. record exact latest SHA and actual CI state;
8. record remaining Critical/Important findings and blockers;
9. record one exact recommended next work item.

The next completely fresh worker must not need chat history to understand what to do.

## Stop conditions

Stop only when safe progress genuinely cannot continue because of a real blocker. Before stopping, maximize all remaining safe work, document what was attempted, record the exact human/external action needed, and push all safe durable state.

Never fabricate files, tests, commits, branches, PRs, CI runs, reviews, deployments, or requirement completion. Mark unknown state as `UNKNOWN`, `UNVERIFIED`, or `BLOCKED`.
