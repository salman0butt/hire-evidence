# Jobs + Interviewer Builder Closeout Evidence

Date: 2026-09-12
Milestone: M03 — Jobs + Interviewer Builder
PR: #5 — `Build jobs and interviewer configuration`
Branch: `feat/jobs-interviewer-builder`
Reviewed implementation head: `6b3526aacfe8d5f0df33b699012bd11e521228bc`
Exact-head CI: #430 / `34677201542` — PASS

## Acceptance evidence

The milestone delivers tenant-scoped jobs/requirements, competencies, observable 1–5 rubrics, question bank, deterministic interview plans, interviewer configuration, non-overridable safety guardrails, draft/publish behavior, immutable published versions, and non-billable preview.

Provider-backed browser closeout in `e2e/interviewer-builder-ui.spec.ts` exercises the complete authoring journey from job creation through competency/rubric/question/plan/configuration, publish, immutable-version read, preview, desktop overflow, 390×844 overflow, and keyboard focus. CI #430 passed this flow after two genuine locator regressions were diagnosed from Playwright artifacts and fixed without weakening assertions.

Provider-backed authorization/security coverage includes:
- `e2e/jobs.spec.ts`, `competencies.spec.ts`, `rubrics.spec.ts`, `questions.spec.ts`, and `interview-plans.spec.ts` for the normalized M03 domain;
- `e2e/interviewer-configs.spec.ts` for fixed-role mutation, member reads, Org A/Org B isolation, anonymous denial, and job/plan ownership;
- `e2e/interviewer-guardrails.spec.ts` for safe configuration acceptance and authoritative rejection of prohibited direct-RPC hiring criteria;
- `e2e/interviewer-publishing.spec.ts` for cross-tenant/anonymous publish denial, immutable version creation/read isolation, idempotent repeated publish, update/delete denial, and non-billable/non-persisting preview.

## Debugging / regression evidence

CI #428 / `34676664381` failed only the milestone-wide builder E2E because `getByLabel(competency)` matched the intended checkbox plus rubric-related controls. Commit `26fd9a81f02bbeb69f5d4570313f1e42e4a41175` changed the locator to exact matching.

CI #429 / `34676971822` then progressed further and failed only because `getByLabel("Duration in seconds")` also matched question/section duration inputs. Commit `6b3526aacfe8d5f0df33b699012bd11e521228bc` changed that locator to exact matching.

CI #430 / `34677201542` passed frozen install, lint, typecheck, unit/component tests, framework/source verifiers, real local Supabase startup/migrations, build, Chromium E2E, and PRD coverage on that exact implementation head.

## Skeptical review

### Correctness / data integrity
- Jobs and all builder records remain organization/job bound.
- Publish locks the configuration path, validates plan completeness/duration, creates the immutable snapshot, and transitions the draft to published state in the authoritative database transaction.
- Repeated publish returns the existing version rather than silently creating divergent history.
- Published configuration edits and interviewer-version update/delete are denied.

### Security / tenancy
- PostgreSQL RLS and fixed-role security-definer RPCs remain authoritative.
- Owner/admin/recruiter/hiring-manager may perform allowed builder mutations; reviewer/read-only and unauthorized roles cannot mutate where prohibited.
- Org B and anonymous actors are denied publish/preview/config mutation and cannot read Org A versions/configuration.
- Route-bound organization/job identifiers are authoritative in server actions; direct provider abuse is separately tested.

### Hiring-AI safety
- Organization text is untrusted.
- Deterministic guardrail validation rejects protected-class, medical/disability, pregnancy/family, biometric/emotion, deception, accent, personality-proxy, autonomous hire/reject, and platform-policy override instructions.
- The same policy is enforced at database save and publish boundaries, preventing client/action bypass.
- The milestone creates configuration/evidence structures only; it does not add autonomous hire/reject decisions. Humans remain hiring decision makers.

### Accessibility / responsive behavior
- Builder controls are explicitly labelled and component tested.
- Browser closeout checks desktop and 390×844 horizontal overflow and verifies keyboard focus progression.
- The complete builder sections remain visible after the persisted workflow.

### Performance / architecture / YAGNI
- Reads and writes remain bounded to one organization/job/configuration and use normalized relational data plus targeted indexes.
- No speculative agent framework, vector database, microservice, event bus, or other unnecessary infrastructure was introduced.
- Preview reuses authoritative persisted configuration and explicitly avoids attempt/billing persistence.

## Findings

Critical: 0 unresolved.
Important: 0 unresolved.
Minor: no milestone-blocking finding identified. Existing external GitHub action/runtime deprecation notices remain informational.

## Merge gate state

Implementation head `6b3526aacfe8d5f0df33b699012bd11e521228bc` is fully green. This evidence/documentation reconciliation creates a newer documentation head; therefore the milestone is not merge-ready until CI passes on that exact final documentation head, PR/review/concurrency state is rechecked, and no newer conflicting work exists.
