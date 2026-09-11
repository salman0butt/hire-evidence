# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, CI #57 green.

M01 provider-backed authentication/profile/RLS/accessibility evidence is resolved and integrated through PR #3. Final M01 head `b8844130118453e56009284b9498c8357429f1af` passed CI #156, then squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.

## Current unresolved issues

No Critical or Important issue is currently known for the implemented M02.1–M02.4 slices.

M02 is not complete: membership-management owner invariants, secure invitations, settings and real Org A/Org B/unauthenticated read/write isolation remain planned work. Classification: **Milestone scope remaining**, not a blocker.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M02 execution issues

- Task 3 RED `955ea25927e0fa5ee2195f319d3d036be956c8b0` intentionally failed CI #165 because onboarding production modules were absent. CI #167 then exposed a real Next.js production-build error: a `"use server"` module re-exported the non-function idle state object. Root cause was fixed in `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484`; exact-head CI #168 passed all gates.
- Task 4 RED `6a47c0ee42f2a95fe8bdc2a8e07024db7bf9f09f` intentionally failed CI #169 because membership/navigation production modules were absent. GREEN `709993dd37fe60cb8db7647c9c8251b6011fc977` passed full CI #170.
