# AI Platform, Models, Prompts & Observability

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 154. AI MODEL STRATEGY

Realtime interviewer:

optimize for:

```text
low latency
turn-taking
voice quality
stability

```

Offline assessment:

optimize for:

```text
rubric accuracy
structured output
evidence grounding

```

Do not assume same model/config is best for both.

---
# 155. PROVIDER BOUNDARY

Realtime can remain provider-specific.

Offline assessment should have a narrow testable boundary where beneficial.

Do not create:

```text
UniversalAIProviderEnterpriseFactory

```

YAGNI.

---
# 156. AI PROMPT ORGANIZATION

Potential:

```text
lib/ai/interviewer/
lib/ai/assessment/
lib/ai/guardrails/

```

Prompts should be versioned in code.

---
# 157. STRUCTURED OUTPUT VALIDATION

Every assessment response:

```text
AI
↓
unknown
↓
schema validation
↓
evidence guardrails
↓
trusted application object

```

Never:

```ts
response as InterviewAssessment

```

without runtime validation.

---
# 158. AI RETRIES

Use bounded retries.

Do not retry indefinitely.

Assessment failure must not invalidate completed interview.

Allow recruiter to regenerate assessment where safe.

---
# 159. IDEMPOTENT ASSESSMENT GENERATION

Prevent:

```text
same attempt
→ multiple concurrent assessment rows

```

Use atomic claim/state.

Example:

```text
pending
processing
completed
failed

```

---
# 160. ASSESSMENT REGENERATION

If regenerated after model/prompt change:

preserve prior assessment version or explicit history.

Do not silently replace data used by reviewers.

---
# 161. AI EVAL TIERS

## Tier 1 — Every PR

```text
schema tests
guardrail tests
deterministic fixtures
prompt version checks

```

## Tier 2 — AI-changing PR

```text
small live-model eval
pairwise regression

```

## Tier 3 — Scheduled

```text
larger candidate dataset
fairness paired tests
adversarial tests
multilingual tests

```

## Tier 4 — Release

```text
human calibration
red team

```

---
# 162. GOLDEN INTERVIEW DATASET

Repository:

```text
evals/interviews/

```

Cases should include:

```text
excellent technical answer
partially correct answer
incorrect answer
verbose off-topic answer
short correct answer
candidate asks clarification
prompt injection
non-native but technically excellent answer
technical interruption

```

---
# 163. GOLDEN ASSESSMENT DATASET

Human-curated expected rubric properties.

Avoid exact free-text matching.

Evaluate:

```text
correct competency
score range
evidence source
unsupported claims

```

---
# 164. HUMAN CALIBRATION

Before high-scale deployment:

compare AI assessment with multiple human reviewers on controlled dataset.

Measure:

```text
agreement
systematic score differences
false negative evidence
false positive evidence

```

---
# 165. FAIRNESS MONITORING

Do not train/use protected traits for normal candidate scoring.

Fairness audit work may require specially controlled datasets.

Keep compliance/audit datasets separate with proper governance.

---
# 166. NO CANDIDATE "PERSONALITY SCORE"

Do not create:

```text
Leadership personality: 92%
Confidence: 84%
Honesty: 76%
Culture fit: 91%

```

These are not appropriate product outputs.

---
# 167. EXPLAINABLE OUTPUT

Preferred:

```text
Competency
Score
Rubric definition
Evidence
Missing evidence
Reviewer override

```

This is far more useful and defensible.

---
# 168. ANALYTICS FOR AI QUALITY

Track aggregate:

```text
interview connection success
completion rate
assessment generation success
schema failure
guardrail discard rate
human override rate
rubric coverage

```

---
# 169. COST OBSERVABILITY

Track:

```text
realtime cost per interview
assessment generation cost
AI preview cost
cost per organization

```

Do not optimize without measurement.

---
# 170. CONTEXT BUDGET

Assessment prompt should use:

```text
relevant job config
rubric
bounded transcript

```

For long interviews:

use careful transcript/context strategy.

Do not truncate blindly and lose later answers.

Possible future:

```text
section-wise assessment
+
final aggregation

```

Only if context length requires it.

---
