# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, CI #57 green.

M01 provider-backed authentication/profile/RLS/accessibility evidence is resolved and integrated through PR #3. Final M01 head `b8844130118453e56009284b9498c8357429f1af` passed CI #156, then squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.

## Current unresolved issues

No Critical or Important issue is currently known for the implemented M02.1–M02.2 slices.

M02 is not complete: organization onboarding, tenant shell/navigation, membership-management owner invariants, secure invitations, settings and real Org A/Org B/unauthenticated isolation remain planned work. Classification: **Milestone scope remaining**, not a blocker.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M02 execution issue

M02 Task 2 RED commit `6c2719c9502a4a23c59023322eeed247e362eb21` intentionally failed CI #162 at typecheck because `./rbac` and `./validation` were absent. This was expected TDD evidence, not a production regression. Minimum implementation `ed9b3d52db6674fb15bb91c366f18940544e31ae` passed full CI #163.