# Durable Milestone Ledger Design

## Context

The AI Interviewer requirements pack defines sixteen product milestones and already decomposes each into dependency-ordered iterations. The repository also has a long-running autonomous-development control plane. The missing piece is a mature durable milestone ledger system comparable to the proven pattern in `salman0butt/wp-rag-ai-chatbot`.

The reference repository demonstrates four useful properties:

1. every milestone has one durable file, including future/not-started milestones;
2. milestone files evolve from planned scope into execution evidence rather than being replaced by chat summaries;
3. global `docs/progress/STATUS.md` stays compact and names the first legitimate unfinished work;
4. completed work records exact commits, PRs, CI runs, review outcomes and closeout documents.

This design adapts those properties without copying WordPress-specific implementation details.

## Decision

Use the existing AI Interviewer `docs/milestones/` directory as the canonical milestone program. Keep the PRD's M00–M15 ordering and filenames because those identifiers are useful durable requirement anchors. Milestone codes remain valid in documentation and filenames; they must not be used as meaningless commit or PR title prefixes.

Milestone lifecycle:

`NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE`

`BLOCKED` is allowed only when the ledger records evidence, blocker impact and the exact unblock action.

Only one milestone should normally be active. The current foundation milestone remains the only active milestone until its requirements-persistence, reproducibility and exact-head verification gates are resolved.

## Milestone Ledger Contract

Every milestone file must contain enough information for a fresh worker to recover scope before reading chat history. The standard sections are:

- Status
- Goal
- Authoritative PRD milestone definition
- Dependencies
- In Scope
- Out of Scope
- Architecture Notes
- Selected Design / Implementation Plan
- Acceptance Criteria
- Tasks / Iterations with explicit state
- TDD Evidence
- Integration Test Evidence
- E2E / Visual Verification
- Security Review
- Accessibility Review where relevant
- Performance Review where relevant
- AI / Eval Review where relevant
- Code Review Findings
- Fixes / Re-review
- Fresh Verification Commands
- Fresh Verification Results
- Commits / Files Changed
- Known Limitations
- Documentation Updated
- Durable Recovery Sources
- Completion Checklist
- Next Milestone

A future milestone may explicitly say evidence has not been produced because the milestone has not started. It must never fabricate commit, CI, test or review evidence.

## Global Recovery Model

`docs/progress/STATUS.md` is the concise global recovery index. It must identify:

- completed milestones;
- current milestone and lifecycle state;
- active branch and PR;
- current exact-head CI status;
- blockers and Important/Critical findings;
- the first legitimate unfinished task;
- exact next work.

The detailed milestone ledger carries milestone-specific scope and evidence. Task-level progress/closeout files under `docs/progress/` are created only when they add durable evidence; do not pre-create empty files for future work.

## Closeout Evidence

When a task or milestone is actually closed, persist evidence comparable to the WP RAG pattern:

- final implementation SHA;
- exact-head CI run and required job results;
- independent review result with Critical/Important count;
- security/accessibility/performance/eval evidence where applicable;
- PR number and final PR head;
- merge SHA and post-merge CI when a merge is explicitly authorized and occurs.

No milestone becomes COMPLETE merely because its tasks are checked off.

## Test Matrix

Add `docs/progress/TEST-MATRIX.md` as a durable map of expected verification categories by milestone. It is a planning aid, not proof. Actual milestone evidence still belongs in the milestone ledger and closeout records.

## Current Foundation State

The application shell and test infrastructure are implemented, but the current milestone is not COMPLETE because the complete requirements corpus, lockfile reproducibility and exact-head verification are unresolved. The newly supplied archive is byte-identical to the previously verified source: 121574 bytes, SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`.

The milestone migration must preserve that truth: mark completed foundation tasks as completed, unresolved governance/reproducibility/verification work as active, and every later milestone as NOT STARTED.

## Non-Goals

- no new product capability implementation in this migration;
- no artificial closeout documents for work that never occurred;
- no invented CI/review evidence;
- no renumbering of PRD milestones;
- no copying WordPress-specific architecture, test commands or domain concepts.

## Success Criteria

The migration succeeds when all sixteen milestone ledgers exist, the milestone index exposes the lifecycle and dependency-aware roadmap, global status points to the current legitimate work, test expectations are durable, future milestones are recoverable without chat history, and repository verification can detect missing milestone ledgers.