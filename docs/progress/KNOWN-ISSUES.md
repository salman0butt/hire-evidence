# Known Issues

Only unresolved or materially relevant issues belong here.

## KI-001 — Complete requirements corpus is not yet persisted

- **Severity:** Important / milestone blocker
- **Area:** Requirements durability / PRD verification
- **Description:** The original requirements ZIP is valid in the current source runtime, but the complete source pack is not yet available in GitHub. PRD coverage cannot pass until the missing product/iteration/milestone/prompt/template files are imported.
- **Evidence:** verified source archive size `121574` bytes; SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`; prior CI reached the PRD coverage step after application checks passed and failed there.
- **Blocker:** Yes. Do not start later product milestones or mark foundation complete.
- **Intended resolution:** import from the original verified archive using direct filesystem/Git access, preserve intentional live overrides, then run `python3 scripts/verify_prd_coverage.py` and full exact-head CI.
- **Fresh-session fallback:** if a new worker cannot access the original archive and GitHub still lacks the corpus, do not recreate requirements from memory. Record the blocker and request/provide the exact original archive or another verified source-byte mount while continuing unrelated safe blocker-resolution work where possible.

## KI-002 — Current milestone lacks green exact-head CI

- **Severity:** Important
- **Area:** Verification
- **Description:** Application checks passed on an older feature head, but that is not proof for the current PR head. PRD coverage is still blocked by missing requirements files.
- **Evidence:** previous CI passed install/lint/typecheck/unit/build/Chromium/smoke E2E and failed at PRD coverage; newer framework changes require their own CI.
- **Blocker:** Yes for milestone completion/merge readiness.
- **Intended resolution:** persist the complete requirements corpus, run all required checks, review/fix findings, and inspect CI for the exact final PR SHA.

## KI-003 — Dependency lockfile is not yet durable

- **Severity:** Important for reproducible foundation verification
- **Area:** Dependency reproducibility / CI
- **Description:** `package.json` pins core tool versions, but the repository does not currently contain `pnpm-lock.yaml` and CI installs with `--no-frozen-lockfile`.
- **Evidence:** current branch tree has no `pnpm-lock.yaml`; `.github/workflows/ci.yml` uses `pnpm install --no-frozen-lockfile`.
- **Blocker:** Not a blocker for documenting the autonomous framework, but it blocks calling the complete product foundation reproducibly verified.
- **Intended resolution:** generate the intended lockfile using the repository's declared pnpm version in a network-capable environment, commit it, switch CI to `pnpm install --frozen-lockfile`, and rerun exact-head CI.
