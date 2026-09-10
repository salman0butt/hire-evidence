# Future Opportunities, Metrics, MVP, Governance & North Star

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 221. FUTURE AI OPPORTUNITY — INTERVIEW DESIGN ASSISTANT

Potential high-value later feature:

Recruiter pastes JD.

AI proposes:

```text
competencies
rubric
questions
interview structure

```

Human approves before publishing.

This is likely more valuable than agents/RAG early.

---
# 222. FUTURE AI OPPORTUNITY — INTERVIEW QUALITY LINTER

Analyze interviewer configuration before publish.

Warn:

```text
Question is leading.

Question does not map to any competency.

Rubric is vague.

Three competencies have no questions.

This criterion may be non-job-related.

Duration does not fit question count.

```

Human fixes.

---
# 223. FUTURE AI OPPORTUNITY — QUESTION COVERAGE OPTIMIZER

Deterministically identify:

```text
rubric areas without questions

```

AI may suggest questions.

Do not automatically publish.

---
# 224. FUTURE AI OPPORTUNITY — REVIEW ASSISTANT

After assessment:

reviewer can ask:

```text
Show evidence for the candidate's API design score.

Where did they discuss caching?

Which question exposed the biggest knowledge gap?

```

This could use structured transcript search.

SQL/full text may be enough initially.

Do not automatically add RAG.

---
# 225. FUTURE AI OPPORTUNITY — FAIRNESS AUDIT ASSISTANT

Internal/compliance function.

Use controlled data to detect score drift or rubric inconsistencies.

Not candidate-facing.

Requires careful governance.

---
# 226. SUCCESS METRICS — PRODUCT

Potential:

```text
organization activation rate
time to create first interviewer
invite → completion rate
assessment review rate
time saved per completed interview
subscription conversion
retention

```

---
# 227. SUCCESS METRICS — AI

```text
assessment schema success
evidence grounding pass
human override rate
interviewer policy adherence
prompt-injection pass
technical interview completion

```

---
# 228. SUCCESS METRICS — RELIABILITY

```text
connection success
unexpected disconnect
reconnect success
transcript completion
assessment generation success

```

---
# 229. SUCCESS METRICS — FAIRNESS / QUALITY

Use carefully governed offline metrics.

Examples:

```text
paired synthetic case consistency
rubric consistency
human-AI agreement
unsupported claim rate

```

Do not use demographic outcome monitoring casually without legal/privacy design.

---
# 230. NON-GOALS FOR MVP

Explicitly NOT MVP:

```text
full ATS
video analytics
emotion recognition
facial recognition
candidate personality scoring
deception detection
coding sandbox
whiteboard
RAG
agents
fine-tuning
SSO
SCIM
10 ATS integrations
mobile apps

```

---
# 231. MVP DEFINITION

A real MVP should allow:

```text
1. Company signs up.

2. Creates organization.

3. Creates a job.

4. Defines competencies/rubric.

5. Creates and publishes AI interviewer.

6. Adds candidate.

7. Generates secure interview link.

8. Candidate completes AI voice interview.

9. Transcript persists.

10. AI creates evidence-grounded assessment.

11. Hiring manager reviews transcript + evidence.

12. Human can override scores.

13. Organization usage is tracked.

14. Subscription can be purchased.

```

That alone is a serious product.

---
# 232. POST-MVP PRIORITY

Recommended order:

```text
Quality/Evals
Enterprise controls
ATS integrations
Coding interviews
Advanced interview formats

```

Do not chase flashy AI features before reliability and assessment quality.

---
# 233. REQUIRED ROOT DOCUMENTS

Repository should contain:

```text
README.md

AGENTS.md

docs/product/PRD.md

docs/architecture/overview.md

docs/security/security-model.md

docs/ai/ai-safety.md

docs/ai/evaluation-strategy.md

docs/milestones/README.md

docs/milestones/CURRENT.md

```

---
# 234. AGENTS.MD

Repository `AGENTS.md` must explain:

```text
how to recover project state
which docs are authoritative
how milestones work
required Superpowers usage
TDD requirements
verification requirements
PR rules
security/fairness invariants

```

---
# 235. NON-NEGOTIABLE AGENT INVARIANTS

Include in AGENTS.md:

