# Significant Decisions

Record only decisions that future workers need to understand. Trivial coding choices do not belong here.

## D-001 — Incremental autonomous-framework overlay

**Status:** Accepted

**Context:** The repository already had product-specific milestone/safety/architecture governance when the long-project autonomous framework was upgraded.

**Alternatives considered:** replace the existing governance tree; build a separate generic orchestration project first; incrementally overlay missing durable control-plane files.

**Decision:** Use an incremental overlay. Preserve existing product-specific docs and add canonical autonomy/recovery/progress/traceability files around them.

**Reasoning:** Lowest migration risk, preserves strong product-specific safety rules, avoids duplicate systems, and supports immediate fresh-session recovery.

**Consequences:** `docs/milestones/CURRENT.md` remains useful for active milestone detail while `docs/progress/STATUS.md` becomes the compact global recovery index. Stale documentation never outranks actual Git/code/current CI.

## D-002 — Single application architecture until requirements justify decomposition

**Status:** Accepted

**Context:** Later PRD capabilities include realtime, AI assessment, billing, and enterprise concerns, but the current product foundation is small.

**Decision:** Keep a single Next.js application boundary initially. Add database/realtime/billing/worker boundaries only when the active PRD milestone requires them.

**Reasoning:** KISS/YAGNI and lower operational complexity while retaining logical subsystem boundaries in design documentation.

**Consequences:** No speculative microservices, CQRS, event sourcing, Kafka, generic workflow engine, RAG/vector DB, or generic agent framework.

## D-003 — Human hiring decision boundary

**Status:** Accepted / Non-negotiable

**Context:** AI is used to assist interviewing and evidence-based assessment in a high-impact employment domain.

**Decision:** AI may structure and assess evidence within policy, but humans make hiring decisions. Do not implement autonomous hire/reject decisions or prohibited sensitive/proxy scoring described in `AGENTS.md`.

**Consequences:** Product designs, prompts, schemas, evals, and review UI must preserve human oversight and evidence provenance.

## D-004 — Default PR merge policy is manual authorization

**Status:** Accepted

**Decision:** Autonomous workers may create/update branches, commits, and PRs, but must not merge unless the owner or repository instructions explicitly authorize it.

**Consequences:** Draft/open PRs are durable integration boundaries and can survive across fresh sessions without accidental irreversible integration.
