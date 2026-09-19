# Hiring Team Review Experience Design

## Goal
Enable authorized hiring-team members to independently review a completed candidate interview and its evidence-grounded AI assessment, record their own judgment, and preserve disagreement/audit history without turning AI output into an autonomous hiring decision.

## Product boundary
M08 consumes verified M07 assessment generations and M06 durable transcripts. Humans remain decision makers. The product may display AI scores/rationale/evidence and human overrides side by side, but must not rank candidates as “best”, infer protected/prohibited traits, hide insufficient evidence, or overwrite AI history when a human disagrees.

## Core review model
A review is tenant/job/candidate/interview-attempt scoped and references an immutable completed assessment generation. Human review state is separate from AI assessment state. Human score overrides preserve the original AI score, require an explicit reviewer-authored reason, and are append/audit friendly rather than destructive replacement.

Review status uses a small explicit lifecycle such as `awaiting_review | in_review | reviewed`. Reviewer notes and overrides are attributable to an authorized organization member. AI/human disagreement is derived from preserved AI and human values rather than being model-generated.

## Experience
### Candidate result page
Authorized hiring users can open a result page showing candidate identity, job/interview metadata, interview completion/review state, assessment summary, competency cards, strengths/concerns and evidence sufficiency. No decision-like badge is synthesized from AI scores.

### Competency and evidence cards
Each competency displays configured name, AI score or explicit insufficient evidence, rationale and validated evidence references. Evidence links navigate to the exact durable transcript turn and highlight the cited excerpt.

### Transcript viewer
Render durable turns as inert text with clear candidate/interviewer speaker separation, sequence/order and search. Technical interruption events remain separate/contextual and cannot be presented as candidate-performance evidence.

### Human review
Authorized reviewers can record a human score for a configured competency while preserving the AI score and must supply a bounded reason for an override. Reviewer notes are separate from AI rationale. Final review status is explicit and attributable.

### Job candidate dashboard
Show candidates and workflow/review states for the selected job. Sorting/filtering may use neutral workflow metadata, but no AI “best candidate” ranking or autonomous shortlist/reject behavior is introduced.

## Authorization and persistence
All reads/writes are organization/job scoped and require existing hiring-role capabilities. RLS/security-definer RPC/repository boundaries must fail closed across tenants. Review mutations validate candidate/job/attempt/assessment relationships server-side and never trust client-supplied organization authority.

## Accessibility
Result/review pages use semantic headings/landmarks, keyboard-accessible evidence navigation, visible focus, programmatic labels, status announcements for mutations, and mobile layouts without horizontal overflow. Evidence deep links must move focus to the transcript target without relying on color alone.

## Security / safety
- Render transcript, notes and model text as inert text; no unsafe HTML.
- Prevent cross-tenant/cross-job/cross-attempt evidence access.
- Preserve AI output and provenance; human override never rewrites M07 assessment history.
- Record reviewer identity/time and bounded reason for human score changes.
- No autonomous hire/reject/strong-hire or candidate-success probability.
- No protected-trait/prohibited inference in review automation.

## Iteration decomposition
1. M08.1 candidate result projection/page.
2. M08.2 competency/evidence cards.
3. M08.3 searchable transcript viewer.
4. M08.4 evidence deep links/highlighting.
5. M08.5 human score overrides with immutable AI score + reason.
6. M08.6 reviewer notes/status lifecycle.
7. M08.7 durable AI/human disagreement data.
8. M08.8 job candidate dashboard without AI ranking.
9. M08.9 visual/accessibility/browser closeout.

## Testing strategy
Use strict RED→GREEN behavioral tests for each iteration, provider-backed Supabase authorization/RLS tests for review persistence, component tests for accessible review behavior, and Playwright acceptance for independent-review flow, evidence deep links, keyboard/focus and mobile layout. Full repository CI remains the completion authority.