```text
Never create autonomous hire/reject logic.

Never infer protected traits.

Never add emotion recognition.

Never score accents.

Never persist unsupported assessment evidence.

Never bypass tenant RLS.

Never mark milestone COMPLETE without fresh verification.

Never start next milestone while current milestone is incomplete unless explicitly authorized.

```

---
# 236. CURRENT.MD UPDATE POLICY

Update `CURRENT.md` whenever:

```text
milestone begins
design completes
implementation starts
PR opens
blocking issue discovered
tests fail materially
review begins
verification completes
milestone completes

```

Do not update for every tiny commit.

---
# 237. SOURCE OF TRUTH ORDER

Use:

```text
1. Actual repository / Git history

2. AGENTS.md

3. PRD

4. CURRENT.md

5. Active milestone document

6. Design spec

7. Implementation plan

8. Conversation context

```

If docs conflict with code:

investigate and reconcile.

---
# 238. AUTONOMOUS SESSION START PROMPT

Every future session should effectively begin:

```text
Recover the repository state before doing any work.

Read AGENTS.md, PRD, milestones/CURRENT.md,
active milestone, branch/PR/CI/reviews.

Use Superpowers.

Continue from repository state.

Do not rely on previous conversation memory.

```

---
# 239. FINAL DEVELOPMENT PHILOSOPHY

Continuously ask:

```text
Is the interview criterion actually job-related?

Can the AI prove this score from the transcript?

Would two equally qualified candidates receive comparable assessment?

Could candidate text manipulate the post-interview evaluator?

Could organization configuration override safety rules?

Can a candidate from Org A be read by Org B?

Can a human understand why this score exists?

Can a reviewer disagree and override it?

Can we reproduce which prompt/model generated this assessment?

Could this feature create discrimination risk?

Does this require AI at all?

Could deterministic code solve this more safely?

Are we building something useful today or architecture for a hypothetical future?

```

---
# 240. FIRST ACTION WHEN STARTING THE PROJECT

When this PRD is given to the coding agent:

DO NOT immediately implement the entire application.

Perform:

```text
1. Read Superpowers.

2. Inspect Talk Tutor reference repository.

3. Research current realtime provider capabilities.

4. Research current hiring-AI compliance requirements for target markets.

5. Create the new repository/project.

6. Add PRD.

7. Add AGENTS.md.

8. Add architecture overview.

9. Add security/fairness invariants.

10. Create milestone system.

11. Set CURRENT.md to M00.

12. Design M00.

13. Write M00 implementation plan.

14. Implement M00 using TDD.

15. Test.

16. Review.

17. Verify.

18. Create PR.

19. Update milestone status.

20. Stop at the milestone boundary unless explicitly authorized to continue.

```

---
# 241. FINAL PRODUCT NORTH STAR

The system should not answer:

> "Who should we hire?"

It should answer:

> "What evidence did this candidate provide against the job-related criteria the hiring team explicitly defined?"

That distinction should guide the entire architecture.

---
# 242. PRD ACCEPTANCE CRITERIA

This PRD is successful when the future implementation provides:

- strong B2B multi-tenancy
- secure candidate interview links
- configurable interview agents
- structured interview plans
- consistent core questions
- bounded follow-ups
- reliable realtime voice
- accurate transcripts
- evidence-grounded assessments
- job-related competency rubrics
- human review
- score overrides
- complete provenance
- AI guardrails
- deterministic and model-based evals
- fairness-oriented regression tests
- organization billing
- interview-minute metering
- durable milestone recovery
- strong CI
- RLS
- auditability
- privacy controls
- maintainable code
- simple architecture

while deliberately excluding:

- biometric evaluation
- emotion recognition
- protected-trait inference
- accent scoring
- personality scoring
- deception detection
- autonomous hiring decisions

---

# DEFINITION OF PRODUCT QUALITY

Use:

```text
Evidence > Impression

Rubric > Vague AI judgment

Human oversight > Automation

Job relevance > Generic personality scoring

Determinism > AI where possible

Guardrails > Prompt hope

Evals > "It looks good"

Tenant isolation > Application assumptions

Simple architecture > Enterprise architecture theater

```

Build a hiring interview platform that companies can trust, candidates can understand, and engineers can safely improve.
