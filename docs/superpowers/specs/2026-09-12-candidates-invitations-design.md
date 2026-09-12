# Candidates + Invitations Design

## Context

M04 starts from verified `main` at `729474ffb03075c93dfa2564f0004f1590533753`, after Jobs + Interviewer Builder merged and post-merge CI #432 passed. The authoritative milestone requires candidate records, secure opaque invitations with expiry/revocation, a narrowly scoped public candidate route, pre-interview information, AI/transcription disclosure, consent, privacy information, and an accommodation/support path.

## Design goals

1. Candidate data is tenant-owned and job-bound.
2. Public candidate access is capability-style and scoped only to one invitation; possession of an opaque token never grants broader tenant access.
3. Raw invitation tokens are never stored. Persist only a SHA-256 hash plus lifecycle metadata.
4. Expired, revoked, completed, or otherwise unusable invitations fail closed without revealing whether another invitation exists.
5. Candidate-facing pages disclose AI/transcription/data handling before interview start and record explicit consent events.
6. Existing PostgreSQL RLS/RPC authority and fixed organization roles remain authoritative; browser TypeScript checks are only UX/preflight.
7. Candidate text remains untrusted input and must never alter platform guardrails or hiring decision authority.

## Architecture

### Candidate records

Create `public.candidates` with `id`, `organization_id`, `job_id`, minimal identity fields (`full_name`, `email`), timestamps, and tenant/job foreign keys. Organization members with job-management authority may create/read candidate records through explicit RPCs; direct browser mutation grants remain absent.

### Invitation records

Create `public.candidate_invitations` with `candidate_id`, `organization_id`, `job_id`, immutable `interviewer_version_id`, `token_hash`, `expires_at`, lifecycle state, sent/opened/started/completed/revoked timestamps, and audit timestamps. The raw token is generated server-side with a cryptographically secure RNG and returned once at creation; only its SHA-256 hash is persisted.

Invitation state is monotonic: `draft -> sent -> opened -> started -> completed`, with `revoked` and `expired` terminal conditions. Replays after completion/revocation/expiry fail safely.

### Public authorization boundary

A server-only lookup accepts the raw token, hashes it, and resolves exactly one invitation. The lookup checks token hash, expiry, revocation/completion state, and returns only the public pre-interview projection needed for that invitation. It never exposes organization membership data, internal candidate IDs beyond what the page requires, or other tenant records.

### Pre-interview disclosure and consent

The candidate pre-interview page shows company/role, expected duration and format, technical requirements, AI-assisted interview disclosure, transcription disclosure, privacy/retention information, and an accommodation/support contact path. Explicit consent is required before transition to the interview-start state. Consent is recorded as an append-only event with timestamp and disclosure version.

### Security and privacy

- 256-bit random opaque tokens; no guessable identifiers in public URLs.
- SHA-256 hash-at-rest; raw token returned once and excluded from logs.
- Constant-shape not-found/expired/revoked responses to reduce enumeration clues.
- RLS protects tenant-owned candidate and invitation records; public access occurs only through narrowly scoped security-definer RPC/server boundary with explicit checks.
- Invitation creation binds a published interviewer version so later editor changes cannot silently change the candidate's invitation contract.
- No service-role browser client and no public table grants that bypass the intended boundary.

## Testing strategy

Use strict TDD per repository policy. Start with migration-contract RED tests for candidate tenancy, job/version binding, RLS, token hash/expiry/revocation fields, and absence of raw-token persistence. Follow with validation/repository/action tests, provider-backed Supabase isolation and replay tests, then browser coverage for valid/invalid/expired/revoked/completed tokens, disclosure/consent, keyboard/focus behavior, and narrow-mobile overflow.

## Milestone slicing

1. Candidate records.
2. Secure token service and invitation persistence.
3. Invitation lifecycle.
4. Public candidate token authorization.
5. Pre-interview information.
6. Disclosure + consent.
7. Accommodation/support path.
8. Security/browser closeout.

## Non-goals

Realtime interviewing, transcript persistence, assessment/scoring, autonomous hiring decisions, protected-trait inference, personality/emotion/deception scoring, and billing remain out of scope for M04.
