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

No unresolved Critical or Important finding is known through M08.4. Exact behavioral head `d0ed14671c214e5a2e38351147bc6dc54b068f29` passed CI #970 / run `35444823271`. M08.4 skeptical review found arbitrary non-evidence transcript fragments could activate focus/highlight; genuine RED `ca7c1247…` / CI #968 proved the issue and final GREEN #970 fixed it by requiring the target sequence to exist in server-validated evidence citations. CI #969 is recorded as NOT GREEN because the search-takeover test fixture omitted the new validated-citation precondition.

M08.5 and later work remain incomplete capability work, not hidden resolved defects.

## Merge gate

PR #10 must remain draft/unmerged until the entire M08 milestone is genuinely complete: all M08.1–M08.9 acceptance work verified, no unresolved Critical/Important findings or blocking review threads, durable docs/traceability current, exact-final-head required CI GREEN, remote head stable/concurrency safe, and GitHub mergeability/policy satisfied. The user has authorized autonomous milestone merge only when every gate is satisfied.
