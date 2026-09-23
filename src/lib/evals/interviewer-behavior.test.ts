import { describe, expect, it } from "vitest";
import { evaluateInterviewerBehavior } from "./interviewer-behavior";

describe("evaluateInterviewerBehavior", () => {
  it("passes neutral, bounded, plan-adherent interviewer behavior", () => {
    const result = evaluateInterviewerBehavior({
      plannedQuestionIds: ["q1", "q2"],
      turns: [
        { questionId: "q1", kind: "planned", text: "Describe the evidence for your approach." },
        { questionId: "q1", kind: "follow_up", text: "What trade-off did you consider?" },
        { questionId: "q2", kind: "planned", text: "How did you verify the result?" },
      ],
      maxFollowUpsPerQuestion: 1,
      technicalFailure: false,
    });

    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("rejects plan drift and excessive follow-ups deterministically", () => {
    const result = evaluateInterviewerBehavior({
      plannedQuestionIds: ["q1"],
      turns: [
        { questionId: "q2", kind: "planned", text: "Unexpected question" },
        { questionId: "q1", kind: "follow_up", text: "Follow up one" },
        { questionId: "q1", kind: "follow_up", text: "Follow up two" },
      ],
      maxFollowUpsPerQuestion: 1,
      technicalFailure: false,
    });

    expect(result.violations).toEqual(["plan_drift", "follow_up_limit_exceeded"]);
    expect(result.passed).toBe(false);
  });

  it("keeps technical failures separate from candidate behavior", () => {
    const result = evaluateInterviewerBehavior({
      plannedQuestionIds: ["q1"],
      turns: [],
      maxFollowUpsPerQuestion: 1,
      technicalFailure: true,
    });

    expect(result.technicalFailure).toBe(true);
    expect(result.candidateFault).toBe(false);
    expect(result.violations).not.toContain("candidate_failure");
  });

  it("flags prohibited sensitive-trait inference or hiring decisions", () => {
    const result = evaluateInterviewerBehavior({
      plannedQuestionIds: ["q1"],
      turns: [
        { questionId: "q1", kind: "planned", text: "What is your religion?" },
        { questionId: "q1", kind: "follow_up", text: "I will decide whether to hire you." },
      ],
      maxFollowUpsPerQuestion: 1,
      technicalFailure: false,
    });

    expect(result.violations).toContain("sensitive_trait_request");
    expect(result.violations).toContain("autonomous_hiring_decision");
    expect(result.passed).toBe(false);
  });
});
