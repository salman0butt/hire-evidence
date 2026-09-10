# Autonomous Development

This document is the durable operating system for long-running autonomous development in this repository. It applies to normal ChatGPT/Codex work and to fresh scheduled/recurring workers.

## Operating model

Use four sources with distinct responsibilities:

- **PRD = product source of truth.** It defines required product behavior and boundaries.
- **Git/GitHub = durable source of truth for execution.** Branches, commits, PRs, code, tests, reviews, and durable docs tell a fresh worker what actually happened.
- **Superpowers = engineering methodology.** Use the applicable skills rather than skipping design, TDD, debugging, review, or verification.
- **CI/tests = objective verification.** Evidence outranks confidence or stale prose.

Never depend on prior chat memory for continuity.

## Mode activation

Use this autonomous workflow whenever the invocation says or clearly implies: autonomous, scheduled, recurring, hourly, unattended, continue, resume development, or fresh session.

## Mandatory fresh-session recovery

Before modifying code or docs:

1. invoke/read Superpowers `using-superpowers`;
2. read root `AGENTS.md`;
3. read this document;
4. fetch repository metadata and latest default-branch SHA;
5. inspect recent default-branch commits;
6. inspect local/remote branches that may contain active work;
7. inspect open and draft PRs;
8. inspect relevant recently merged PRs;
9. inspect review submissions and unresolved review threads;
10. inspect current workflow/CI state;
11. inspect exact-SHA CI for the active branch head;
12. inspect source/tests relevant to the active work;
13. read `docs/progress/STATUS.md`;
14. read `docs/progress/KNOWN-ISSUES.md`;
15. read `docs/milestones/CURRENT.md` and the active milestone ledger;
16. read relevant requirements/traceability entries;
17. read the active Superpowers design/spec;
18. read the active implementation plan;
19. compare durable docs with actual Git/code/tests/CI;
20. repair stale docs when evidence proves them stale;
21. detect unfinished active work and possible concurrent ownership;
22. select the first legitimate unfinished task using the work-selection priority;
23. only then modify repository state.

## Recovery precedence

When sources disagree, use this order:

```text
current Git graph
  > source code and tests at the relevant SHA
  > fresh exact-SHA CI and artifacts
  > current PR and review state
  > docs/progress/STATUS.md and active milestone ledger
  > older execution/handoff notes
  > previous chat memory
```

Correct stale Markdown rather than forcing reality to match it.

## Pre-authorized autonomy

Routine engineering decisions are pre-authorized: architecture, design, specs, implementation plans, decomposition, folder/package structure, naming, schema/migrations, routine dependencies, state management, tests, normal UI details, refactors required by scope, documentation, branches/worktrees, commits, pushes, PRs, CI fixes, review fixes, and transitions between approved engineering stages.

Where a Superpowers design/spec/plan workflow normally pauses for owner approval, the repository owner has granted advance approval. Preserve the workflow substance: investigate alternatives, record important reasoning, self-review the artifact, and then proceed.

Auto-approval removes waiting; it never removes rigor.

## Evidence gates that cannot be waived

Do not bypass:

- failing tests, lint, type checks, static analysis, builds, or CI;
- stale CI from an older SHA;
- unresolved Critical or Important review findings;
- security vulnerabilities, secret leakage, unauthorized destructive behavior, or data-loss risk;
- merge conflicts or branch-protection failures;
- unavailable required credentials/services;
- contradictory product requirements that cannot reasonably be reconciled;
- irreversible external consequences not authorized by the PRD.

When blocked, maximize remaining safe progress, persist the blocker and exact unblock action, push safe work, and stop only when no legitimate safe work remains.

## Work-selection priority

Every run selects work in this order:

1. broken default branch;
2. failed post-merge CI;
3. failed CI on active work;
4. Critical review findings;
5. Important review findings;
6. unresolved blocking review threads;
7. unfinished active branch or PR;
8. unfinished task in the current milestone;
9. milestone integration/closeout;
10. next milestone only after completion is proven.

