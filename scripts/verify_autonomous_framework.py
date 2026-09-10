#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

MILESTONE_FILES = (
    "docs/milestones/M00-product-foundation.md",
    "docs/milestones/M01-saas-shell-auth.md",
    "docs/milestones/M02-organizations-rbac.md",
    "docs/milestones/M03-jobs-interviewer-builder.md",
    "docs/milestones/M04-candidates-invitations.md",
    "docs/milestones/M05-realtime-ai-interview.md",
    "docs/milestones/M06-transcript-durable-session.md",
    "docs/milestones/M07-evidence-assessment-engine.md",
    "docs/milestones/M08-hiring-team-review.md",
    "docs/milestones/M09-billing-usage.md",
    "docs/milestones/M10-ai-quality-guardrails-evals.md",
    "docs/milestones/M11-enterprise-readiness.md",
    "docs/milestones/M12-integrations.md",
    "docs/milestones/M13-coding-interview.md",
    "docs/milestones/M14-advanced-interview-formats.md",
    "docs/milestones/M15-enterprise-compliance.md",
)

REQUIRED_FILES = (
    "AGENTS.md", "CODEX-START-HERE.md", "docs/AUTONOMOUS-DEVELOPMENT.md",
    "docs/PRODUCT.md", "docs/ARCHITECTURE.md", "docs/DECISIONS.md",
    "docs/FEATURE-MATRIX.md", "docs/requirements/README.md",
    "docs/requirements/TRACEABILITY.md", "docs/progress/STATUS.md",
    "docs/progress/KNOWN-ISSUES.md", "docs/milestones/CURRENT.md",
)

def _read(root: Path, relative_path: str) -> str:
    return (root / relative_path).read_text(encoding="utf-8")

def _require_text(errors: list[str], label: str, content: str, needle: str) -> None:
    if needle.lower() not in content.lower():
        errors.append(f"{label} must contain {needle!r}")

def validate_repository(root: Path) -> list[str]:
    root = root.resolve()
    errors: list[str] = []
    for relative_path in REQUIRED_FILES:
        if not (root / relative_path).is_file():
            errors.append(f"missing required autonomous-development file: {relative_path}")
    for relative_path in MILESTONE_FILES:
        if not (root / relative_path).is_file():
            errors.append(f"missing required milestone ledger: {relative_path}")
    if errors:
        return errors

    agents = _read(root, "AGENTS.md")
    autonomous = _read(root, "docs/AUTONOMOUS-DEVELOPMENT.md")
    status = _read(root, "docs/progress/STATUS.md")
    traceability = _read(root, "docs/requirements/TRACEABILITY.md")
    _require_text(errors, "AGENTS.md", agents, "durable source of truth")
    _require_text(errors, "AGENTS.md", agents, "work-selection priority")
    _require_text(errors, "AGENTS.md", agents, "Exact-SHA")
    _require_text(errors, "AGENTS.md", agents, "Do not merge unless explicitly authorized")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "Recovery precedence")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "Continue existing unfinished work before")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "RED")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "GREEN")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "Critical")
    _require_text(errors, "docs/AUTONOMOUS-DEVELOPMENT.md", autonomous, "Important")
    for marker in ("Active branch:", "Active PR:", "CI status:", "Exact next work:"):
        _require_text(errors, "docs/progress/STATUS.md", status, marker)
    if status.lower().count("exact next work:") != 1:
        errors.append("docs/progress/STATUS.md must contain exactly one 'Exact next work:' marker")
    for column in ("Requirement", "Milestone", "Spec", "Implementation", "Tests", "Verification", "Status"):
        _require_text(errors, "docs/requirements/TRACEABILITY.md", traceability, column)

    milestone_index = _read(root, "docs/milestones/README.md")
    for marker in ("NOT STARTED", "DESIGN", "PLANNED", "IMPLEMENTING", "VERIFYING", "REVIEW", "COMPLETE", "BLOCKED"):
        _require_text(errors, "docs/milestones/README.md", milestone_index, marker)
    required_ledger_sections = (
        "Status:", "## Goal", "## Authoritative PRD Milestone Definition", "## Dependencies",
        "## In Scope", "## Out of Scope", "## Acceptance Criteria", "## Tasks / Iterations",
        "## TDD Evidence", "## Integration Test Evidence", "## Security Review",
        "## Code Review Findings", "## Fresh Verification Results", "## Durable Recovery Sources",
        "## Completion Checklist",
    )
    for relative_path in MILESTONE_FILES:
        ledger = _read(root, relative_path)
        for marker in required_ledger_sections:
            _require_text(errors, relative_path, ledger, marker)
    return errors

def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path.cwd()
    errors = validate_repository(root)
    if errors:
        print("Autonomous framework verification: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Autonomous framework verification: PASS")
    print(f"Checked {len(REQUIRED_FILES)} required files and recovery invariants.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
