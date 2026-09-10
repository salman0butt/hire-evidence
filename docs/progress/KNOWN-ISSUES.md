# Known Issues

Only unresolved or materially relevant issues belong here.

## KI-001 — Complete requirements corpus is not yet persisted

- **Severity:** Important / milestone blocker
- **Area:** Requirements durability / PRD verification
- **Description:** The original requirements ZIP is valid locally, but the complete source pack is not yet available in GitHub. PRD coverage cannot pass until the missing product/iteration/milestone/prompt/template files are imported.
- **Evidence:** verified source archive size `121574` bytes; SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`; prior CI reached the PRD coverage step after application checks passed and failed there.
- **Blocker:** Yes. Do not start later product milestones or mark foundation complete.
- **Intended resolution:** import from the original verified archive using direct filesystem/Git access, preserve intentional live overrides, then run `python3 scripts/verify_prd_coverage.py` and full exact-head CI.

## KI-002 — Current milestone lacks green exact-head CI

- **Severity:** Important
- **Area:** Verification
- **Description:** Application checks passed on an older feature head, but that is not proof for the current PR head. PRD coverage is still blocked by missing requirements files.
- **Evidence:** previous CI passed install/lint/typecheck/unit/build/Chromium/smoke E2E and failed at PRD coverage; newer framework changes require their own CI.
- **Blocker:** Yes for milestone completion/merge readiness.
- **Intended resolution:** persist the complete requirements corpus, run all required checks, review/fix findings, and inspect CI for the exact final PR SHA.
