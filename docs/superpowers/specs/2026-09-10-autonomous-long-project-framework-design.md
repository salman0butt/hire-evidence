# Autonomous Long-Project Framework Design

## Purpose

Upgrade `hire-evidence` from a milestone-oriented repository into a durable fresh-session autonomous-development system without replacing working product-specific governance, application code, tests, or CI.

## Design classification

Architectural. This changes how future workers recover state, select work, record decisions, prove completion, and coordinate concurrent runs.

## Approaches considered

### 1. Incremental overlay — selected

Keep existing product-specific documents (`AGENTS.md`, `docs/product/*`, `docs/milestones/*`, architecture/security/AI docs) and add a small canonical control plane around them.

Benefits: preserves existing safety rules and history, minimizes migration risk, and lets current work continue immediately. Cost: some compatibility references are required between old and new recovery paths.

### 2. Replace existing governance with a new directory layout

Would make the tree visually uniform, but risks losing product-specific constraints, invalidating existing prompts, and creating unnecessary churn. Rejected.

### 3. Build a generic external orchestration framework first

Could eventually be reusable across repositories, but it is unnecessary to make this repository self-recovering now. Rejected by YAGNI.

## Source-of-truth model

The repository follows this precedence when sources disagree:

1. current Git graph and repository state;
2. source code and tests at the relevant SHA;
3. fresh CI/artifacts for that exact SHA;
4. current PR/review state;
5. `docs/progress/STATUS.md` and active milestone ledger;
6. older handoff/progress documents;
7. prior chat memory.

The PRD remains the product source of truth. GitHub is the execution source of truth. CI/tests provide objective verification. Superpowers provides the engineering workflow.

## Canonical control-plane files

- `AGENTS.md`: mandatory agent rules, recovery, autonomy, work selection, concurrency, verification, stop conditions, and product-specific safety invariants.
- `docs/AUTONOMOUS-DEVELOPMENT.md`: reusable end-to-end fresh-session workflow.
- `docs/PRODUCT.md`: concise product capability/boundary/status summary.
- `docs/ARCHITECTURE.md`: architecture index and durable subsystem/boundary summary, linking deeper existing architecture docs.
- `docs/DECISIONS.md`: significant decisions only.
- `docs/FEATURE-MATRIX.md`: high-level capability state; never confuses IMPLEMENTED with VERIFIED.
- `docs/requirements/README.md`: requirements-ingestion and stable-ID policy.
- `docs/requirements/TRACEABILITY.md`: requirement → milestone → spec → code → test → verification mapping.
- `docs/progress/STATUS.md`: compact fresh-session recovery index and exact next action.
- `docs/progress/KNOWN-ISSUES.md`: unresolved blockers/findings with severity and evidence.
- `docs/superpowers/specs/*`: capability designs.
- `docs/superpowers/plans/*`: executable plans.

Existing `docs/milestones/CURRENT.md` remains a compatibility/active-milestone ledger but must agree with `docs/progress/STATUS.md`. When stale, actual Git/code/CI wins and both docs are repaired.

## Recovery protocol

Every autonomous/resume/scheduled run must initialize Superpowers, read `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md`, recover GitHub state, inspect active PR/CI/reviews, then read `STATUS.md`, active milestone, relevant requirements, spec, and plan before modifying code.

The worker must resume unfinished active work before opening a new branch or plan and must detect possible overlapping work from recent branches/PRs/commits. A durable claim/lease file is optional and should only be introduced if real overlapping scheduled workers make it necessary.

## Work-selection priority

Broken default branch and failing active CI outrank new feature work. Critical/Important review findings outrank unfinished implementation. Existing active work outranks creating new work. The next milestone begins only after current completion gates are proven.

## Autonomy model

Routine design/spec/plan/architecture/implementation decisions are pre-authorized. Pre-authorization removes waiting, not engineering rigor. Evidence gates cannot be waived: failing CI/tests, unresolved serious findings, security/data risks, unavailable credentials/services, conflicts, permissions, and irreversible unauthorized external effects remain blockers.

## TDD and verification

Meaningful behavior changes use genuine RED → GREEN → refactor whenever practical. Documentation/configuration-only changes do not require artificial behavioral tests. The framework itself gets a deterministic repository-state verifier so the required durable files and key recovery invariants are machine-checkable.

Completion claims require fresh verification against the exact final SHA. Any commit after successful CI invalidates exact-head completion evidence until CI is rerun.

## PR and merge policy

Use coherent feature branches and PRs. Draft PRs are encouraged for long-running work. Update existing PRs rather than duplicating them. Default is create/update PR but do not merge unless explicitly authorized.

Commit and PR titles must be descriptive. Milestone codes may appear inside milestone ledgers or traceability but not as meaningless commit/PR title prefixes.

## Current migration boundary

This upgrade does not start later AI Interviewer product capabilities. The current requirements-persistence blocker and temporary importer artifacts remain higher-priority unfinished work and are explicitly represented in `STATUS.md`/`KNOWN-ISSUES.md` until resolved.
