# AI Evaluation Strategy

> Derived implementation guide; see the authoritative PRD for complete requirements.

## Eval areas

- interviewer behavior: question adherence, one-at-a-time, neutral follow-ups, no coaching, topic adherence, time awareness
- assessment quality: schema validity, rubric adherence, evidence grounding, unsupported positive/negative claims, score consistency
- adversarial: candidate prompt injection, rubric extraction, easier-question requests, transcript instructions to future evaluator
- organization prompt injection: discriminatory/prohibited custom instructions
- fairness: paired synthetic cases with equivalent job-related content and irrelevant personal-detail differences
- realtime: connection, turns, interruption, reconnect, transcript completeness

## Golden datasets

Maintain controlled interview and assessment fixtures across strong/average/weak/off-topic/short/prompt-injection cases. Compare prompt/model updates against the production baseline.

## Evidence metrics

Prefer evidence sufficiency, question coverage, grounding pass rate and unsupported-claim rate over model self-reported confidence.

## Production quality signals

Track schema failure, grounding failure, model error, realtime disconnect, prompt version, human score override and AI/human disagreement. Avoid unnecessary sensitive transcript content in external telemetry.

## CI

Deterministic guardrails/evals should gate CI where stable. Live-model evals should be explicit, bounded and version-aware.

## Source sections

Key PRD sections: 76–78, 89, 101–113, 157–169, 172–175, 205, 217, 227–229.
