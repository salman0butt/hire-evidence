# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### Runtime provider configuration / local live smoke

Classification: **Deployment configuration and acceptance requirement; not an M08 repository blocker**.

Provider-backed realtime sessions require server-side `GEMINI_API_KEY`. The real Gemini browser smoke remains documented in `docs/LOCAL-REALTIME-ACCEPTANCE.md` as local/deployment acceptance and has not been executed by repository CI. It must never be described as executed evidence. This does not weaken any repository merge gate.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI may report Node runtime/dependency deprecation notices from third-party actions or packages. Address them through normal maintenance without weakening repository quality gates.

## M08 review blockers

No unresolved Critical or Important finding is known for M08.1 after provider-backed scope-test hardening at `f36b520eacee26069ee7da8047bbae50ebe1f727`, CI #930 / run `35206818423` GREEN. PR #10 had zero unresolved inline review threads at latest recovery.

M08.2 and later work are incomplete capability work, not defects being hidden as resolved issues. They remain tracked in the M08 ledger/status/plan.

## Merge gate

PR #10 must remain draft/unmerged until the entire M08 milestone is genuinely complete: all M08.1–M08.9 acceptance work verified, no unresolved Critical/Important findings or blocking review threads, durable docs/traceability current, exact-final-head required CI GREEN, remote head stable/concurrency safe, and GitHub mergeability/policy satisfied. The user has authorized autonomous milestone merge only when every gate is satisfied.
