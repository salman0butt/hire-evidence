# Local Realtime Provider Acceptance

This checklist is the explicit local/deployment smoke test for the Gemini-backed realtime interview path. It is **not** required for deterministic repository CI and must never be represented as executed unless it was actually run with a real server-side provider credential.

## Purpose

Repository CI verifies authorization, provider isolation, production browser composition, deterministic multi-turn orchestration, barge-in, timeout/error handling, same-attempt reconnect, accessibility, mobile layout, invitation safety, and fail-closed behavior without requiring long-lived provider credentials.

The live-provider smoke exists to validate the external Gemini Live service and deployment configuration in the environment where the owner supplies real credentials.

## Required environment

- Use a controlled local or deployment environment.
- Set `GEMINI_API_KEY` **server-side only**.
- Never place the long-lived provider key in browser code, public environment variables, logs, screenshots, fixtures, or committed files.
- Use a valid invitation whose consent and published interviewer version are current.

## Live smoke checklist

1. Start the application and its required local services using the repository setup instructions.
2. Open a valid candidate invitation and complete the technical readiness checks.
3. Start the realtime interview and confirm the browser receives only the constrained short-lived session credential after server authorization.
4. Complete multiple interview turns and confirm the visible current question follows the immutable server-authorized plan.
5. Speak while interviewer audio is playing and confirm obsolete playback stops (barge-in).
6. Exercise mute/unmute and end controls and confirm their state remains accessible and candidate-controlled.
7. Briefly interrupt connectivity once, restore it, and confirm recovery remains on the same authoritative attempt without resetting completed progress or follow-up budgets.
8. Confirm timeout/provider-error presentation is neutral and does not create negative candidate evidence.
9. Confirm revoked, expired, completed, or otherwise unavailable invitations fail safely without exposing provider configuration or raw capability data.
10. Confirm keyboard operation, status announcements, and mobile layout remain usable in the live path.

## Evidence recording

If this smoke is run, record only non-secret evidence: environment name, date, application commit SHA, pass/fail per scenario, and sanitized observations. Never record `GEMINI_API_KEY`, raw invitation tokens, short-lived provider credentials, candidate speech, or other sensitive values in repository documentation.

## Milestone policy

As of 2026-09-14, the repository owner explicitly chose to supply real Gemini credentials locally and authorized repository-side M05 completion without blocking merge on an external live-provider smoke. Therefore:

- deterministic exact-head CI remains the repository merge gate;
- the live Gemini smoke is a deployment/local acceptance check, not fabricated CI evidence;
- a failed future live smoke is a real defect and must be fixed before relying on that deployment for candidate interviews;
- safety, privacy, capability authorization, evidence-integrity, and human-review boundaries remain mandatory.
