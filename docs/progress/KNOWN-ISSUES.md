# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved during foundation closeout

### KI-001 — Requirements corpus durability

- **Previous severity:** Important / milestone blocker
- **Status:** RESOLVED
- **Resolution evidence:** the verified owner-supplied requirements source is persisted under `docs/requirements/source/AI-Interviewer-Codex-Pack/`; `docs/requirements/SOURCE-MANIFEST.json` records source ZIP size `121574` bytes and SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`; PRD coverage passed in CI run `34473131246` and again in run `34474528983`.

### KI-002 — Exact-head CI unavailable

- **Previous severity:** Important
- **Status:** RESOLVED for the reviewed pre-closeout head
- **Resolution evidence:** GitHub Actions CI run `34474528983` completed successfully on exact PR head `4ea1eed4c822c3667d575a13c6b735e5148c69df`, including frozen install, lint, typecheck, application tests, framework tests/verifier, requirements-source tests/verifier, build, smoke E2E, and PRD coverage.
- **Note:** the final durable review-evidence commit requires its own exact-head CI before this run can claim final-head green.

### KI-003 — Dependency lockfile reproducibility

- **Previous severity:** Important
- **Status:** RESOLVED
- **Resolution evidence:** `pnpm-lock.yaml` is committed; CI uses `pnpm install --frozen-lockfile`; frozen installation passed in CI run `34474528983`.

### KI-004 — Requirements source integrity was not continuously verified

- **Previous severity:** Important
- **Status:** RESOLVED, pending final-head re-verification
- **Evidence / fix:** review found that PRD section coverage did not prove the archived source tree still matched `SOURCE-MANIFEST.json`. A new `scripts/verify_requirements_source.py` validates exact file set, sizes and SHA-256 hashes and rejects unsafe/duplicate manifest paths. Five focused tests cover valid, tampered, missing/extra, traversal-like and duplicate-path cases. CI run `34474152336` provided genuine RED because the verifier did not yet exist; CI run `34474310301` showed the five tests GREEN; CI run `34474528983` passed both tests and the real source verifier.

### KI-005 — Durable status reconciliation dropped a required recovery marker

- **Previous severity:** Important
- **Status:** RESOLVED
- **Evidence / fix:** CI run `34474310301` failed `scripts/verify_autonomous_framework.py` because `docs/progress/STATUS.md` lacked the required literal `CI status:` marker. Commit `4ea1eed4c822c3667d575a13c6b735e5148c69df` restored the invariant and CI run `34474528983` passed the framework verifier.

### KI-006 — Unified local verification omitted requirements-source integrity

- **Previous severity:** Important
- **Status:** RESOLVED, pending final-head verification
- **Evidence / fix:** final skeptical review found CI enforced source integrity while `pnpm verify` did not. `package.json` now includes `verify:requirements` and the unified `verify` command includes it, keeping local and CI verification intent aligned.

## Current unresolved issues

No Critical or Important implementation/review issue is currently known.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax; current tests pass, so this is classified **Minor** and does not block Product Foundation closeout. Address it in a future maintenance slice when changing module/config conventions rather than broadening this PR.

The only remaining gate for this run is fresh exact-head CI on the final durable review-evidence commit. PR #2 must remain open and unmerged without explicit owner authorization.
