# Branches, PRs, Review, Verification & Priorities

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 211. EACH MILESTONE BRANCH

Naming:

```text
feat/m01-saas-auth
feat/m02-organizations-rbac
feat/m03-interviewer-builder
...

```

Use repository conventions if established.

---
# 212. EACH MILESTONE PR

PR must state:

```text
Goal
Scope
Architecture
Database changes
Security
AI considerations
Tests
E2E
Known limitations
Manual setup

```

Do not merge unless explicitly authorized by project workflow/user.

---
# 213. CODE REVIEW

Before PR ready:

run multiple reviewer lenses.

At minimum:

```text
Correctness
Architecture
TypeScript
Security
Multi-tenancy
Database/RLS
AI safety
AI eval
Realtime
React
Accessibility
Tests

```

---
# 214. P0 REVIEW AREAS

Treat as critical:

```text
cross-tenant access
candidate token leakage
fabricated assessment evidence
protected-trait scoring
prompt-injection assessment manipulation
autonomous hiring decision
Stripe entitlement bypass
incorrect transcript attribution

```

---
# 215. VERIFICATION

Fresh evidence required.

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build

```

plus milestone-specific tests.

Do not say:

```text
should pass

```

Run them.

---
# 216. DATABASE VERIFICATION

Test:

```text
migration application
RLS
grants
cross-tenant isolation
candidate token scope
organization role authorization

```

---
# 217. AI VERIFICATION

For AI-affecting milestones:

run:

```text
deterministic evals
guardrail suite
golden dataset
live model eval where required

```

---
# 218. REALTIME VERIFICATION

For live interview:

test:

```text
connect
candidate speech
AI speech
transcript
multiple turns
interrupt
disconnect
reconnect
timeout
microphone failure
provider failure

```

---
# 219. DEVELOPMENT PRIORITY

Always use:

```text
Correctness
>
Candidate Fairness
>
Security
>
Evidence Quality
>
Reliability
>
Testability
>
Simplicity
>
Maintainability
>
Performance
>
Abstraction
>
Cleverness

```

---
# 220. DO NOT BUILD HYPE FEATURES

Do NOT add without concrete requirement:

```text
multi-agent swarm
LangGraph
vector database
RAG
knowledge graph
emotion AI
facial analysis
deception detection
personality AI
autonomous hiring
candidate success prediction
fine-tuning
complex orchestration

```

---
