# Engineering, Testing & Architecture

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 171. PLATFORM OBSERVABILITY

Application observability:

```text
request errors
database errors
webhook failures
realtime disconnects
assessment failures
email failures

```

Structured logs.

Never log secrets or entire transcripts by default.

---
# 172. CI

At minimum:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build

```

Also:

```text
database migration tests
RLS tenant-isolation tests
AI deterministic evals

```

---
# 173. TESTING STRATEGY

Use:

```text
Unit
Integration
Database/RLS
AI eval
E2E
Visual E2E

```

---
# 174. STRICT TDD

For deterministic domain rules:

```text
RED
GREEN
REFACTOR

```

Examples:

```text
tenant authorization
invitation expiry
attempt lifecycle
usage calculation
rubric weighting
assessment evidence validation

```

---
# 175. E2E CRITICAL FLOW

Must eventually automate:

```text
Owner signup
↓
Organization creation
↓
Create job
↓
Create interviewer
↓
Publish interviewer
↓
Create candidate
↓
Send/generate invitation
↓
Candidate opens link
↓
Consent
↓
Mic diagnostics
↓
Interview
↓
Complete
↓
Assessment generated
↓
Reviewer opens assessment
↓
Evidence links work
↓
Reviewer overrides score

```

---
# 176. VISUAL QA

Test:

```text
homepage
auth
organization onboarding
dashboard
job builder
interviewer builder
candidate management
candidate pre-interview
live interview
assessment report
billing
settings

```

Desktop + mobile.

---
# 177. TECH STACK

Start with the proven Talk Tutor style stack unless discovery gives strong reason otherwise.

Recommended:

```text
Next.js
React
TypeScript
Tailwind CSS
Supabase Auth
PostgreSQL
RLS
Stripe
Gemini Live or appropriate realtime provider

```

Use current compatible versions at implementation time.

Do not blindly freeze to historical Talk Tutor package versions.

---
# 178. STATE MANAGEMENT

Use server state/server components where appropriate.

Realtime interview state may justify focused Zustand or equivalent.

Do not put the entire SaaS in a global client store.

---
# 179. ARCHITECTURE PRINCIPLES

Use:

```text
KISS
YAGNI
DRY
SOLID pragmatically
Separation of Concerns
Single Source of Truth
High Cohesion
Low Coupling
Explicit over Implicit
Composition over Inheritance
Functional Core / Imperative Shell

```

---
# 180. SIMPLE IS A HARD REQUIREMENT

The final architecture should be understandable.

Avoid:

```text
microservices
CQRS
event sourcing
Kafka
generic workflow engine
generic agent framework
distributed orchestration

```

until real scale/problem demands them.

---
# 181. AGENT FRAMEWORK DECISION

Do not add LangGraph just because this product contains an "AI Interviewer Agent."

The realtime interview can likely be:

```text
deterministic interview plan
+
LLM conversation
+
bounded follow-up rules

```

Use LangGraph only if later workflows genuinely require graph orchestration.

---
# 182. RAG

Do not add RAG initially.

Current interview context is:

```text
job
rubric
questions
company guidelines

```

which fits normal structured context.

Potential later RAG:

```text
company competency handbook
internal technical documentation
large question libraries

```

Only then evaluate retrieval.

---
