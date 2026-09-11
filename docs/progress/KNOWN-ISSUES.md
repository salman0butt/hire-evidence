# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, CI #57 green.

M01 provider-backed authentication/profile/RLS/accessibility evidence is resolved and integrated through PR #3. Final M01 head `b8844130118453e56009284b9498c8357429f1af` passed CI #156, then squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.

## Current unresolved issues

No Critical or Important issue is currently known for implemented M02.1–M02.7 or the real provider-backed Org A/Org B/unauthenticated isolation matrix.

M02 is not complete: final desktop + 390×844 responsive/keyboard browser verification for tenant navigation, team, invitation and settings surfaces, whole-milestone skeptical review, final durable reconciliation, and exact-final-head CI remain. Classification: **Milestone closeout remaining**, not an external blocker.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M02 execution issues

- Task 3 RED `955ea259…` intentionally failed because onboarding modules were absent; CI #167 exposed a Next.js server-action export defect; root cause fixed in `b817f49a…`, CI #168 green.
- Task 4 RED `6a47c0ee…` intentionally failed because membership/navigation modules were absent; GREEN `709993dd…`, CI #170.
- Task 5 began with migration/action RED tests at `80506379…` / `35b83c95…`; final implementation `fa7a996d…`, CI #190.
- Task 6 secure invitation lifecycle culminated at `5abee48b…`; CI #215 verified hash-at-rest token and abuse protections.
- Task 7 settings RED `8a080819…` / CI #217 failed for the intended missing production modules/export. GREEN `43b7c231…` / CI #218 passed the complete suite.
- Provider-backed tenant-isolation verification `3e0c3555…` passed CI `34608235065` / #219, including cross-tenant read/write denial, unauthenticated non-exposure, recruiter mutation denial and authorized owner settings update.
