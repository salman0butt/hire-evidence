# Human Review, Auditability & Versioning

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 84. COMPANY REVIEW PAGE

Hiring team sees:

```text
Candidate
Job
Interview date
Duration
Status

Overall rubric summary

Competency scores

Evidence

Transcript

Question coverage

AI observations

Reviewer comments

Human score overrides

```

---
# 85. EVIDENCE-FIRST UI

Every important assessment should be clickable to evidence.

Example:

```text
System Design       4/5

"Good handling of async processing"

View evidence →

```

Click scrolls transcript to relevant turn.

---
# 86. TRANSCRIPT REVIEW

Provide:

```text
speaker separation
timestamps where available
question markers
competency markers
search
evidence highlighting

```

Do not create overly complicated annotation tooling initially.

---
# 87. HUMAN REVIEW WORKFLOW

Possible state:

```text
AI assessment generated
↓
Awaiting human review
↓
Reviewed

```

Human can:

```text
accept assessment
modify scores
leave notes

```

---
# 88. HIRING DECISION

If product later stores hiring decisions:

decision must be human-authored.

Examples:

```text
Advance
Hold
Reject

```

Store:

```text
decision
decision_by
decision_at
optional reason

```

AI must not populate this field autonomously.

---
# 89. REVIEWER DISAGREEMENT DATA

Store AI vs human scoring difference.

This becomes valuable eval data.

Example:

```text
AI: 4
Human: 2

```

Flag for AI-quality analysis.

---
# 90. INTERVIEW ANALYTICS

Organization dashboard may show:

```text
interviews created
invites sent
completion rate
average duration
technical failure rate
time-to-review

```

Avoid using aggregate candidate scores as simplistic workforce-quality metrics.

---
# 91. JOB DASHBOARD

For a job:

```text
Candidates
Invited
Started
Completed
Awaiting review
Reviewed

```

Candidate list may show rubric summary.

Avoid automated ranking as the default.

---
# 92. CANDIDATE COMPARISON

If comparison is implemented:

use explicit job rubric dimensions.

Example:

| CandidateSystem DesignNode.jsProblem Solving |
| -------------------------------------------- |

Human reviewer must interpret results.

Do not generate:

```text
Best candidate

```

solely from AI.

---
# 93. SEARCH / FILTERING

Allow team to filter:

```text
status
job
interview
date
review state

```

Later:

```text
competency ranges

```

Be careful about building automated candidate-screening workflows prematurely.

---
# 94. TEAM COMMENTS

Reviewers can leave internal comments.

Possible:

```text
@mention

```

later.

MVP:

```text
plain notes

```

---
# 95. AUDIT LOG

Because this is hiring-related:

maintain audit events for significant actions.

Examples:

```text
interviewer published
rubric changed
candidate invited
interview started
interview completed
assessment generated
score overridden
review completed
candidate data deleted

```

Audit log should be immutable enough for accountability.

---
# 96. ASSESSMENT PROVENANCE

Store:

```text
model
model version where available
prompt version
rubric version
interviewer version
guardrail version
assessment generated at

```

This is critical for debugging historical decisions.

---
# 97. INTERVIEWER VERSIONING

When recruiter publishes interviewer:

create immutable version.

Example:

```text
Interviewer
   ├── Draft
   ├── Version 1
   ├── Version 2

```

Invitation references version.

Old interviews remain linked to original version.

---
# 98. DRAFT / PUBLISH WORKFLOW

Interviewer agent states:

```text
draft
published
archived

```

Recruiter can edit draft.

Publishing creates immutable version snapshot.

---
# 99. INTERVIEW PREVIEW

Before publishing:

organization user can run:

```text
Preview interview

```

with simulated candidate.

This does not count as real candidate interview.

Useful for verifying:

```text
questions
persona
follow-ups
timing

```

---
# 100. AGENT QUALITY CHECK BEFORE PUBLISH

Run deterministic configuration validation.

Examples:

```text
At least one competency

Rubric present

Interview duration valid

Questions cover required competencies

No prohibited criteria

```

Optional AI linting can flag:

```text
possibly leading questions
ambiguous criteria
unsupported discriminatory criteria

```

Human remains responsible for final configuration.

---
