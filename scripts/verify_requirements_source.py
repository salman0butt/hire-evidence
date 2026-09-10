#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path, PurePosixPath

MANIFEST_RELATIVE = Path("docs/requirements/SOURCE-MANIFEST.json")
SOURCE_RELATIVE = Path("docs/requirements/source/AI-Interviewer-Codex-Pack")


def _is_sha256(value: object) -> bool:
    if not isinstance(value, str) or len(value) != 64:
        return False
    try:
        int(value, 16)
    except ValueError:
        return False
    return True


def _safe_manifest_path(value: object) -> str | None:
    if not isinstance(value, str) or not value or "\\" in value:
        return None
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in {"", ".", ".."} for part in path.parts):
        return None
    return path.as_posix()


def validate_repository_source(root: Path) -> list[str]:
    root = root.resolve()
    manifest_path = root / MANIFEST_RELATIVE
    source_root = root / SOURCE_RELATIVE
    errors: list[str] = []

    if not manifest_path.is_file():
        return [f"missing requirements source manifest: {MANIFEST_RELATIVE.as_posix()}"]
    if not source_root.is_dir():
        return [f"missing requirements source directory: {SOURCE_RELATIVE.as_posix()}"]

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        return [f"invalid requirements source manifest: {exc}"]

    if not isinstance(manifest, dict):
        return ["requirements source manifest must be a JSON object"]

    source_zip = manifest.get("source_zip")
    if not isinstance(source_zip, dict):
        errors.append("manifest source_zip must be an object")
    else:
        if not isinstance(source_zip.get("filename"), str) or not source_zip.get("filename"):
            errors.append("manifest source_zip.filename must be a non-empty string")
        if not isinstance(source_zip.get("size"), int) or source_zip.get("size", -1) < 0:
            errors.append("manifest source_zip.size must be a non-negative integer")
        if not _is_sha256(source_zip.get("sha256")):
            errors.append("manifest source_zip.sha256 must be a 64-character hexadecimal SHA-256")

    entries = manifest.get("files")
    if not isinstance(entries, list):
        errors.append("manifest files must be an array")
        return errors

    expected: dict[str, tuple[int, str]] = {}
    for index, entry in enumerate(entries):
        if not isinstance(entry, dict):
            errors.append(f"manifest files[{index}] must be an object")
            continue

        relative = _safe_manifest_path(entry.get("path"))
        if relative is None:
            errors.append(f"unsafe manifest path at files[{index}]: {entry.get('path')!r}")
            continue
        if relative in expected:
            errors.append(f"duplicate manifest path: {relative}")
            continue

        size = entry.get("size")
        digest = entry.get("sha256")
        if not isinstance(size, int) or size < 0:
            errors.append(f"invalid size for {relative}: {size!r}")
            continue
        if not _is_sha256(digest):
            errors.append(f"invalid sha256 for {relative}: {digest!r}")
            continue
        expected[relative] = (size, digest)

    actual = {
        path.relative_to(source_root).as_posix(): path
        for path in source_root.rglob("*")
        if path.is_file()
    }

    missing = sorted(set(expected) - set(actual))
    unexpected = sorted(set(actual) - set(expected))
    if missing:
        errors.append(f"missing source files: {missing}")
    if unexpected:
        errors.append(f"unexpected source files: {unexpected}")

    for relative in sorted(set(expected) & set(actual)):
        expected_size, expected_digest = expected[relative]
        data = actual[relative].read_bytes()
        if len(data) != expected_size:
            errors.append(
                f"size mismatch for {relative}: actual={len(data)} expected={expected_size}"
            )
        digest = hashlib.sha256(data).hexdigest()
        if digest != expected_digest:
            errors.append(
                f"sha256 mismatch for {relative}: actual={digest} expected={expected_digest}"
            )

    return errors


def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path.cwd()
    errors = validate_repository_source(root)
    if errors:
        print("Requirements source integrity verification: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    manifest = json.loads((root / MANIFEST_RELATIVE).read_text(encoding="utf-8"))
    print("Requirements source integrity verification: PASS")
    print(f"Verified {len(manifest['files'])} source files against path, size, and SHA-256 manifest entries.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
