# M07 — Evidence-Based Assessment Engine

## Authoritative PRD milestone definition

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

## Default iteration decomposition

- **M07.1 — Assessment domain/schema:** runtime-validatable structures and states.
- **M07.2 — Trusted prompt composition:** immutable rubric/job/questions + delimited transcript.
- **M07.3 — Competency scoring:** rubric-aligned 1–5/null behavior.
- **M07.4 — Evidence citations:** candidate message sequences/excerpts.
- **M07.5 — Evidence validator:** sequence/speaker/excerpt existence and fabricated-citation rejection.
- **M07.6 — Evidence sufficiency + question coverage:** insufficient/partial/sufficient and asked/answered/skipped.
- **M07.7 — Prompt-injection defense:** transcript treated strictly as data.
- **M07.8 — Provenance:** model/prompt/rubric/interviewer/guardrail version capture.
- **M07.9 — Idempotent generation:** pending/processing/completed/failed atomic claim.
- **M07.10 — Regeneration/history:** preserve prior assessment versions.
- **M07.11 — Golden fixtures:** deterministic and model-based assessment test cases.

## Required workflow per iteration

1. Recover repository/PR/CI/review state.
2. Confirm iteration acceptance criteria and dependencies.
3. Write/update design and plan where needed.
4. Use TDD/characterization tests.
5. Implement the smallest coherent capability.
6. Run focused tests, then broader verification.
7. Review from relevant P0/specialist lenses and fix findings.
8. Re-run fresh verification.
9. Commit/push coherently and update `CURRENT.md`.

## Milestone completion gate

Do not mark COMPLETE until the PRD exit condition above is met and final implementation, tests, review, CI, documentation and fresh verification all pass.
