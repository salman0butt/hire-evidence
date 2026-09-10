# SaaS Experience, Authentication, Organizations & Jobs

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 15. SAAS HOMEPAGE

Build a premium B2B SaaS landing page.

The page should clearly communicate:

> Create structured AI interviews once. Interview candidates anytime.

Potential sections:

```text
Hero

How it works

AI interviewer builder

Structured candidate assessment

Evidence-linked scoring

Realtime interview experience

Team collaboration

Security & fairness

Integrations

Pricing

FAQ

CTA

```

Do NOT make it look like generic HR software.

---
# 16. HERO POSITIONING

Example direction:

```text
Scale interviews without sacrificing structure.

Create AI interviewers tailored to your roles.
Share a link.
Review evidence-backed candidate assessments.

```

CTA:

```text
Create your first interviewer

```

Secondary CTA:

```text
Watch demo

```

---
# 17. AUTHENTICATION

Use Supabase Auth.

Support:

```text
email/password
email verification
login
logout
forgot password
reset password
secure session cookies

```

Optional later:

```text
Google Workspace
Microsoft
SSO/SAML

```

Do not block initial milestone on enterprise SSO.

---
# 18. ORGANIZATION ONBOARDING

After signup:

```text
Create organization
↓
Organization name
↓
Company size
↓
Hiring use case
↓
Create first job
↓
Create first interviewer

```

Do not ask unnecessary marketing questions.

---
# 19. TEAM INVITATIONS

Organization owner/admin can invite team members.

Invitation should include:

```text
organization
role
expiry
inviter

```

Use secure token handling.

Invitation links should expire.

Do not put raw database identifiers into insecure links.

---
# 20. JOB / POSITION MODEL

The company first creates a position.

Example:

```text
Senior Full Stack Engineer

Department:
Engineering

Location:
Remote

Employment type:
Full-time

Seniority:
Senior

```

Fields may include:

```text
title
department
description
responsibilities
required skills
preferred skills
seniority
employment type
location
salary range optional
interview instructions

```

---
# 21. JOB DESCRIPTION IMPORT

Support:

```text
paste job description

```

Later:

```text
upload DOCX/PDF
import from ATS

```

For MVP, pasted content is enough.

AI may help extract structured information.

But user must review extracted criteria.

Do not automatically make hiring criteria authoritative solely from AI extraction.

---
# 22. JOB REQUIREMENTS

Separate:

```text
Must-have
Nice-to-have

```

Example:

```text
Must:
React
TypeScript
Node.js
System design

Preferred:
AWS
Kubernetes
LLM applications

```

Interview agent should use these when appropriate.

---
