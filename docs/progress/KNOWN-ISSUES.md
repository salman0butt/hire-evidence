# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, CI #57 green.

M01 provider-backed authentication/profile/RLS/accessibility evidence is resolved and integrated through PR #3. Final M01 head `b8844130118453e56009284b9498c8357429f1af` passed CI #156, then squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.

## Current unresolved issues

No Critical or Important M02 implementation issue is currently known. Final whole-milestone security/accessibility/YAGNI review recorded 0 unresolved Critical and 0 unresolved Important findings.

M02 engineering closeout is complete on the reviewed implementation head. The remaining gate is procedural/evidence-only: the closeout documentation series creates a newer branch head that must pass exact-final-head CI before PR readiness is finalized, after which PR #4 must remain unmerged until explicit user authorization.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M02 execution issues

- Task 3 RED `955ea259…` intentionally failed because onboarding modules were absent; CI #167 exposed a Next.js server-action export defect; root cause fixed in `b817f49a…`, CI #168 green.
- Task 4 RED `6a47c0ee…` intentionally failed because membership/navigation modules were absent; GREEN `709993dd…`, CI #170.
- Task 5 began with migration/action RED tests at `80506379…` / `35b83c95…`; final implementation `fa7a996d…`, CI #190.
- Task 6 secure invitation lifecycle culminated at `5abee48b…`; CI #215 verified hash-at-rest token and abuse protections.
- Task 7 settings RED `8a080819…` / CI #217 failed for the intended missing production modules/export. GREEN `43b7c231…` / CI #218 passed the complete suite.
- Provider-backed tenant-isolation verification `3e0c3555…` passed CI `34608235065` / #219, including cross-tenant read/write denial, unauthenticated non-exposure, recruiter mutation denial and authorized owner settings update.
- Final responsive/keyboard browser run CI #222 failed because Playwright substring matching made the `Team` heading locator ambiguous with `Invite teammate`. Minimal exact-name locator fix `62301204…` resolved the root cause. Reviewed head `fd8907cf…` passed full CI #224 / `34610615757`, including Chromium E2E.

## Merge gate

`AUTO_MERGE=false`. PR #4 must not be merged until the user explicitly authorizes merge in chat. Do not begin M03 until PR #4 is merged under that authorization and post-merge `main` CI is green.