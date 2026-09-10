# Autonomous Development & Milestone System

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 183. MILESTONE SYSTEM — CRITICAL

The project must maintain persistent development state INSIDE THE GITHUB REPOSITORY.

Every autonomous development session must recover from repository state.

Do NOT depend on ChatGPT conversation memory.

---
# 184. MILESTONE DIRECTORY

Create:

```text
docs/product/
    PRD.md

docs/architecture/

docs/security/

docs/ai/

docs/milestones/
    README.md
    CURRENT.md
    M00-foundation.md
    M01-saas-shell-auth.md
    M02-organizations-rbac.md
    M03-jobs-interviewer-builder.md
    M04-candidate-invitations.md
    M05-realtime-interview.md
    M06-transcript-persistence.md
    M07-assessment-engine.md
    M08-review-dashboard.md
    M09-billing-usage.md
    M10-ai-quality-safety.md
    M11-enterprise-readiness.md
    M12-integrations.md

```

Names may be adjusted, but preserve the concept.

---
# 185. CURRENT MILESTONE FILE

`docs/milestones/CURRENT.md`

must provide the one canonical development state.

Example:

```markdown
# Current Milestone

Milestone:
M05 — Realtime Interview

Status:
IMPLEMENTING

Branch:
feat/m05-realtime-interview

Base:
main

PR:
#18

Last verified commit:
abc123

Completed:
- microphone capture
- realtime token endpoint
- connection state

In Progress:
- transcript normalization

Remaining:
- reconnect
- timeout
- persistence integration

Blocking Issues:
None

Verification:
- lint: PASS
- typecheck: PASS
- unit: PASS
- e2e: NOT RUN
- build: PASS

Next Action:
Implement transcript finalization tests.

```

---
# 186. MILESTONE STATES

Use:

```text
NOT_STARTED
RECOVERING
ANALYZING
DESIGNING
PLANNING
IMPLEMENTING
TESTING
REVIEWING
VERIFYING
BLOCKED
READY_FOR_REVIEW
COMPLETE

```

Only one milestone should normally be active.

---
# 187. MILESTONE FILE STRUCTURE

Every milestone document contains:

```text
Goal
User value
Scope
Out of scope
Dependencies
Architecture decisions
Data model
Security considerations
AI considerations
Implementation tasks
Test plan
E2E scenarios
Acceptance criteria
Current status
Branch
PR
Verification evidence
Known issues
Next action

```

---
# 188. RECOVERY PROTOCOL

Every autonomous coding session MUST begin:

```text
1. Read superpowers:using-superpowers

2. Read AGENTS.md

3. Inspect Git status

4. Fetch latest remote

5. Read docs/product/PRD.md

6. Read docs/milestones/README.md

7. Read docs/milestones/CURRENT.md

8. Read active milestone file

9. Inspect associated PR

10. Inspect review threads

11. Inspect CI

12. Inspect recent commits

13. Reconcile documentation with actual repo state

14. Update CURRENT.md if stale

15. Continue from Next Action

```

GitHub is the persistent memory.

---
# 189. NO FAKE STATUS

Never mark:

```text
COMPLETE

```

because code was written.

Completion requires:

```text
implementation
tests
review
verification
CI
documentation

```

---
# 190. SUPERPOWERS WORKFLOW

FIRST read:

`superpowers:using-superpowers`

Use applicable skills:

```text
brainstorming
writing-plans
using-git-worktrees
test-driven-development
systematic-debugging
subagent-driven-development
requesting-code-review
receiving-code-review
verification-before-completion
finishing-a-development-branch

```

---
# 191. SUPERPOWERS DESIGN DOCUMENTS

Each architectural milestone should produce:

```text
docs/superpowers/specs/
YYYY-MM-DD-<milestone>-design.md

```

---
# 192. SUPERPOWERS IMPLEMENTATION PLANS

Create:

```text
docs/superpowers/plans/
YYYY-MM-DD-<milestone>.md

```

---
# 193. DEVELOPMENT AUTONOMY

Routine decisions are pre-authorized.

Do not stop for approval of:

```text
file names
module names
migration names
component names
routine SQL indexes
test organization
reasonable internal architecture

```

But do not silently change major product requirements.

---
# 194. ONE MILESTONE AT A TIME

Do NOT attempt to implement the entire PRD in one giant branch.

Each milestone should produce:

```text
working coherent product increment
tests
documentation
PR
review
verification

```

---
