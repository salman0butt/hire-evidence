# AI Interviewer — Codex Development Pack

This pack converts the complete **242-section AI Interviewer PRD** into a Codex-ready, milestone-driven development system.

## Start here

1. Put these files at the root of the **new AI Interviewer repository**.
2. Do **not** paste the whole PRD into every Codex session.
3. Start Codex with `prompts/01-bootstrap-m00.md`.
4. On later sessions use `prompts/02-continue-current-iteration.md`.
5. Treat `docs/product/PRD.md` as the authoritative product requirements source.
6. Treat `docs/milestones/CURRENT.md` as the authoritative current execution state.
7. Work **one milestone and one iteration at a time**.

## Integrity

- Original PRD sections detected: **242 / 242**
- Missing numbered sections: **0**
- Duplicate numbered sections: **0**
- Milestone definitions included: **M00–M15**
- Source SHA-256: `3403577a47a6f9baa7a6af70df887f520768fa8e053ecfb12cfdd4e489c7ff4f`

Run:

```bash
python scripts/verify_prd_coverage.py
```

to verify the master PRD and categorized section corpus.

## Repository documentation layout

```text
AGENTS.md
CODEX-START-HERE.md
README.md

docs/
  product/
    PRD.md
    00-preamble.md
    SECTION-INDEX.md
    SECTION-MAP.csv
    COVERAGE-AUDIT.md
    categories/
  architecture/
  security/
  ai/
  milestones/
    README.md
    CURRENT.md
    M00-...md through M15-...md
  iterations/
    README.md
    ITERATION-ROADMAP.md
  superpowers/
    specs/.gitkeep
    plans/.gitkeep

prompts/
  01-bootstrap-m00.md
  02-continue-current-iteration.md
  03-review-current-pr.md
  04-fix-review-findings.md
  05-complete-current-milestone.md

templates/
  ITERATION.md
  DESIGN-SPEC.md
  IMPLEMENTATION-PLAN.md
  REVIEW-CHECKLIST.md
  VERIFICATION-REPORT.md
  MILESTONE-PR.md

scripts/
  verify_prd_coverage.py

.github/
  PULL_REQUEST_TEMPLATE.md
```

## Core execution model

```text
PRD
  ↓
Milestone (M00–M15)
  ↓
Iteration (small coherent capability)
  ↓
TDD tasks
  ↓
Review
  ↓
Fresh verification
  ↓
Persist state in CURRENT.md
```

The pack intentionally separates **product requirements** from **execution state** so a fresh Codex session can recover without relying on chat memory.