Continue existing unfinished work before creating unrelated new work.

## Concurrency safety

Before writing, inspect active branches, PRs, recent commits, CI, and `STATUS.md` for overlapping ownership. Reuse existing work rather than duplicating it.

If recurring workers begin overlapping frequently, add a lightweight claim/lease record with task, branch, claimed time, and expiry. Do not introduce lease machinery until real concurrency requires it.

If another active worker clearly owns the same unit and safe coordination is not possible, perform read-only recovery, record the state, and avoid conflicting writes.

## Unit of autonomous work

A run completes the largest coherent unit that can safely move through design, tests, implementation, review, verification, documentation, commit, push, and PR update. Do not stop after trivial progress when the next step is naturally part of the same unit. Do not start unrelated work merely to fill time.

## Required engineering loop

For meaningful capabilities use:

```text
RECOVER
→ UNDERSTAND REQUIREMENTS
→ INVESTIGATE
→ DESIGN
→ SELF-REVIEW DESIGN
→ AUTO-APPROVE DESIGN
→ WRITE SPEC
→ SELF-REVIEW SPEC
→ AUTO-APPROVE SPEC
→ WRITE PLAN
→ SELF-REVIEW PLAN
→ AUTO-APPROVE PLAN
→ ISOLATE WORK
→ WRITE FAILING TEST
→ VERIFY RED
→ IMPLEMENT MINIMUM CORRECT CHANGE
→ VERIFY GREEN
→ REFACTOR
→ FOCUSED TESTS
→ INTEGRATION TESTS
→ SECURITY REVIEW
→ PERFORMANCE REVIEW
→ ACCESSIBILITY REVIEW WHERE RELEVANT
→ INDEPENDENT CODE REVIEW
→ FIX FINDINGS
→ RE-REVIEW
→ FULL VERIFICATION
→ UPDATE DURABLE DOCS
→ COMMIT
→ PUSH
→ CREATE/UPDATE PR
→ VERIFY EXACT HEAD CI
→ UPDATE STATUS
→ CONTINUE
```

## Strict TDD

Meaningful behavioral changes use genuine **RED → GREEN → REFACTOR** whenever technically practical:

1. write the smallest meaningful failing test;
2. run it and confirm RED for the intended missing behavior;
3. implement the minimum correct change;
4. run the focused test and confirm GREEN;
5. refactor only while green;
6. run broader relevant tests.

Do not fabricate RED history, weaken assertions to match broken behavior, delete useful tests, or mock away the behavior under test. Bug fixes receive regression tests where practical.

Documentation-only/configuration-only changes do not require artificial behavioral tests, but framework/config invariants should be machine-checked where useful.

## Testing strategy

Use the smallest combination that proves the relevant acceptance criteria: unit, integration, API/contract, database/migration, component, browser/E2E, security/authorization, regression, performance, accessibility, smoke, package/import, and AI eval tests.

Tests should prove product behavior, not implementation trivia.

## AI-specific requirements

For AI/LLM work, evaluate structured schemas, prompt/version provenance, grounding/evidence, tool correctness, retries/timeouts, provider failure, rate/cost limits, prompt injection, unsafe tool execution, guardrails, eval datasets, regression evals, observability, and human-in-the-loop boundaries. AI evals are required where product quality depends on measurable AI behavior.

Product-specific AI safety constraints in `AGENTS.md` override generic convenience.

## Security, performance, and accessibility

Every capability receives scope-appropriate security review. Consider auth/authz, tenant isolation/RLS, credentials/secrets, injection, XSS/CSRF/SSRF, file/path handling, API validation, rate limiting, webhooks, AI tool permissions, audit logs, and PII.

Review meaningful performance risks without speculative optimization: N+1 queries, unbounded reads, memory growth, large payloads, blocking work, duplicate model calls, unnecessary rerenders, cache/queue/retry behavior.

