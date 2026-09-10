# Milestone Definitions M00–M15

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 195. MILESTONE 00 — PRODUCT FOUNDATION

## Goal

Bootstrap repository and persistent project-management structure.

Deliver:

```text
Next.js project
TypeScript
lint
tests
CI
README
AGENTS.md
PRD
milestone system
architecture skeleton
env template

```

No major product UI yet.

Exit:

```text
repo builds
CI green
milestone recovery works

```

---
# 196. MILESTONE 01 — SAAS SHELL + AUTH

Deliver:

```text
premium homepage
pricing placeholder/config
signup
login
verification
forgot/reset password
authenticated shell
secure sessions
basic profile

```

Also:

```text
SEO
responsive design
accessibility

```

Exit:

authenticated user can enter SaaS app.

---
# 197. MILESTONE 02 — ORGANIZATIONS + RBAC

Deliver:

```text
organization creation
memberships
owner/admin/recruiter/reviewer roles
team invitations
organization settings
tenant-aware navigation
RLS

```

Test two organizations aggressively.

Exit:

tenant isolation verified.

---
# 198. MILESTONE 03 — JOBS + INTERVIEWER BUILDER

Deliver:

```text
jobs
job criteria
competencies
rubrics
interview agent builder
persona
guidelines
question bank
interview sections
duration
draft/publish
versioning
preview

```

Also global guardrail validation.

Exit:

organization can publish immutable interviewer version.

---
# 199. MILESTONE 04 — CANDIDATES + INVITATIONS

Deliver:

```text
candidate records
secure invitations
opaque tokens
expiry
revocation
candidate pre-interview page
AI disclosure
consent
privacy info
accommodation contact

```

Exit:

candidate can securely open only their invitation.

---
# 200. MILESTONE 05 — REALTIME AI INTERVIEW

This milestone may reuse patterns from Talk Tutor.

Deliver:

```text
microphone diagnostics
realtime AI connection
voice interviewer
interview plan execution
question pacing
bounded follow-ups
barge-in
connection state
timeout
error recovery

```

Characterization + TDD.

Exit:

candidate can complete stable multi-turn voice interview.

---
# 201. MILESTONE 06 — TRANSCRIPT + DURABLE SESSION

Deliver:

```text
finalized transcript persistence
turn ordering
speaker attribution
idempotent attempt lifecycle
reconnect persistence
technical event tracking
session finalization

```

Exit:

completed interview produces durable accurate transcript.

---
# 202. MILESTONE 07 — EVIDENCE-BASED ASSESSMENT ENGINE

Deliver:

```text
structured assessment
competency scores
rubric enforcement
evidence citations
evidence sufficiency
strengths
concerns
question coverage
guardrails
schema validation
prompt injection defense
assessment provenance

```

Do NOT include autonomous hire/reject.

Exit:

assessment is reviewable and every score is evidence-grounded.

---
# 203. MILESTONE 08 — HIRING TEAM REVIEW EXPERIENCE

Deliver:

```text
candidate results
assessment dashboard
transcript viewer
evidence deep links
human score override
reviewer notes
review status
AI/human disagreement
job candidate dashboard

```

Exit:

human can independently review AI assessment.

---
# 204. MILESTONE 09 — BILLING + USAGE

Deliver:

```text
organization subscription
Stripe
plans
interview-minute usage
server-side enforcement
usage meter
checkout
portal
cancellation
webhooks

```

Exit:

organizations pay and limits are enforceable server-side.

---
# 205. MILESTONE 10 — AI QUALITY, GUARDRAILS & EVALS

Deliver production AI quality layer.

```text
golden interview dataset
assessment evals
interviewer behavior evals
adversarial evals
fairness paired evals
prompt versioning
guardrail versions
AI tracing
human override analytics
AI regression CI gates

```

Exit:

AI changes are measurable rather than subjective.

---
# 206. MILESTONE 11 — ENTERPRISE READINESS

Possible:

```text
advanced audit logs
retention configuration
data deletion workflows
organization branding
security hardening
rate limiting
observability
incident tooling
SLA monitoring
access reviews

```

Potential:

```text
SSO/SAML

```

if required.

---
# 207. MILESTONE 12 — INTEGRATIONS

Only after core product works.

Potential:

```text
Greenhouse
Lever
Ashby
Workable
generic webhooks
public API
CSV import

```

One integration at a time.

---
# 208. MILESTONE 13 — CODING INTERVIEW

Separate future milestone.

Potential:

```text
Monaco editor
sandbox
test execution
coding prompt
AI follow-ups
code snapshot
evidence-based evaluation

```

Security-sensitive.

Use isolated execution environment.

---
# 209. MILESTONE 14 — ADVANCED INTERVIEW FORMATS

Possible:

```text
case study
presentation
system-design canvas
take-home review

```

Only after core adoption.

---
# 210. MILESTONE 15 — ENTERPRISE COMPLIANCE PROGRAM

Depending on jurisdictions/market:

evaluate and implement required:

```text
candidate notices
bias-audit support
AI-system documentation
human oversight
risk management
data governance
accessibility/accommodations
retention disclosures
audit exports

```

Do current legal research before implementation.

Do not rely on this PRD as legal advice.

---
