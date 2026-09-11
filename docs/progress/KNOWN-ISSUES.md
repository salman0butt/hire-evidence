# Known Issues

Only unresolved or materially relevant issues belong here.

## Current unresolved issues

No Critical or Important implementation issue is currently known in the verified M03.1 Jobs + Requirements slice. Milestone-wide review is not complete because M03.2–M03.11 remain unimplemented.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M03 execution issues

- Important deterministic-ordering finding: `job_requirements` initially constrained `unique (job_id, kind, position)`, which permitted duplicate positions across requirement kinds. RED `268afaaca87e3bf3dffa0a552a66e1dfab1f2ca9` / CI #272 (`34642095960`) failed only the new migration assertion after 160 unrelated tests passed. GREEN `5db7708f1aecc5122b4a4883f7875b9e02df3fe5` / CI #273 (`34642360290`) changed the authoritative invariant to `unique (job_id, position)` and passed the full repository quality gate.

## Previously resolved milestone issues

Product Foundation, SaaS Shell + Auth, and Organizations + RBAC are integrated on `main`. M02 PR #4 squash-merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 / `34624252208` passed.

## Merge gate

PR #5 remains OPEN / DRAFT. User-authorized autonomous merge applies only when the complete M03 milestone satisfies every acceptance, review, durable-documentation, exact-final-head CI, concurrency, safety and repository-policy gate. M03.2–M03.11 are incomplete, so merge is currently prohibited by the milestone-completion gates.
