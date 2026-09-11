# Jobs + Interviewer Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tenant-scoped Jobs + Interviewer Builder milestone through immutable published interviewer versions.

**Architecture:** Reuse the existing organization/RBAC/RLS foundation. Persist normalized organization-owned draft domain records, enforce critical invariants in PostgreSQL and runtime validation, then publish immutable versioned snapshots only after complete safety/consistency validation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase/PostgreSQL RLS + RPCs, Vitest/Testing Library, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-11-jobs-interviewer-builder-design.md`

## Global Constraints

- PostgreSQL RLS/RPCs are authoritative for tenant/security boundaries.
- Existing fixed organization RBAC is reused; do not introduce parallel authorization concepts.
- Organization-authored text is untrusted and cannot override platform safety/fairness policy.
- AI suggestions never silently become authoritative hiring criteria/questions.
- Published interviewer/rubric/prompt state must be immutable and reproducible.
- Humans remain hiring decision makers.
- Strict RED → GREEN evidence for meaningful behavior.

---

### Task 1: Tenant-scoped Jobs and Requirements

**Files:**
- Create: `supabase/migrations/20260911_create_jobs.sql`
- Create: `src/lib/jobs/job-validation.ts`
- Create: `src/lib/jobs/jobs.ts`
- Create: `src/lib/jobs/__tests__/job-validation.test.ts`
- Create: `src/lib/jobs/__tests__/jobs.test.ts`
- Create: `src/lib/jobs/__tests__/job-migration.test.ts`
- Create: `src/app/(app)/app/o/[organizationId]/jobs/page.tsx`
- Create: `src/app/(app)/app/o/[organizationId]/jobs/new/page.tsx`
- Create: `src/app/(app)/app/o/[organizationId]/jobs/[jobId]/page.tsx`
- Create: `src/app/(app)/app/o/[organizationId]/jobs/job-actions.ts`
- Create: `src/components/jobs/job-form.tsx`
- Test: `e2e/jobs.spec.ts`

**Interfaces:**
- Produces validated `JobInput`, `JobRequirementInput`, `createJob`, `updateJob`, `deleteJob`, `getJob`, `listJobs`.
- Jobs are always organization-bound; requirement kinds are `must_have | nice_to_have`.

- [ ] **Step 1: Write failing validation/migration/repository tests** proving required title, bounded fields, requirement categories, tenant-bound foreign keys, role-restricted mutation and Org A/Org B isolation.
- [ ] **Step 2: Push/verify genuine RED**; unrelated lint/type/infrastructure failures do not count.
- [ ] **Step 3: Implement the migration and validation/repository minimum** with database constraints + RLS/RPC authority.
- [ ] **Step 4: Verify focused GREEN and real local-Supabase authorization behavior.**
- [ ] **Step 5: Add route-bound server actions and accessible job list/create/edit UI.** Ignore attacker-supplied organization IDs.
- [ ] **Step 6: Add browser E2E** for authorized create/update, requirement categories, cross-tenant denial and narrow-mobile keyboard/overflow basics.
- [ ] **Step 7: Review security/accessibility/YAGNI; fix Critical/Important findings and record evidence.**
- [ ] **Step 8: Update milestone/status/traceability/feature docs and commit.**

### Task 2: Competency Model

**Files:**
- Create migration/domain/validation/tests under `src/lib/interviewer/competencies*` and tenant builder routes/components as needed.

**Interfaces:**
- Produces job-bound competencies `{id, jobId, name, description, weight}` with deterministic ordering and total-weight validation policy.

- [ ] Write RED tests for tenant ownership, explicit job relation, bounded text/weight and mutation permissions.
- [ ] Implement minimal schema/repository/UI.
- [ ] Verify provider-backed RLS and focused UI behavior.
- [ ] Review and update durable evidence.

### Task 3: Observable 1–5 Rubrics

**Files:**
- Create rubric schema/domain/validation/tests and builder components.

**Interfaces:**
- Each competency has observable definitions for scores 1–5; no hidden criteria.

- [ ] RED tests reject missing score levels, non-observable/empty definitions, wrong-tenant competency references and mutation by disallowed roles.
- [ ] Implement minimal rubric persistence/editor.
- [ ] Verify GREEN + database constraints + accessibility.
- [ ] Review/update evidence.

### Task 4: Question Bank

**Interfaces:**
- Questions include text, competency link, difficulty, expected areas, follow-up hints, max duration and required/optional.

- [ ] RED tests for validation, tenant/job linkage and deterministic order.
- [ ] Implement persistence/repository/editor.
- [ ] Ensure AI-generated suggestions, if added, remain unpersisted until explicit user acceptance.
- [ ] Verify/review/update evidence.

### Task 5: Deterministic Interview Plan

**Interfaces:**
- Ordered sections with purpose, duration budget, questions and competencies.

- [ ] RED tests for positive bounded duration, deterministic ordering, question ownership, total duration consistency and missing required coverage.
- [ ] Implement schema/domain/editor.
- [ ] Verify/review/update evidence.

### Task 6: Interviewer Configuration

**Interfaces:**
- Draft configuration: internal name, job, interview type, persona, language, duration, difficulty, question strategy, guidelines, candidate instructions, follow-up policy and linked plan.

- [ ] RED validation tests for allowed interview types/personas/modes and bounded follow-up policy.
- [ ] Implement draft persistence/editor.
- [ ] Verify/review/update evidence.

### Task 7: Non-overridable Guardrail Validation

**Interfaces:**
- Pure validator returns structured violations for prohibited/discriminatory organization configuration.

- [ ] RED tests for protected-class, medical/disability, family/pregnancy, biometric/emotion/deception/accent/personality and autonomous hire/reject instructions.
- [ ] Implement deterministic validator used before persistence/publish where appropriate.
- [ ] Add adversarial organization-text tests; ensure candidate/org text cannot override platform policy.
- [ ] Verify/review/update evidence.

### Task 8: Draft / Publish State Machine

**Interfaces:**
- Draft is mutable; publish validates all required linked domain objects and only succeeds atomically when complete.

- [ ] RED tests for invalid state transitions and incomplete configuration.
- [ ] Implement state transition RPC/domain logic.
- [ ] Verify concurrency/idempotency behavior.
- [ ] Review/update evidence.

### Task 9: Immutable Versioning

**Interfaces:**
- Publish returns immutable interviewer version ID capturing exact job, requirements, competencies, rubric, questions, plan, interviewer config and platform prompt/guardrail version identifiers.

- [ ] RED tests prove published snapshots cannot be silently mutated and later draft edits do not change historical versions.
- [ ] Implement transactional snapshot creation and read API.
- [ ] Verify tenant isolation and immutability using real local Supabase.
- [ ] Review/update evidence.

### Task 10: Non-billable Preview

**Interfaces:**
- Preview composes validated interviewer configuration without candidate attempt or billable usage creation.

- [ ] RED tests prove preview does not create candidate/attempt/usage records and still enforces safety validation.
- [ ] Implement preview UI/server path using actual configuration composition authority.
- [ ] Verify/review/update evidence.

### Task 11: Builder End-to-End Closeout

- [ ] Add provider-backed browser flow: create job → requirements → competencies → rubric → questions → plan → interviewer config → guardrail validation → publish → read immutable version → preview.
- [ ] Add direct Org A/Org B/unauthenticated abuse matrix across M03 records.
- [ ] Verify desktop + 390×844 keyboard/focus/overflow behavior.
- [ ] Perform skeptical PRD/correctness/security/accessibility/performance/AI-safety/YAGNI review.
- [ ] Fix all Critical/Important findings through TDD where behavioral.
- [ ] Run complete repository quality gate and exact-final-head CI.
- [ ] Reconcile ledger/status/traceability/feature matrix/known issues/PR body.
- [ ] Auto-merge only when the user-authorized repository merge gates are all satisfied; verify post-merge `main` before activating M04.
