# Autonomous Long-Project Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `hire-evidence` recoverable and safely continuable by a completely fresh autonomous worker using only GitHub/repository state.

**Architecture:** Add a small durable control plane around existing product-specific governance instead of replacing it. A Python verifier enforces presence and key invariants while the existing CI remains the authoritative product verification pipeline.

**Tech Stack:** Markdown governance files, Python 3 standard library verification, existing GitHub Actions CI, existing Next.js/TypeScript application.

**Spec:** `docs/superpowers/specs/2026-09-10-autonomous-long-project-framework-design.md`

## Global Constraints

- Preserve existing product-specific safety and fairness constraints.
- Git/code/current exact-SHA CI outranks stale progress text or chat memory.
- Routine internal engineering decisions are pre-authorized; evidence gates are not bypassable.
- Continue existing active PR work before unrelated new product work.
- Do not merge PRs without explicit authorization.
- Do not use milestone codes as meaningless commit or PR title prefixes.
- Do not mark IMPLEMENTED work VERIFIED without fresh applicable evidence.

---

### Task 1: Add machine-checkable framework invariants

**Files:**
- Create: `scripts/verify_autonomous_framework.py`
- Create: `tests/python/test_verify_autonomous_framework.py`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository root path.
- Produces: exit code 0 only when mandatory autonomy files and key recovery markers exist.

- [ ] Write Python tests for missing required file, missing recovery precedence marker, missing exact-SHA rule, and valid repository fixture.
- [ ] Run `python3 -m unittest tests/python/test_verify_autonomous_framework.py` and confirm RED because the verifier does not exist.
- [ ] Implement the smallest stdlib verifier satisfying the tests.
- [ ] Re-run the focused Python tests and confirm GREEN.
- [ ] Add `verify:framework` package script and CI steps for verifier unit tests + framework verification.
- [ ] Run the focused Python tests again after configuration edits.
- [ ] Commit with a descriptive framework-verification message.

### Task 2: Add canonical autonomous-development control plane

**Files:**
- Create: `docs/AUTONOMOUS-DEVELOPMENT.md`
- Create: `docs/PRODUCT.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/DECISIONS.md`
- Create: `docs/FEATURE-MATRIX.md`
- Create: `docs/requirements/README.md`
- Create: `docs/requirements/TRACEABILITY.md`
- Create: `docs/progress/STATUS.md`
- Create: `docs/progress/KNOWN-ISSUES.md`

**Interfaces:**
- Consumes: existing product PRD/milestone/safety/architecture documents and actual GitHub state.
- Produces: one canonical fresh-session recovery path and durable project-status model.

- [ ] Write each document with concrete current repository facts and no fabricated completion state.
- [ ] Keep `STATUS.md` concise and include exactly one actionable next work item.
- [ ] Record the incomplete requirements-corpus import and invalid temporary archives as active blockers.
- [ ] Record high-level feature state without claiming unverified capabilities.
- [ ] Run `python3 scripts/verify_autonomous_framework.py` and fix structural gaps.
- [ ] Commit with a descriptive governance message.

### Task 3: Upgrade root agent recovery rules

**Files:**
- Modify: `AGENTS.md`
- Modify: `CODEX-START-HERE.md`
- Modify: `docs/milestones/CURRENT.md`

**Interfaces:**
- Consumes: canonical control-plane docs from Task 2.
- Produces: mandatory recovery precedence, work-selection priority, concurrency behavior, durable handoff policy, exact-SHA verification, and compatibility with the existing milestone system.

- [ ] Merge the generic long-project rules into `AGENTS.md` while retaining stronger AI Interviewer safety constraints.
- [ ] Point `CODEX-START-HERE.md` to the canonical recovery sequence.
- [ ] Keep `CURRENT.md` compatible but defer compact global recovery state to `docs/progress/STATUS.md`.
- [ ] Run framework verification.
- [ ] Commit with a descriptive recovery-policy message.

### Task 4: Clean invalid transport artifacts and preserve the blocker honestly

**Files:**
- Delete: `.bootstrap/AI-Interviewer-Codex-Pack.zip`
- Delete: `.bootstrap/DO-NOT-KEEP`
- Delete: `.bootstrap/LAST-TEMP`
- Delete: `.tmp/requirements-pack.zip`
- Delete: `.github/workflows/import-requirements.yml`
- Modify: `docs/progress/KNOWN-ISSUES.md`
- Modify: `docs/progress/STATUS.md`

**Interfaces:**
- Consumes: verified source archive metadata in the session handoff.
- Produces: a PR diff free of known-invalid archives/importer machinery while retaining an explicit unresolved requirements-persistence blocker.

- [ ] Remove all known-invalid temporary transport/import files from the active branch.
- [ ] Verify the branch tree no longer contains those paths.
- [ ] Keep the source archive SHA-256 and exact recovery procedure in durable docs.
- [ ] Run framework verification.
- [ ] Commit with a descriptive cleanup message.

### Task 5: Review, CI, and durable handoff

**Files:**
- Modify as needed from review findings.
- Update: `docs/progress/STATUS.md`
- Update: `docs/SESSION-HANDOFF.md` only if it adds information not already represented canonically.

**Interfaces:**
- Consumes: full PR diff and exact-head CI.
- Produces: reviewed branch and accurate next-session state.

- [ ] Review PR through requirements, correctness, architecture, testing, security, concurrency, and recoverability lenses.
- [ ] Fix all Critical and Important findings.
- [ ] Run `python3 -m unittest tests/python/test_verify_autonomous_framework.py`.
- [ ] Run `python3 scripts/verify_autonomous_framework.py`.
- [ ] Inspect GitHub CI for the exact final SHA; do not reuse older green checks.
- [ ] Update `STATUS.md` with actual CI state and exact next legitimate work without claiming the unresolved requirements-persistence gate complete.
- [ ] Push all safe work and update draft PR #2; do not merge.
