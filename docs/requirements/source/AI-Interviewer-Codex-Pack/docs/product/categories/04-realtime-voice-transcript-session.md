# Realtime Voice, Transcript & Session Lifecycle

> Derived navigation file. The authoritative source is `../PRD.md`. Numbered section bodies below are copied verbatim from the supplied PRD.

# 54. REALTIME VOICE ARCHITECTURE

Use lessons from Talk Tutor's stabilized live architecture.

Conceptual flow:

```text
Candidate microphone
        ↓
Web Audio capture
        ↓
Realtime AI transport
        ↓
AI interviewer
        ↓
audio response
        ↓
Candidate

```

Parallel event flow:

```text
Provider events
      ↓
normalization
      ↓
transcript state
      ↓
finalized turns
      ↓
persistent interview transcript

```

---
# 55. DO NOT COPY TALK TUTOR BLINDLY

Reuse patterns.

Do not copy domain logic.

For example:

Talk Tutor:

```text
learner
practice
grammar correction
vocabulary

```

AI Interviewer:

```text
candidate
interview
competency
evidence
assessment

```

The systems have different semantics.

---
# 56. TRANSCRIPT MODEL

Store structured finalized turns.

Conceptual:

```ts
interface InterviewMessage {
  id: string;
  sequence: number;
  speaker: "interviewer" | "candidate";
  text: string;
  startedAt?: string;
  completedAt?: string;
}

```

Streaming partial text can remain UI-only.

Persist finalized transcript.

---
# 57. TRANSCRIPT CORRECTNESS

Guarantee:

```text
no duplication
speaker correctness
chronological order
reconnect isolation
finalized turn immutability

```

Use provider event normalization.

---
# 58. TRANSCRIPT EVIDENCE

Assessments must reference transcript evidence.

Example:

```ts
interface AssessmentEvidence {
  messageSequence: number;
  excerpt: string;
}

```

Never persist:

```text
Candidate has strong architecture knowledge

```

without supporting evidence when the claim is scored.

---
# 59. OPTIONAL AUDIO RECORDING

Do NOT require audio recording for MVP.

Transcription may be sufficient.

If later supporting recording:

```text
organization policy
candidate disclosure
consent
retention
encryption
deletion
access control

```

must be implemented.

Audio should NOT be used for emotion/personality/accent scoring.

---
# 60. VIDEO — NOT MVP

Video interviewing may be considered later.

Do not block MVP on video.

If video is eventually supported:

video is primarily communication/recording infrastructure.

Never use:

```text
face recognition
emotion recognition
appearance scoring
eye-contact scoring
facial personality inference

```

for assessment.

---
# 61. INTERVIEWER BEHAVIOR

AI interviewer must:

```text
Introduce itself

Explain interview structure briefly

Ask one question at a time

Allow answer completion

Avoid constant interruptions

Use neutral follow-ups

Stay within job-related topics

Follow interview plan

Manage time

Allow candidate questions

Close professionally

```

---
# 62. AI MUST NOT COACH DURING ASSESSMENT

During scored interview:

avoid:

```text
"You're almost there."

"Think about caching."

"Maybe consider a queue."

```

unless employer explicitly created a non-evaluative practice interview.

Hiring assessment mode should not leak answers.

---
# 63. CANDIDATE CLARIFICATIONS

Candidate may ask:

```text
"Can you repeat the question?"

"Can you clarify what you mean by scale?"

```

AI should respond neutrally.

Track clarification if useful.

Do not penalize reasonable clarification automatically.

---
# 64. BARGE-IN / INTERRUPTION

Realtime interviewer should gracefully support:

```text
candidate interrupts interviewer
AI stops speaking
candidate response continues
transcript remains correct

```

Reuse proven Talk Tutor playback interruption patterns.

---
# 65. CONNECTION RECOVERY

Handle:

```text
network drop
provider disconnect
microphone issue
temporary browser failure
token/session expiration

```

Interview should not simply disappear.

Persist completed turns continuously.

---
# 66. RECONNECT POLICY

If connection fails:

```text
pause interview timing if appropriate
preserve state
allow bounded reconnect
continue same interview attempt

```

Record technical interruption metadata.

Do NOT reduce candidate score because platform connection failed.

---
# 67. TECHNICAL INTERRUPTION FLAGS

Assessment report should distinguish:

```text
candidate behavior

```

from:

```text
technical system event

```

Example:

```text
Interview contained 2 connection interruptions.
Communication scores were not adjusted based on these interruptions.

```

---
# 68. SESSION FINALIZATION

Finalization must be idempotent.

Conceptual:

```text
Interview ends
↓
seal transcript
↓
store duration
↓
store interview metadata
↓
mark completed
↓
enqueue/trigger assessment

```

Retries must not create duplicate assessments or duplicate billing.

---
