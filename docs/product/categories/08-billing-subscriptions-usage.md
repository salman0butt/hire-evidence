# Billing, Subscriptions & Usage

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 114. SAAS BILLING MODEL

Primary payer:

```text
Organization

```

Not candidate.

---
# 115. SUBSCRIPTION MODEL

Possible initial tiers:

```text
Starter
Growth
Business

```

Plans may include:

```text
monthly interview minutes
team seats
active interviewer agents
retention
analytics

```

Keep initial pricing understandable.

---
# 116. RECOMMENDED BILLING UNIT

Because realtime AI drives cost:

store usage in:

```text
interview seconds

```

Display:

```text
interview minutes

```

Plan includes monthly interview-minute allowance.

---
# 117. USAGE COUNTING

Count only meaningful candidate interview runtime.

Do not charge organization for:

```text
dashboard browsing
interviewer editing
pre-interview diagnostics
failed connection setup
preview unless intentionally billable

```

Define exact policy.

---
# 118. BILLING ACCOUNTING

Reuse lessons from Talk Tutor:

```text
server-authoritative usage

idempotent finalization

period-based usage

no client-authoritative duration

```

---
# 119. STRIPE

Implement:

```text
Stripe Checkout
Stripe Customer
Subscriptions
Webhook synchronization
Billing Portal
Cancellation
Plan change

```

Organization owns Stripe customer.

Not individual members.

---
# 120. BILLING AUTHORIZATION

Only appropriate organization roles can:

```text
start checkout
open billing portal
change subscription

```

Candidate can NEVER access billing.

---
# 121. USAGE METER

Organization dashboard:

```text
1,240 / 2,000 interview minutes

760 minutes remaining

Renews Oct 1

```

Use real server-side data.

---
# 122. PLAN LIMITS

Possible:

```text
interview minutes
team members
active jobs
active interviewers
candidate retention

```

Do not introduce 20 plan dimensions initially.

---
# 123. FREE TRIAL

Recommended:

```text
limited free trial

```

Example:

```text
60 interview minutes

```

or a time-limited trial.

Actual number should be decided through pricing work later.

Do not hard-code until business decision.

---
