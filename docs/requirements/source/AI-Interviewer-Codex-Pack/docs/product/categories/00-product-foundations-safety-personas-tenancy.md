# Product Foundations, Safety, Personas & Tenancy

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 1. PRODUCT WORKING NAME

Working name:

**AI Interviewer**

This is a temporary product name.

The architecture must NOT embed the product name deeply throughout domain logic.

Future branding should be replaceable without rewriting the application.

---
# 2. PRODUCT VISION

Build a production-quality B2B SaaS platform that allows companies and hiring teams to create specialized AI interviewer agents and conduct structured realtime interviews with candidates through shareable interview links.

The core flow is:

```text
Company
   ↓
Creates organization
   ↓
Creates job / position
   ↓
Creates AI Interviewer
   ↓
Defines interview criteria and rubric
   ↓
Invites candidate
   ↓
Candidate opens secure link
   ↓
AI conducts realtime interview
   ↓
Transcript + evidence captured
   ↓
Structured assessment generated
   ↓
Hiring team reviews evidence
   ↓
Human reviewer makes hiring decision

```

The system should dramatically reduce repetitive first-round interviewing while improving:

- consistency
- structure
- documentation
- interviewer availability
- candidate scheduling flexibility
- evidence quality
- hiring-team collaboration

The AI must NOT autonomously decide whether someone should be hired.

---
# 3. PRIMARY PRODUCT PRINCIPLE

The platform is:

> An AI-powered structured interview and assessment assistant.

It is NOT:

> An autonomous hiring decision engine.

Use this hierarchy:

```text
Job-related evidence
>
Structured assessment
>
Human judgment
>
AI recommendation

```

The application must preserve meaningful human oversight.

---
# 4. CRITICAL AI EMPLOYMENT SAFETY BOUNDARY

Never build candidate scoring based on:

- race
- ethnicity
- religion
- nationality
- sex
- gender
- sexual orientation
- disability
- pregnancy
- age
- genetic information
- appearance
- face shape
- attractiveness
- skin color
- voice identity
- accent
- native/non-native accent
- emotion recognition
- inferred mood
- facial expressions
- eye contact scoring
- personality inference from voice
- "confidence" inferred from vocal characteristics
- honesty/deception detection
- health information
- political views
- union membership
- socioeconomic status

Do not infer protected or sensitive characteristics.

Do not use facial analysis for candidate assessment.

Do not perform emotion recognition for hiring.

Do not score whether somebody "sounds professional" when that can collapse into accent/style bias.

---
# 5. WHAT BEHAVIOR MAY BE ASSESSED

The system may assess **job-relevant answer behavior** when supported by actual content.

Examples:

```text
Did the candidate answer the question?

Did they explain their reasoning?

Did they provide relevant examples?

Did they structure the response clearly?

Did they identify trade-offs?

Did they ask useful clarifying questions?

Did the answer demonstrate the competency being assessed?

```

This must be based primarily on:

```text
transcript
+
question
+
rubric
+
job requirements

```

not biometric or emotional inference.

---
# 6. HUMAN-IN-THE-LOOP

AI-generated scores must be reviewable.

Each assessment dimension should provide evidence.

Example:

```text
System Design: 4 / 5

Evidence:

Candidate:
"I would start by separating ingestion from processing using a queue..."

Reason:
Demonstrated asynchronous architecture and scaling awareness.

Missing:
Did not discuss idempotency until prompted.

```

A hiring manager should be able to:

```text
Agree
Disagree
Override score
Add note

```

If overridden, preserve:

```text
AI score
Human score
Human reason

```

Never silently overwrite the original assessment.

---
# 7. PRODUCT PERSONAS

The application has several user roles.

## Platform Super Admin

Owns SaaS platform operations.

Capabilities:

- manage organizations
- inspect system health
- manage plans
- view platform usage
- manage feature flags
- investigate failures
- manage abuse
- view compliance configuration
- manage AI models/configuration
- view eval health

Must NOT casually access private candidate interviews.

Use explicit privileged support/audit flows.

---
# 8. ORGANIZATION OWNER

Usually:

- company founder
- HR director
- recruiting lead

Capabilities:

```text
Manage organization
Manage subscription
Invite team
Manage roles
Create jobs
Create AI interviewers
View candidates
View assessments
Configure retention
Manage organization settings

```

---
# 9. ORGANIZATION ADMIN / RECRUITER

Capabilities may include:

```text
Create job
Create interview
Invite candidate
View results
Add reviewer notes
Move interview status

```

Billing access may be restricted.

---
# 10. HIRING MANAGER / REVIEWER

Capabilities:

```text
View assigned positions
View candidate interviews
Read transcript
Review AI assessment
Score candidate manually
Leave notes
Approve assessment

```

Should not necessarily manage billing or organization configuration.

---
# 11. CANDIDATE

Candidates typically should NOT require a SaaS account.

They receive:

```text
secure interview invitation link

```

Candidate can:

- review interview information
- understand AI usage
- provide consent
- request accommodation information
- test microphone
- complete interview
- receive completion confirmation

Candidate should not gain access to company/private dashboards.

---
# 12. OPTIONAL CANDIDATE ACCOUNT — LATER

Do NOT require candidate accounts for MVP.

Possible later capabilities:

```text
candidate interview history
candidate-controlled profile
candidate practice mode
candidate feedback

```

This is not needed for the initial employer product.

YAGNI.

---
# 13. MULTI-TENANT ARCHITECTURE

The application is organization-first.

Core hierarchy:

```text
User
   ↓
Organization Membership
   ↓
Organization
   ├── Jobs
   ├── Interview Agents
   ├── Candidates
   ├── Interviews
   ├── Assessments
   ├── Team
   ├── Subscription
   └── Usage

```

Every organization-owned record must enforce tenant isolation.

Do NOT rely only on:

```text
WHERE organization_id = ...

```

inside application code.

Use PostgreSQL Row Level Security where appropriate.

---
# 14. ROLE-BASED ACCESS CONTROL

Suggested roles:

```text
owner
admin
recruiter
hiring_manager
reviewer

```

Keep the initial model simple.

Avoid arbitrary permission-builder complexity in V1.

Use explicit capabilities.

Example:

```text
owner:
everything

admin:
organization operations except ownership transfer

recruiter:
jobs + interviews + candidates

hiring_manager:
assigned jobs + candidate assessment

reviewer:
assigned interview results

```

---
