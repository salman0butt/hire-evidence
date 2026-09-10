# Candidates, Invitations & Pre-Interview Flow

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 42. CANDIDATE CREATION

Recruiter can create candidate manually.

Fields:

```text
name
email
job
optional external applicant ID

```

Collect only necessary candidate data.

---
# 43. BULK CANDIDATE INVITES — LATER

Possible:

```text
CSV upload
ATS import

```

Not required for MVP.

---
# 44. INTERVIEW INVITATION

Recruiter creates invitation.

Generate:

```text
secure random token

```

Invitation properties:

```text
candidate
interview agent/version
job
expiry
status
maximum attempts
created by

```

---
# 45. SHAREABLE LINK

Example:

```text
/interview/{opaque-secure-token}

```

Do NOT expose sequential:

```text
/interview/1234

```

Tokens must be:

```text
unguessable
revocable
expiring

```

---
# 46. INVITATION STATES

Use explicit state model:

```text
draft
sent
opened
started
completed
expired
revoked

```

Potential:

```text
abandoned

```

as derived status where useful.

---
# 47. CANDIDATE PRE-INTERVIEW PAGE

Candidate sees:

```text
Company name
Role
Approximate duration
Interview format
AI disclosure
Recording/transcript disclosure
Privacy information
Accommodation information
Technical requirements
Start button

```

Do not surprise candidate after starting.

---
# 48. CANDIDATE CONSENT

Before interview:

require explicit acknowledgement of:

```text
AI interviewer use
transcription
data processing
retention policy

```

If audio recording is enabled:

separate explicit disclosure/consent.

Store consent event.

---
# 49. ACCOMMODATIONS

Provide:

```text
Need an accommodation?
Contact ...

```

or configurable employer workflow.

Platform should support alternative interview process when needed.

Do not make microphone-only interviewing the only possible path for all candidates.

---
# 50. MICROPHONE DIAGNOSTICS

Before interview:

```text
browser compatibility
microphone permission
input device
audio level
network readiness

```

Reuse architectural ideas from Talk Tutor.

Candidate should be able to verify:

```text
We can hear you.

```

before interview timer starts.

---
# 51. DEVICE COMPATIBILITY

Use feature detection.

Check:

```text
mediaDevices
getUserMedia
AudioContext
AudioWorklet
required Web APIs

```

Provide clear compatibility messages.

---
# 52. INTERVIEW START

Only start authoritative interview when:

```text
invitation valid
candidate confirmed
consent accepted
technical check passed
server authorization succeeds

```

Create durable attempt.

---
# 53. INTERVIEW ATTEMPT

One invitation may potentially permit:

```text
one
or
configured number of attempts

```

Default:

```text
one completed attempt

```

Handle failed technical starts separately.

Do not consume attempt for pre-session infrastructure failure.

---
