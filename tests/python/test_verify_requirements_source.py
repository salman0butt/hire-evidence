from __future__ import annotations

import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[2] / "scripts" / "verify_requirements_source.py"
spec = importlib.util.spec_from_file_location("verify_requirements_source", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError("unable to load requirements-source verifier module")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class VerifyRequirementsSourceTests(unittest.TestCase):
    def make_repo(self) -> Path:
        tempdir = tempfile.TemporaryDirectory()
        self.addCleanup(tempdir.cleanup)
        root = Path(tempdir.name)
        source = root / module.SOURCE_RELATIVE
        source.mkdir(parents=True)

        files = {
            "a.txt": b"alpha\n",
            "nested/b.txt": b"beta\n",
        }
        entries = []
        for relative, data in files.items():
            path = source / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            entries.append(
                {
                    "path": relative,
                    "size": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(),
                }
            )

        manifest = {
            "source_zip": {
                "filename": "AI-Interviewer-Codex-Pack.zip",
                "size": 123,
                "sha256": "0" * 64,
            },
            "files": entries,
        }
        manifest_path = root / module.MANIFEST_RELATIVE
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        return root

    def test_valid_source_tree_matches_manifest(self) -> None:
        root = self.make_repo()
        self.assertEqual(module.validate_repository_source(root), [])

    def test_tampered_file_fails_hash_check(self) -> None:
        root = self.make_repo()
        (root / module.SOURCE_RELATIVE / "a.txt").write_bytes(b"omega\n")
        errors = module.validate_repository_source(root)
        self.assertTrue(any("sha256 mismatch" in error for error in errors))

    def test_missing_and_extra_files_fail_exact_file_set_check(self) -> None:
        root = self.make_repo()
        (root / module.SOURCE_RELATIVE / "a.txt").unlink()
        (root / module.SOURCE_RELATIVE / "extra.txt").write_text("extra\n", encoding="utf-8")
        errors = module.validate_repository_source(root)
        self.assertTrue(any("missing source files" in error for error in errors))
        self.assertTrue(any("unexpected source files" in error for error in errors))

    def test_manifest_rejects_unsafe_relative_paths(self) -> None:
        root = self.make_repo()
        manifest_path = root / module.MANIFEST_RELATIVE
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["files"].append(
            {"path": "../escape.txt", "size": 0, "sha256": hashlib.sha256(b"").hexdigest()}
        )
        manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        errors = module.validate_repository_source(root)
        self.assertTrue(any("unsafe manifest path" in error for error in errors))

    def test_manifest_rejects_duplicate_paths(self) -> None:
        root = self.make_repo()
        manifest_path = root / module.MANIFEST_RELATIVE
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["files"].append(dict(manifest["files"][0]))
        manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        errors = module.validate_repository_source(root)
        self.assertTrue(any("duplicate manifest path" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
