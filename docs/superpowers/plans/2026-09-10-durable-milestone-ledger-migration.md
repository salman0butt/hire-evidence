# Durable Milestone Ledger Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all AI Interviewer milestone records into durable living execution ledgers modeled on the proven WP RAG recovery pattern without changing product scope.

**Architecture:** Keep `docs/milestones/` as the canonical per-milestone execution layer, `docs/progress/STATUS.md` as the compact global recovery index, and `docs/superpowers/` for active design/implementation artifacts. Milestone files accumulate evidence as work progresses; future milestone files remain truthful planning ledgers.

**Tech Stack:** Markdown repository governance, Python framework verifier, GitHub Actions CI.

**Spec:** `docs/superpowers/specs/2026-09-10-durable-milestone-ledger-design.md`

## Global Constraints

- Preserve the owner-supplied PRD meaning and M00–M15 milestone ordering.
- Do not use milestone codes as meaningless commit or PR title prefixes.
- Do not fabricate test, CI, review, implementation or merge evidence.
- Only the current foundation milestone may be active during this migration.
- Keep PR #2 open/draft and do not merge without explicit owner authorization.
- Existing product-specific safety invariants in `AGENTS.md` remain stronger than this generic ledger structure.

---

### Task 1: Persist the complete requirements source

**Files:**
- Create missing operational requirements files from the verified owner archive.
- Create/preserve source material under `docs/requirements/source/` where practical.
- Remove `.requirements-transport/part-00.b64` once direct text ingestion replaces it.

**Interfaces:**
- Consumes: verified archive SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`.
- Produces: durable PRD, iteration roadmap, milestone source definitions, prompts/templates and `scripts/verify_prd_coverage.py`.

- [ ] Verify the uploaded archive hash and file inventory.
- [ ] Compare archive files with current branch files.
- [ ] Preserve intentional live repository overrides rather than overwriting them blindly.
- [ ] Add missing source-of-truth text files directly through Git/GitHub.
- [ ] Remove obsolete requirements-transport artifacts.
- [ ] Run `python3 scripts/verify_prd_coverage.py` and record actual result.
- [ ] Commit with a descriptive requirements-persistence message.

### Task 2: Upgrade the milestone program index

**Files:**
- Modify: `docs/milestones/README.md`
- Modify: `docs/progress/STATUS.md`
- Create: `docs/progress/TEST-MATRIX.md`

**Interfaces:**
- Consumes: PRD milestone definitions and dependency relationships.
- Produces: one canonical lifecycle, roadmap/status table, and planned verification map.

- [ ] Define lifecycle `NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE`, plus evidence-backed `BLOCKED`.
- [ ] List every milestone with truthful current state.
- [ ] Record dependency-aware ordering and current active milestone.
- [ ] Add the test matrix covering expected unit/integration/E2E/security/accessibility/performance/AI-eval gates by milestone.
- [ ] Verify `STATUS.md` still contains exactly one `Exact next work:` marker.
- [ ] Commit with a descriptive milestone-program message.

### Task 3: Upgrade every milestone ledger

**Files:**
- Modify/Create: `docs/milestones/M00-product-foundation.md`
- Create: `docs/milestones/M01-saas-shell-auth.md` through `M15-enterprise-compliance.md`

**Interfaces:**
- Consumes: each archive milestone definition and its default iteration decomposition.
- Produces: sixteen living milestone ledgers with a consistent recovery/evidence contract.

- [ ] Preserve each authoritative PRD milestone definition.
- [ ] Add explicit lifecycle status, dependencies, in/out scope and architecture notes.
- [ ] Preserve every default iteration as a task with truthful state.
- [ ] Add acceptance, TDD, integration, E2E/visual, security, accessibility, performance and AI/eval expectations as applicable.
- [ ] Add review/fix/exact-verification/commit/limitations/recovery sections without fabricated evidence.
- [ ] Mark only genuinely completed foundation work as completed; later milestones remain NOT STARTED.
- [ ] Commit all milestone ledger updates together with a descriptive title.

### Task 4: Enforce milestone durability in the framework verifier

**Files:**
- Modify: `tests/python/test_verify_autonomous_framework.py`
- Modify: `scripts/verify_autonomous_framework.py`

**Interfaces:**
- Consumes: milestone ledger program contract.
- Produces: CI failure if a milestone ledger disappears or the milestone program loses required recovery semantics.

- [ ] Add a failing test that a repository missing one expected milestone ledger fails verification.
- [ ] Run the focused Python test and confirm RED for the intended reason.
- [ ] Add the minimum verifier rule for all sixteen ledger files and milestone lifecycle markers.
- [ ] Re-run focused tests and confirm GREEN.
- [ ] Run the repository framework verifier against the branch state.
- [ ] Commit verifier hardening with a descriptive title.

### Task 5: Review and exact-state verification

**Files:**
- Modify as evidence changes: `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/SESSION-HANDOFF.md`, PR #2 body.

**Interfaces:**
- Consumes: final branch diff and CI evidence.
- Produces: durable continuation state that a fresh worker can trust.

- [ ] Review PRD compliance, correctness/recovery, architecture, testing, security and concurrency behavior.
- [ ] Fix every confirmed Critical or Important finding.
- [ ] Re-review after fixes.
- [ ] Run local framework/PRD verifiers where available.
- [ ] Inspect GitHub CI for the exact final head SHA; do not reuse older SHA evidence.
- [ ] Record unresolved lockfile or environment blockers truthfully.
- [ ] Update PR #2 and global status with the exact next legitimate work.
- [ ] Keep PR #2 open/draft; do not merge.