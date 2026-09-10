# Requirements System

## Authority

The original owner-supplied AI Interviewer requirements pack is the product source of truth. The verified source archive metadata persisted in `SOURCE-MANIFEST.json` is:

- filename: `AI-Interviewer-Codex-Pack(3).zip`;
- size: `121574` bytes;
- SHA-256: `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`.

The complete verified source pack is now durably persisted under:

`docs/requirements/source/AI-Interviewer-Codex-Pack/`

The repository also exposes the operational product corpus under `docs/product/` and `docs/iterations/`. The source archive copy is retained for faithful recovery; the living milestone/recovery ledgers in the repository remain authoritative for execution state and must not be overwritten by older source-pack progress snapshots.

Previous connector-created/truncated ZIP transport artifacts are not source material and must not be recreated or trusted.

## Fresh-session source recovery

A fresh worker must:

1. recover actual GitHub state before assuming any requirement-ingestion status;
2. verify `docs/requirements/SOURCE-MANIFEST.json` and the durable source tree exist;
3. use `docs/product/PRD.md` as the canonical normalized product PRD;
4. use `scripts/verify_prd_coverage.py` to prove expected numbered-section coverage before claiming requirements integrity;
5. preserve the source corpus and living execution ledgers without silently reconstructing or deleting difficult/future requirements.

Never synthesize missing PRD text from memory if repository evidence is incomplete.

## Stable identifiers

The supplied PRD has numbered sections 1–242. Preserve those section numbers as durable source anchors. Traceability may refer to a section as `PRD-001` through `PRD-242`.

When a section contains multiple independently testable requirements, introduce capability-specific atomic IDs only as needed, for example `AUTH-001`, `SESSION-001`, `EVAL-001`, `SEC-001`, `PERF-001`, or `A11Y-001`. Every atomic ID must point back to its source PRD section(s); do not invent requirements unsupported by the PRD.

Avoid generating thousands of low-value IDs upfront. Normalize at the granularity needed for implementation and verification while ensuring no source requirement disappears.

## Requirement record

A normalized requirement should record:

- stable ID;
- requirement statement;
- source PRD section(s);
- priority when explicitly known;
- owning capability/milestone;
- acceptance criteria;
- status.

Allowed implementation-state terms: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`, or `REJECTED WITH DOCUMENTED REASON`.

## Traceability

`TRACEABILITY.md` maps:

```text
Requirement
→ Milestone
→ Design/Spec
→ Implementation Plan
→ Code
→ Tests
→ Verification
```

Do not mark a requirement VERIFIED simply because code exists. Verification requires applicable acceptance criteria, tests/review, and exact-state evidence.

## Ingestion completion gate

Requirements ingestion is complete when the full verified source pack is durably available in Git, the repository PRD coverage verifier passes all expected sections, traceability can account for required future features, and no truncated/reconstructed transport artifact is being mistaken for source material.

That ingestion gate passed on PR head `dcf54ace909345194b873b51a44e94dce825d9db` in GitHub Actions CI run `34473131246`; future changes to requirements/verifier inputs require fresh verification.
