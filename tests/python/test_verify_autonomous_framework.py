from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[2] / "scripts" / "verify_autonomous_framework.py"
spec = importlib.util.spec_from_file_location("verify_autonomous_framework", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError("unable to load verifier module")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class VerifyAutonomousFrameworkTests(unittest.TestCase):
    def make_repo(self) -> Path:
        tempdir = tempfile.TemporaryDirectory()
        self.addCleanup(tempdir.cleanup)
        root = Path(tempdir.name)
        for rel in module.REQUIRED_FILES:
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("placeholder\n", encoding="utf-8")
        return root

    def make_valid_repo(self) -> Path:
        root = self.make_repo()
        (root / "AGENTS.md").write_text(
            "GitHub is durable source of truth.\nWork-selection priority.\nExact-SHA CI is mandatory.\nDo not merge unless explicitly authorized.\n",
            encoding="utf-8",
        )
        (root / "docs/AUTONOMOUS-DEVELOPMENT.md").write_text(
            "Recovery precedence\ncurrent Git graph > source code and tests > exact-SHA CI > PR state > progress docs > chat memory\n"
            "Continue existing unfinished work before new work.\nTDD uses RED -> GREEN.\nCritical and Important findings must be fixed.\n",
            encoding="utf-8",
        )
        (root / "docs/progress/STATUS.md").write_text(
            "Active branch: feat/example\nActive PR: #2 DRAFT\nCI status: UNKNOWN\nExact next work: Verify the active PR head.\n",
            encoding="utf-8",
        )
        (root / "docs/requirements/TRACEABILITY.md").write_text(
            "Requirement | Milestone | Spec | Implementation | Tests | Verification | Status\n", encoding="utf-8"
        )
        (root / "docs/milestones/README.md").write_text(
            "NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE; BLOCKED\n", encoding="utf-8"
        )
        ledger = (
            "# Milestone\n\nStatus: **NOT STARTED**\n\n## Goal\n## Authoritative PRD Milestone Definition\n## Dependencies\n"
            "## In Scope\n## Out of Scope\n## Acceptance Criteria\n## Tasks / Iterations\n## TDD Evidence\n"
            "## Integration Test Evidence\n## Security Review\n## Code Review Findings\n## Fresh Verification Results\n"
            "## Durable Recovery Sources\n## Completion Checklist\n"
        )
        for rel in module.MILESTONE_FILES:
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(ledger, encoding="utf-8")
        return root

    def test_missing_required_file_fails(self) -> None:
        root = self.make_valid_repo()
        (root / "docs/FEATURE-MATRIX.md").unlink()
        errors = module.validate_repository(root)
        self.assertTrue(any("docs/FEATURE-MATRIX.md" in error for error in errors))

    def test_missing_recovery_precedence_fails(self) -> None:
        root = self.make_valid_repo()
        (root / "docs/AUTONOMOUS-DEVELOPMENT.md").write_text("autonomous mode\n", encoding="utf-8")
        errors = module.validate_repository(root)
        self.assertTrue(any("recovery precedence" in error.lower() for error in errors))

    def test_missing_exact_sha_rule_fails(self) -> None:
        root = self.make_valid_repo()
        (root / "AGENTS.md").write_text("GitHub is durable source of truth.\n", encoding="utf-8")
        errors = module.validate_repository(root)
        self.assertTrue(any("exact-sha" in error.lower() for error in errors))

    def test_multiple_exact_next_work_markers_fail(self) -> None:
        root = self.make_valid_repo()
        (root / "docs/progress/STATUS.md").write_text(
            "Active branch: feat/example\nActive PR: #2 DRAFT\nCI status: UNKNOWN\n"
            "Exact next work: First task.\nExact next work: Conflicting task.\n", encoding="utf-8"
        )
        errors = module.validate_repository(root)
        self.assertTrue(any("exactly one 'Exact next work:'" in error for error in errors))

    def test_missing_milestone_ledger_fails(self) -> None:
        root = self.make_valid_repo()
        (root / module.MILESTONE_FILES[-1]).unlink()
        errors = module.validate_repository(root)
        self.assertTrue(any(module.MILESTONE_FILES[-1] in error for error in errors))

    def test_valid_repository_passes(self) -> None:
        root = self.make_valid_repo()
        self.assertEqual(module.validate_repository(root), [])

if __name__ == "__main__":
    unittest.main()
