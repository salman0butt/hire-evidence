# Interviewer Builder, Rubrics, Questions & Interview Plan

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 23. INTERVIEW AGENT BUILDER

This is the core company feature.

The hiring team creates an AI interviewer.

Possible route:

```text
/interviewers/new

```

Agent configuration should include:

```text
Name
Job
Interview type
Persona
Duration
Language
Difficulty
Question strategy
Competencies
Rubric
Follow-up rules
Guardrails
Candidate instructions

```

---
# 24. INTERVIEWER NAME

Example:

```text
Senior Backend Engineering Interviewer

```

This is internal/admin-facing.

Candidate-facing display could simply say:

```text
AI Interviewer for Senior Backend Engineer

```

---
# 25. INTERVIEW TYPES

Support structured categories.

Examples:

```text
Screening
Behavioral
Technical
Role-specific
Leadership
Case study
System design
Culture/values questions
Custom

```

Be careful with "culture fit."

Prefer:

```text
company values / role behaviors

```

that are explicitly job-related.

---
# 26. INTERVIEW PERSONA

Organization can configure conversational style.

Examples:

```text
Professional
Friendly
Direct
Technical
Conversational

```

Persona controls:

```text
tone
question phrasing
transition style

```

Persona must NOT change:

```text
assessment rubric
fairness rules
safety rules

```

---
# 27. PERSONA EXAMPLE

Example:

```text
You are a senior engineering manager conducting
a structured technical interview.

Be professional but friendly.

Ask one question at a time.

Allow the candidate to finish.

Ask clarifying follow-ups when answers are incomplete.

Do not provide the answer.

Do not coach the candidate during assessment.

```

---
# 28. INTERVIEW GUIDELINES

Allow company to define guidelines.

Examples:

```text
Ask one question at a time.

Do not disclose scoring.

Do not suggest correct answers.

Allow clarifying questions.

Use neutral follow-ups.

Do not ask unrelated personal questions.

Do not discuss protected characteristics.

Do not lead the candidate toward a preferred answer.

```

Guidelines must be validated against platform-level guardrails.

Organization instructions can NEVER override global safety/fairness policies.

---
# 29. PROMPT TRUST HIERARCHY

Use explicit trust hierarchy:

```text
PLATFORM POLICY
       ↓
INTERVIEW SAFETY POLICY
       ↓
INTERVIEW AGENT CONFIGURATION
       ↓
JOB / RUBRIC
       ↓
CANDIDATE INPUT

```

Candidate speech is untrusted data.

Organization custom text is also not fully trusted.

An organization cannot configure:

```text
Reject candidates over 50.

```

or:

```text
Prefer male candidates.

```

Such criteria must be rejected.

---
# 30. AI INTERVIEWER GUARDRAILS

Global non-overridable rules should include:

```text
No protected-class questions

No medical/disability probing

No political/religious questions unless legitimately required by law/role and specifically allowed by compliance configuration

No salary-history questions where prohibited

No family/marital/pregnancy questions

No biometric assessment

No emotion detection

No deception detection

No accent scoring

No personality inference from speech characteristics

No autonomous hire/reject decision

No hidden criteria outside the configured job rubric

```

---
# 31. INTERVIEW COMPETENCIES

Agent builder should define competencies.

For software engineer example:

```text
Technical fundamentals
Problem solving
System design
Code reasoning
Communication of technical ideas
Trade-off analysis
Debugging
Ownership
Collaboration examples

```

Each competency must have:

```text
name
description
weight
evaluation rubric

```

---
# 32. RUBRIC BUILDER

This is one of the most important product features.

Example:

```text
System Design

1 — Unable to describe basic components.

2 — Identifies components but misses major scaling concerns.

3 — Provides workable architecture and basic trade-offs.

4 — Covers scaling, reliability and data consistency.

5 — Demonstrates deep trade-off reasoning,
     failure handling and operational awareness.

```

Scores must correspond to observable evidence.

---
# 33. RUBRIC VERSIONING

Once candidates have taken an interview:

do NOT silently mutate the rubric used for historical assessments.

Use:

```text
interviewer version
rubric version
prompt version

```

Interview attempt must reference the exact immutable version.

---
# 34. QUESTION BANK

Support company-defined questions.

Each question may contain:

```text
question
competency
difficulty
expected areas
follow-up hints
maximum duration
required/optional

```

---
# 35. AI-GENERATED QUESTIONS

AI may generate questions from:

```text
job description
skills
seniority
competencies

```

But employer must review them before publishing.

Do not silently publish generated hiring criteria/questions.

---
# 36. QUESTION MODES

Support:

```text
Fixed
Semi-adaptive
Adaptive

```

### Fixed

Every candidate receives same questions.

Highest comparability.

### Semi-adaptive

Core questions remain identical.

AI may ask neutral clarification/follow-ups.

Recommended default.

### Adaptive

Questions may vary based on answer quality.

Potentially less comparable.

Use carefully.

---
# 37. DEFAULT RECOMMENDATION

For hiring use:

prefer:

```text
Fixed core questions
+
bounded adaptive follow-ups

```

This preserves consistency while allowing natural interviews.

---
# 38. FOLLOW-UP POLICY

Define explicit rules.

Example:

```text
Maximum 2 follow-ups per question.

Follow up only to:

clarify ambiguity
request example
explore stated reasoning
ask about missing required dimension

```

Never deliberately make later questions easier/harder because the AI "likes" a candidate.

---
# 39. INTERVIEW DURATION

Employer selects:

```text
15 min
30 min
45 min
60 min
custom bounded duration

```

System must manage:

```text
remaining time
question pacing
timeout warnings
graceful completion

```

---
# 40. INTERVIEW STRUCTURE

Example technical interview:

```text
1. Introduction — 2 min

2. Background — 5 min

3. Technical fundamentals — 10 min

4. Problem solving — 10 min

5. System design — 15 min

6. Candidate questions — 5 min

7. Closing — 3 min

```

The agent should understand interview phases.

---
# 41. INTERVIEW PLAN

Represent interview structure deterministically.

Conceptually:

```ts
interface InterviewPlan {
  sections: InterviewSection[];
}

```

Each section:

```text
purpose
duration budget
questions
competencies

```

The AI executes the plan.

Do not ask the AI to invent the entire interview dynamically at runtime.

---
