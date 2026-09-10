# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved during foundation closeout

### KI-001 — Requirements corpus durability

- **Previous severity:** Important / milestone blocker
- **Status:** RESOLVED
- **Resolution evidence:** the verified owner-supplied requirements source is now persisted under `docs/requirements/source/AI-Interviewer-Codex-Pack/`; `docs/requirements/SOURCE-MANIFEST.json` records source ZIP size `121574` bytes and SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`; `scripts/verify_prd_coverage.py` passed in GitHub Actions CI run `34473131246` on SHA `dcf54ace909345194b873b51a44e94dce825d9db`.

### KI-002 — Exact-head CI unavailable

- **Previous severity:** Important
- **Status:** RESOLVED for pre-reconciliation head
- **Resolution evidence:** GitHub Actions CI run `34473131246` completed successfully on exact PR head `dcf54ace909345194b873b51a44e94dce825d9db`, including all required quality and PRD coverage steps.
- **Note:** any subsequent reconciliation commit requires its own fresh exact-head CI before formal milestone completion; this is a normal verification gate, not an unresolved defect.

### KI-003 — Dependency lockfile reproducibility

- **Previous severity:** Important
- **Status:** RESOLVED
- **Resolution evidence:** `pnpm-lock.yaml` is committed; CI uses `pnpm install --frozen-lockfile`; the frozen install passed in CI run `34473131246`.

## Current unresolved issues

No Critical or Important repository issue is currently recorded.

Final skeptical review and exact-head CI for the durable-state reconciliation commit remain required completion gates. If either exposes a defect, record it here with severity, evidence, blocker state, and intended resolution before proceeding.
