# Hiring Team Review Experience Implementation Plan

**Goal:** Build an authorized, accessible human review workflow over immutable M07 assessments and M06 transcripts while preserving AI/human separation and auditability.

**Design:** `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`

## Global constraints
- Humans remain decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Human override preserves AI score and requires reviewer reason.
- Tenant/job/candidate/attempt/assessment relationships are server-authoritative.
- Transcript/model/reviewer text renders inertly.
- Insufficient evidence stays explicit.

### Task 1 — Candidate result projection/page
Create a tenant-authorized result repository/projection and result route/page showing candidate identity, job/interview status, review status and immutable assessment generation metadata. RED first for cross-tenant denial, missing/uncompleted assessment, and safe projection. Then implement minimum server boundary/page and verify focused/full gates.

### Task 2 — Competency/evidence cards
RED for AI score/null sufficiency, rationale, configured competency identity and evidence references. Implement accessible cards without decision-like summaries.

### Task 3 — Transcript viewer
RED for ordered speaker-separated durable turns, search, inert rendering and technical-event separation. Implement accessible viewer.

### Task 4 — Evidence deep links
RED for exact sequence targeting/highlight/focus and nonexistent evidence failure. Implement score→transcript navigation without trusting arbitrary client selectors.

### Task 5 — Human score overrides
RED migration/repository/UI contracts: preserve AI score, bounded `1..5 | null` human score, mandatory reason, reviewer attribution, tenant isolation, immutable assessment reference. Implement append/audit-safe review persistence and accessible form.

### Task 6 — Reviewer notes/status
RED for bounded notes, authorized attribution and explicit awaiting/in-review/reviewed lifecycle. Implement fail-closed persistence/UI.

### Task 7 — AI/human disagreement data
RED proving disagreement derives deterministically from preserved AI/human values and cannot mutate either source. Implement durable/queryable comparison for later evals.

### Task 8 — Job candidate dashboard
RED for job-scoped candidate/review workflow state and absence of AI best-candidate ranking. Implement accessible list/filter/sort on neutral workflow metadata.

### Task 9 — Closeout
Run full repository gate, provider tests, build and Chromium E2E. Perform security, accessibility, architecture/performance and hiring-AI safety review. Resolve all Critical/Important findings, reconcile ledger/status/traceability/feature matrix, verify exact-final-head CI, auto-merge under authorized gates, verify post-merge main and activate M09.

## TDD discipline
For every behavioral change: smallest meaningful failing test → verify intended RED → minimal implementation → GREEN → refactor while green → broader verification. Never weaken evidence/human-review boundaries to satisfy tests.