# Requirements System

## Authority

The original owner-supplied AI Interviewer requirements pack is the product source of truth. Its verified source archive is:

- filename: `AI-Interviewer-Codex-Pack(1).zip`;
- size: `121574` bytes;
- SHA-256: `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`.

The complete pack is not yet durably persisted in GitHub. Existing branch copies of the ZIP created through the connector are known invalid transport artifacts and must not be treated as source material.

When the verified source pack is imported, preserve its original files as faithfully as practical. Existing `docs/product/PRD.md` is the intended canonical normalized product PRD from that pack.

## Stable identifiers

The existing PRD already has numbered sections 1–242. Preserve those section numbers as durable source anchors. Traceability may refer to a section as `PRD-001` through `PRD-242`.

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

Allowed implementation-state terms should remain explicit: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`, or `REJECTED WITH DOCUMENTED REASON`.

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

Requirements ingestion is complete only when the full verified source pack is durably available in Git, the repository PRD coverage verifier passes all expected sections, traceability can account for required future features, and no known truncated transport artifact is being mistaken for the source archive.
