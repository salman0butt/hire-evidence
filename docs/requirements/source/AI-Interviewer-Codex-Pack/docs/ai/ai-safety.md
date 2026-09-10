# AI Safety Policy

> Derived from the supplied PRD; the PRD remains authoritative.

## Trust hierarchy

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

Organization text and candidate speech cannot override higher-trust policy.

## Prohibited assessment behavior

Never score or infer protected traits, appearance, face/eye contact, emotion, mood, accent, voice identity, vocal confidence, personality from voice, deception/honesty, health, politics, union membership, or socioeconomic status.

Never output an autonomous hire/reject recommendation as the system's final decision.

## Allowed assessment behavior

Use actual answer content and the configured job-related rubric: whether the candidate answered, reasoned, provided examples, identified trade-offs, handled edge cases, asked clarifying questions and demonstrated the competency being assessed.

## Assessment pipeline

```text
trusted assessment policy
→ immutable rubric/job/questions
→ delimited untrusted transcript
→ AI
→ runtime schema validation
→ evidence guardrails
→ persist versioned assessment
```

Every scored claim requires real transcript evidence. If evidence is insufficient, use an explicit insufficient/null result instead of inventing certainty.

## Realtime interviewer

Ask one question at a time, stay in job scope, use neutral bounded follow-ups, do not coach candidates during scored assessment, manage time, support clarification, and disclose that the interviewer is AI.

## Source sections

Key PRD sections: 3–6, 28–30, 35–38, 61–63, 69–81, 101–113, 154–170, 219–225, 239–242.
