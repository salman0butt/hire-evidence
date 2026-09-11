# Jobs + Interviewer Builder Design

## Context

M02 is integrated on `main` as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 passed the full repository quality gate. M03 now implements PRD milestone 198 and the default roadmap iterations M03.1–M03.11.

Authoritative product requirements come from PRD sections 20–41 plus the publish/version/preview safety requirements referenced by the M03 milestone ledger. This design intentionally keeps platform safety and tenancy authoritative over organization-authored configuration.

## Goals

Deliver an organization-scoped job and interviewer-builder domain that lets hiring teams:

- create and manage jobs/positions;
- distinguish must-have from nice-to-have requirements;
- define job-related competencies and observable 1–5 rubrics;
- create a bounded question bank and deterministic interview plan;
- configure interviewer type, persona, language, guidelines, follow-up policy and duration;
- reject prohibited/discriminatory configuration;
- move a configuration through draft → published state;
- create immutable published interviewer/rubric/prompt snapshots;
- preview the configuration without creating billable candidate interview usage.

The milestone exit is: an authorized organization user can publish an immutable interviewer version that is tenant-isolated, safety-validated and fully reproducible by later interview attempts.

## Non-goals

- Candidate records/invitations (M04).
- Realtime voice/session execution (M05/M06).
- Evidence-based candidate assessment (M07).
- AI-generated criteria becoming authoritative without human review.
- Runtime adaptive questioning that changes core comparability outside the bounded follow-up policy.
- Generic workflow engines or speculative provider abstractions.

## Architecture

### Tenant authority

All M03 persistence is organization-owned and protected by PostgreSQL RLS. Server actions/repositories always receive the route-bound organization ID and never trust organization IDs supplied in form bodies. TypeScript capabilities remain UX/preflight only; database authorization is authoritative.

### Domain decomposition

Use focused organization-owned records rather than one giant JSON document:

- `jobs`: position metadata and bounded free-text fields;
- `job_requirements`: must-have / nice-to-have criteria attached to one job;
- `competencies`: explicit job-related competency definitions and weights;
- `rubrics`: per-competency observable level definitions;
- `questions`: company-defined questions with competency, difficulty, expected areas, follow-up hints, max duration and required/optional state;
- `interview_plans` + sections: deterministic ordered structure and duration budgets;
- `interviewer_configs`: draft mutable configuration linking job, plan and conversational configuration;
- immutable published version tables/snapshots introduced only at the versioning task.

Prefer normalized relational constraints for tenant ownership and referential integrity. JSON may be used only for bounded structured snapshots where immutability benefits from storing the exact published representation.

### M03.1 job model

Start with the minimum authoritative job model required by PRD sections 20–22:

- title — required, trimmed, bounded;
- department — optional, bounded;
- description — optional, bounded;
- responsibilities — optional, bounded;
- seniority — optional bounded enum/text vocabulary chosen in implementation and runtime-validated;
- employment type — optional bounded enum/text vocabulary;
- location — optional bounded;
- salary range — optional free text for MVP, bounded and non-authoritative;
- interview instructions — optional, bounded and treated as untrusted organization text;
- requirement rows with `kind = must_have | nice_to_have`, normalized text and deterministic ordering.

MVP job description import is pasted text only. AI extraction may be introduced later only as a suggestion workflow whose structured result must be reviewed and explicitly accepted by a human before persistence as hiring criteria.

### Authorization

Job creation/update/deletion is limited to organization roles with hiring configuration authority. Initial implementation should reuse existing fixed RBAC capabilities rather than inventing a second role system. Reviewers may read jobs if current tenant membership policy permits it, but mutation remains restricted to owner/admin/recruiter/hiring-manager as justified by existing capabilities and PRD persona definitions.

### Safety and trust hierarchy

Organization-authored job descriptions, instructions, persona text and guidelines are untrusted input. They cannot override:

1. platform policy;
2. interview safety/fairness policy;
3. validated interviewer configuration;
4. job/rubric data;
5. candidate input.

Do not permit criteria based on protected traits, appearance, emotion, accent, deception, medical/disability status, unrelated family/political/religious information, or autonomous hire/reject decisions.

### Validation

Each domain record receives explicit server/runtime validation with bounded lengths, allowed enum values, normalized whitespace and tenant-bound foreign keys. Database constraints mirror critical invariants. User-facing errors remain stable and do not leak policy/database internals.

### Versioning / publication

Draft configuration is mutable. Publishing performs a single transactional validation and writes immutable versioned snapshots containing exact job/requirements/competencies/rubric/questions/plan/configuration plus prompt/guardrail version references. Historical interview attempts will later reference the immutable version ID, never mutable drafts.

### Preview

Preview uses the exact validated draft/published configuration composition path but never creates candidate attempts or billable usage. It must be clearly labelled simulated/non-production and must not persist assessment evidence.

## Testing strategy

Every behavioral slice uses genuine RED → GREEN evidence.

For M03.1 first prove:

- jobs belong to one organization and cannot be cross-tenant read/mutated;
- allowed roles can mutate, disallowed roles cannot;
- route-bound organization cannot be replaced by form data;
- required title and bounded fields are validated;
- must-have/nice-to-have requirement categories persist distinctly;
- deleting/updating one tenant job cannot touch another tenant;
- real local-Supabase E2E proves Org A / Org B / unauthenticated isolation.

Later slices add focused domain tests plus provider-backed security tests and a final browser workflow from job creation through immutable publish.

## UI approach

Follow existing tenant routes under `/app/o/[organizationId]`.

Initial job routes:

- `/app/o/[organizationId]/jobs`
- `/app/o/[organizationId]/jobs/new`
- `/app/o/[organizationId]/jobs/[jobId]`

Keep forms server-authoritative, keyboard accessible, labelled, responsive at desktop and 390×844, and explicit about must-have versus nice-to-have criteria.

## Milestone completion gates

M03 is complete only when:

- M03.1–M03.11 are accounted for;
- tenant/RLS and authorization abuse tests pass;
- prohibited configuration validation passes;
- immutable publish/version semantics are proven;
- preview is non-billable/non-candidate;
- full create job → configure → validate → publish immutable version browser flow passes;
- security/accessibility/performance/AI-safety review has 0 unresolved Critical/Important findings;
- feature matrix/traceability/milestone/status docs match reality;
- exact-final-head CI is green.
