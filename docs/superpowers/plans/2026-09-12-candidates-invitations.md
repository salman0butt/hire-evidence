# Candidates + Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver tenant-scoped candidate records and secure, opaque, expiring/revocable interview invitations with a consent-gated pre-interview experience.

**Architecture:** PostgreSQL/RLS remains authoritative for tenant data. Candidate invitations use a cryptographically random raw token returned once, SHA-256 hash-at-rest, immutable binding to a published interviewer version, narrowly scoped public resolution, and append-only consent evidence. Public routes receive only a safe projection for the one invitation represented by the token.

**Tech Stack:** Next.js 16, TypeScript, React, Supabase/PostgreSQL, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-12-candidates-invitations-design.md`

## Global Constraints

- Preserve existing fixed organization roles and authoritative PostgreSQL RLS/RPC authorization.
- Never persist or log raw invitation tokens.
- Public token resolution must fail closed for invalid, expired, revoked, or completed invitations.
- Candidate-facing copy must disclose AI/transcription/data handling before interview start.
- No autonomous hire/reject authority, protected-trait inference, personality/emotion/deception scoring, or fabricated evidence.

---

### Task 1: Candidate persistence foundation

**Files:**
- Create: `src/lib/candidates/candidate-migration.test.ts`
- Create: `supabase/migrations/202609120011_create_candidates.sql`
- Later create: `src/lib/candidates/candidate-validation.ts`, `candidate-validation.test.ts`, `candidates.ts`, `candidates.test.ts`

**Interfaces:**
- Produces tenant-owned `public.candidates` records bound to `organization_id` and `job_id`.
- Candidate mutations are exposed through authenticated role-gated RPCs, not direct browser table writes.

- [ ] Write a migration-contract test requiring `public.candidates`, organization/job FKs, RLS, timestamps, normalized email/full-name fields, and no cross-tenant direct mutation grants.
- [ ] Push RED and verify exact-head CI fails for the missing migration only.
- [ ] Add the minimal migration with RLS and role-gated creation/read boundaries.
- [ ] Verify GREEN locally/CI, then add provider-backed Org A/Org B/unauthenticated isolation coverage.
- [ ] Add bounded validation/repository behavior via RED→GREEN tests.

### Task 2: Secure invitation token service

**Files:**
- Create: `src/lib/candidates/invitation-token.ts`
- Create: `src/lib/candidates/invitation-token.test.ts`
- Create: `supabase/migrations/202609120012_create_candidate_invitations.sql`

**Interfaces:**
- `createInvitationToken(): { token: string; tokenHash: string }`
- `hashInvitationToken(token: string): string`
- Database stores `token_hash`, never raw token.

- [ ] RED tests require 32 random bytes minimum, URL-safe opaque token output, deterministic SHA-256 hashing, and no raw token persistence column.
- [ ] Implement with Node `crypto.randomBytes(32)` and `createHash("sha256")`.
- [ ] Add invitation table with candidate/org/job/interviewer-version FKs, unique token hash, expiry/revocation timestamps and RLS.
- [ ] Verify provider-backed uniqueness and tenant isolation.

### Task 3: Invitation lifecycle

**Files:**
- Create/modify candidate invitation repository/action modules and tests.
- Modify invitation migration with state enum/RPCs if not already present.

**Interfaces:**
- Lifecycle: `draft -> sent -> opened -> started -> completed`; `revoked`/expired are terminal authorization failures.

- [ ] RED tests for monotonic transitions and terminal replay denial.
- [ ] Implement authoritative RPC transition checks.
- [ ] Verify expired/revoked/completed invitations cannot reopen or start.

### Task 4: Public invitation resolution

**Files:**
- Create: `src/lib/candidates/public-invitation.ts` and tests.
- Create candidate public route under `src/app/interview/[token]/` following current app conventions.

**Interfaces:**
- Raw token is hashed server-side, resolved to one invitation, and mapped to a safe public projection only.

- [ ] RED tests for invalid/expired/revoked/completed tokens returning the same safe failure shape.
- [ ] Implement server-only resolution with no service-role browser client.
- [ ] Verify no tenant/member/internal metadata leaks.

### Task 5: Pre-interview experience

**Files:**
- Create focused candidate pre-interview UI components and component tests.

**Required content:** company, role, expected duration, format, technical requirements, privacy summary, and start prerequisites.

- [ ] RED semantic/accessibility tests.
- [ ] Implement responsive page using existing design-system patterns.
- [ ] Verify keyboard order, focus, status/error semantics, and 390×844 no-overflow behavior.

### Task 6: Disclosure and consent evidence

**Files:**
- Create migration/table/RPC for append-only consent events plus repository/action/UI tests.

**Interfaces:**
- Consent event records invitation, disclosure version, consent timestamp, and required disclosure categories.

- [ ] RED tests require AI use, transcription, data/retention disclosure and explicit consent before start.
- [ ] Implement append-only consent persistence.
- [ ] Prevent interview-start transition without current disclosure consent.
- [ ] Verify consent cannot be rewritten through public/browser mutation paths.

### Task 7: Accommodation/support path

**Files:**
- Modify pre-interview UI and tests.

- [ ] RED accessibility/content test requiring a clearly labeled accommodation/support path and alternative-process information.
- [ ] Implement without requiring candidates to disclose medical/protected details in the application.
- [ ] Verify link/contact content is tenant-configured only through trusted organization settings boundaries.

### Task 8: Security/E2E closeout

**Files:**
- Extend provider-backed Supabase and Playwright suites.
- Update milestone/status/traceability/evidence docs.

- [ ] Provider tests: Org A/B isolation, anonymous table denial, token-hash-only persistence, wrong token, expired, revoked, completed/replayed token, immutable interviewer-version binding.
- [ ] Browser tests: valid invitation, invalid/expired/revoked/completed safe failure, disclosure + consent, narrow mobile, keyboard focus.
- [ ] Run frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase/provider tests, build, Chromium E2E and PRD coverage.
- [ ] Perform skeptical correctness/security/privacy/accessibility/performance/AI-safety/YAGNI review; resolve all Critical/Important findings.
- [ ] Reconcile durable docs and verify exact-final-head CI before auto-merge.
