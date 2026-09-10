# Data Model, Security, Privacy, Operations & Candidate Experience

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 124. DATA MODEL — CONCEPTUAL

Likely tables:

```text
profiles

organizations
organization_members
organization_invitations

jobs

interview_agents
interview_agent_versions
interview_sections
interview_questions
competencies
rubrics

candidates
interview_invitations
interview_attempts
interview_messages

interview_assessments
competency_assessments
assessment_evidence
human_reviews

subscriptions
usage_periods / usage_events

audit_events
consent_events

```

This is conceptual.

Normalize based on actual design.

Do not create one table for every bullet mechanically.

---
# 125. ORGANIZATION OWNERSHIP

Most business records should have explicit organization ownership.

Composite foreign keys may be useful to prevent cross-tenant references.

Example problem to prevent:

```text
candidate from Org A
linked to
job from Org B

```

Database should reject this where feasible.

---
# 126. RLS

RLS mandatory for tenant-owned information.

Test with at least:

```text
Organization A user
Organization B user
candidate token

```

Ensure no cross-tenant access.

---
# 127. CANDIDATE TOKEN ACCESS

Candidate interview link should use a narrowly scoped server flow.

Candidate should NOT receive an organization member Supabase session.

The token grants only what is necessary for that interview.

---
# 128. TOKEN STORAGE

Prefer storing:

```text
hash(token)

```

rather than raw invitation token where practical.

Comparable to password-reset token architecture.

---
# 129. CANDIDATE LINK SECURITY

Protect against:

```text
token enumeration
replay
expired tokens
revoked tokens
completed token reuse

```

---
# 130. PRIVACY

Collect minimum necessary data.

Candidate transcript is sensitive employment-related data.

Protect:

```text
candidate identity
transcript
assessment
review notes

```

---
# 131. RETENTION POLICY

Organization should have configurable retention eventually.

Initial platform should at least define:

```text
default retention period
deletion behavior

```

Do not keep candidate interviews indefinitely without explicit policy.

---
# 132. CANDIDATE DELETION

Support data deletion workflow.

Deleting an interview must consider:

```text
transcript
assessment
audio if any
AI traces
derived evidence

```

Audit requirements may require careful policy.

Do not implement naive partial deletion.

---
# 133. EXPORT

Later or Business plan:

```text
candidate assessment PDF
structured CSV export

```

MVP can support:

```text
print-friendly assessment

```

---
# 134. ATS INTEGRATIONS — LATER

Potential:

```text
Greenhouse
Lever
Ashby
Workable
BambooHR

```

Do not build before core product.

Architecture should expose clean integration boundaries later.

---
# 135. WEBHOOKS / API — LATER

Business customers may need:

```text
interview.completed
assessment.ready
candidate.updated

```

Future milestone.

---
# 136. EMAIL

Need transactional email.

Events:

```text
team invitation
candidate invitation
candidate reminder
interview completion notification
assessment ready

```

Use reliable provider.

Do not implement a generic marketing-email system.

---
# 137. CANDIDATE REMINDERS

Future:

```text
24h before expiry

```

Avoid building scheduler before interview core.

---
# 138. ORGANIZATION BRANDING

Growth/Business feature:

```text
company logo
company name
brand accent
candidate welcome text

```

Do not allow organization CSS injection.

---
# 139. INTERVIEW LANGUAGE

Allow configured interview language.

Assessment should know intended language.

Do not penalize non-native accent.

Language proficiency should only be assessed when explicitly job-related and configured.

---
# 140. MULTILINGUAL INTERVIEWS

Later support.

Important:

rubric quality must be evaluated per supported language.

Do not claim multilingual parity without evals.

---
# 141. CANDIDATE FEEDBACK

By default:

assessment is company-private.

Optional organization setting later:

```text
send candidate feedback

```

Candidate-facing feedback should be separate from internal hiring assessment.

Do not accidentally expose recruiter notes.

---
# 142. CANDIDATE EXPERIENCE QUALITY

The candidate should feel:

```text
respected
informed
not rushed unfairly
technically supported
aware they are speaking with AI

```

Never pretend AI is a human interviewer.

---
# 143. AI DISCLOSURE

Clearly show:

```text
This interview is conducted by an AI interviewer.

```

Do not deceptively imitate a human employee.

---
# 144. CANDIDATE FAQ

Explain:

```text
What will happen?
How long?
Is it recorded?
How will my answers be used?
Can I request accommodation?
Who sees the result?

```

---
# 145. INTERRUPTION / TECHNICAL SUPPORT

Candidate can:

```text
report technical problem

```

Interview attempt may be marked:

```text
technical_issue

```

Recruiter can issue replacement invitation.

---
# 146. ADMIN DASHBOARD

Organization dashboard:

```text
Active jobs
Interviewers
Candidates
Completed interviews
Awaiting review
Recent activity
Usage

```

---
# 147. JOB PIPELINE

Do not initially become a full ATS.

Limit pipeline to interview workflow.

Example:

```text
Invited
In progress
Completed
Reviewed

```

Hiring decision tracking can remain minimal.

---
# 148. SUPER ADMIN

Platform admin can inspect:

```text
organization status
subscriptions
usage
AI failures
system health
abuse

```

Use audited support access.

---
# 149. SUPPORT IMPERSONATION

Avoid unrestricted:

```text
Login as customer

```

If later added:

require:

```text
reason
audit event
time limit

```

---
# 150. SECURITY

Audit for:

```text
tenant IDOR
candidate token leakage
Stripe ownership
prompt injection
stored XSS in transcript
unsafe Markdown
webhook forgery
CSRF
open redirects
secret exposure
logging candidate data

```

---
# 151. TRANSCRIPT RENDERING SECURITY

Candidate might speak:

```html
<script>...</script>

```

or Markdown.

Render transcript safely.

Treat transcript as plain text by default.

---
# 152. RATE LIMITING

Protect:

```text
candidate invitation lookup
interview token creation
realtime session authorization
assessment generation
AI agent preview

```

---
# 153. ABUSE CONTROL

Organizations should not use interviewer to create unrelated harmful AI bots.

Agent configuration remains constrained to interview domain.

---
