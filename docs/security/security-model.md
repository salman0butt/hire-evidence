# Security & Fairness Model

> Derived implementation guide. `docs/product/PRD.md` is authoritative.

## P0 invariants

- No cross-tenant access.
- No candidate-token leakage or overbroad candidate authorization.
- No fabricated assessment evidence.
- No protected-trait, biometric, emotion, accent, personality or deception scoring.
- No transcript/configuration prompt injection controlling trusted assessment policy.
- No autonomous AI hire/reject decision.
- No Stripe entitlement bypass.
- No transcript speaker attribution corruption.

## Tenancy

Use PostgreSQL RLS for tenant-owned data and explicit role capabilities. Add constraints/composite relationships where feasible so records from different organizations cannot be linked accidentally. Test Org A, Org B and candidate token flows directly.

## Candidate tokens

Use cryptographically secure opaque tokens. Prefer hash-at-rest. Tokens must support expiry, revocation, attempt limits and completed-token replay prevention. Candidate access is server-scoped to the specific invitation/attempt.

## Untrusted input

Candidate transcript and organization custom text are untrusted data. Platform policy and interview safety policy always outrank them. Transcript should render as plain text by default; protect against stored XSS/unsafe Markdown.

## Hiring safety

Assessment may evaluate job-related answer content against an explicit rubric, but must not infer protected/sensitive traits or biometric/emotional characteristics. Humans review and author actual hiring decisions.

## Privacy

Minimize candidate data, define retention/deletion behavior, restrict privileged support access, and avoid storing full sensitive transcripts in external telemetry unless necessary and governed.

## Source sections

Critical PRD sections: 4–6, 29–30, 48–49, 74–77, 88, 95–96, 106–108, 125–132, 143, 149–153, 165–167, 210, 214–219, 235.