For UI, verify responsive behavior, keyboard/focus, semantic HTML, labels, screen readers, loading/error/empty/disabled/validation states, long content, mobile layout, async races, and relevant accessibility regressions.

## Independent review

Substantial changes should be reviewed through independent perspectives where possible:

- PRD compliance;
- correctness/edge cases/races;
- architecture/coupling/YAGNI;
- testing quality;
- security/data isolation;
- accessibility/responsiveness for UI;
- AI eval/tool/guardrail/failure behavior for AI.

Classify findings as **Critical**, **Important**, or **Minor**. Critical and Important findings must be fixed before completion unless the repository explicitly accepts the debt. Re-review after fixes.

## Verification before completion

Use Superpowers `verification-before-completion`. Run the actual applicable commands. Do not infer success from code review or older runs.

Possible gates include install, format, lint, static analysis, typecheck, unit/integration/E2E/security tests, package/import tests, build, migrations, smoke tests, and CI.

## Exact-SHA CI

Before declaring a PR integration-ready:

1. record the final head SHA;
2. inspect CI for that exact SHA;
3. confirm required jobs passed;
4. ensure no newer unverified commit exists.

Any post-CI code/config/doc commit that affects required checks creates a new exact head and requires fresh applicable verification.

## Git and Pull Requests

Use focused branches and meaningful commits. Commit/PR titles describe behavior, not milestone codes or vague “work/changes” labels.

Use PRs as coherent review boundaries. Update existing PRs instead of creating duplicates. PR descriptions should cover behavior, requirements, design, tests, verification, security considerations, known limits, follow-ups, and UI evidence where relevant.

Default policy:

```text
AUTO_CREATE_PR = true
AUTO_UPDATE_PR = true
AUTO_MERGE = false
```

Do not merge unless explicitly authorized. Never bypass protection or force-push protected branches.

## Requirements and traceability

The original PRD must be preserved in Git as faithfully as practical. `docs/requirements/` defines normalized/atomic requirement policy and `TRACEABILITY.md` maps requirements to milestones, specs, implementation, tests, verification, and status.

No required PRD feature may disappear merely because it is deferred to later work.

## Milestone and project completion

A milestone is complete only after requirements are accounted for, acceptance criteria pass, applicable tests/security/performance/accessibility checks complete, no unresolved Critical/Important findings remain, docs/matrix/traceability match reality, and exact-final-head CI is green.

The complete project is finished only when all required PRD functionality is implemented or explicitly resolved, all required milestones/gates pass, traceability has no unexplained required gaps, and exact-final-state CI is green.

## End-of-run durable handoff

Before ending a meaningful run:

1. recover the latest Git/PR/CI state again;
2. push completed safe work;
3. update the active milestone ledger when state materially changed;
4. update `docs/progress/STATUS.md`;
5. update `docs/progress/KNOWN-ISSUES.md` if blocker/finding state changed;
6. update requirements traceability and feature matrix where implementation state changed;
7. record active branch and PR;
8. record exact latest SHA and CI state;
9. record remaining Critical/Important findings and blockers;
10. record exactly one recommended next legitimate work item.

A fresh worker must be able to continue without consulting prior chat history.

## Small scheduled prompt

Once this file and `AGENTS.md` are present, a recurring worker can be started with a compact prompt:

```text
Work autonomously on this repository. Treat GitHub/repository state as durable truth and assume a fresh session. FIRST invoke Superpowers using-superpowers, then read AGENTS.md and docs/AUTONOMOUS-DEVELOPMENT.md. Recover actual Git/PR/review/CI/requirements/milestone/progress/spec/plan state, continue the highest-priority unfinished work, preserve strict TDD/review/exact-SHA verification/concurrency safety, push safe progress, and update durable status before ending. Do not merge unless explicitly authorized.
```
