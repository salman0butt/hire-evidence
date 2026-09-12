import { CandidateConsentForm } from "@/components/candidates/candidate-consent-form";
import { resolvePublicInvitation } from "@/lib/candidates/public-invitation";
import type { PublicInvitationProjection } from "@/lib/candidates/public-invitation";
import { recordCandidateConsentAction } from "./consent-actions";

type CandidateInterviewPageProps = Readonly<{
  params: Promise<{ token: string }>;
}>;

function formatInterviewType(interviewType: string) {
  return interviewType
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildPreInterviewItems(invitation: PublicInvitationProjection) {
  return [
    {
      title: "Approximate duration",
      description: `${Math.ceil(invitation.durationSeconds / 60)} minutes`,
    },
    {
      title: "Interview format",
      description: formatInterviewType(invitation.interviewType),
    },
    {
      title: "Technical requirements",
      description:
        "Use a modern browser, a stable internet connection, and a working microphone. You will be able to complete a technical check before the interview timer starts.",
    },
    {
      title: "Privacy",
      description:
        "Before starting, you will review the AI, transcription, data-processing, and retention disclosures and provide explicit consent.",
    },
    {
      title: "Start prerequisites",
      description:
        "The invitation must remain valid, you must confirm the disclosures and consent, and the required technical checks must pass before an interview attempt starts.",
    },
  ] as const;
}

export default async function CandidateInterviewPage({
  params,
}: CandidateInterviewPageProps) {
  const { token } = await params;
  const result = await resolvePublicInvitation(token);

  if (result.status === "unavailable") {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-16">
        <section aria-labelledby="invitation-unavailable" className="space-y-3">
          <h1 id="invitation-unavailable" className="text-2xl font-semibold">
            Invitation unavailable
          </h1>
          <p className="text-sm text-slate-600">
            This interview invitation is invalid or no longer available.
          </p>
        </section>
      </main>
    );
  }

  const preInterviewItems = buildPreInterviewItems(result.invitation);
  const consentAction = recordCandidateConsentAction.bind(null, token);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-16">
      <section className="space-y-3" aria-labelledby="interview-heading">
        <p className="text-sm font-medium text-slate-600">
          {result.invitation.organizationName}
        </p>
        <h1 id="interview-heading" className="text-3xl font-semibold tracking-tight">
          {result.invitation.jobTitle} interview
        </h1>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Review what to expect before you continue. Nothing below starts an interview
          attempt or begins recording.
        </p>
      </section>

      <section className="mt-10 space-y-5" aria-labelledby="before-you-start">
        <div className="space-y-2">
          <h2 id="before-you-start" className="text-xl font-semibold">
            Before you start
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            These details are shown before consent and before the authoritative interview
            start flow.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {preInterviewItems.map((item) => (
            <div
              key={item.title}
              className="min-w-0 rounded-lg border border-slate-200 p-4 sm:last:col-span-2"
            >
              <dt className="font-medium text-slate-950">{item.title}</dt>
              <dd className="mt-2 break-words text-sm leading-6 text-slate-600">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10">
        <CandidateConsentForm action={consentAction} />
      </div>
    </main>
  );
}
