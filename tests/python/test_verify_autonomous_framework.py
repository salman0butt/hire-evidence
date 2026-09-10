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
            "GitHub is durable source of truth.\n"
            "Work-selection priority.\n"
            "Exact-SHA CI is mandatory.\n"
            "Do not merge unless explicitly authorized.\n",
            encoding="utf-8",
        )
        (root / "docs/AUTONOMOUS-DEVELOPMENT.md").write_text(
            "Recovery precedence\n"
            "current Git graph > source code and tests > exact-SHA CI > PR state > progress docs > chat memory\n"
            "Continue existing unfinished work before new work.\n"
            "TDD uses RED -> GREEN.\n"
            "Critical and Important findings must be fixed.\n",
            encoding="utf-8",
        )
        (root / "docs/progress/STATUS.md").write_text(
            "Active branch: feat/example\n"
            "Active PR: #2 DRAFT\n"
            "CI status: UNKNOWN\n"
            "Exact next work: Verify the active PR head.\n",
            encoding="utf-8",
        )
        (root / "docs/requirements/TRACEABILITY.md").write_text(
            "Requirement | Milestone | Spec | Implementation | Tests | Verification | Status\n",
            encoding="utf-8",
        )
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

    def test_valid_repository_passes(self) -> None:
        root = self.make_valid_repo()
        self.assertEqual(module.validate_repository(root), [])


if __name__ == "__main__":
    unittest.main()
