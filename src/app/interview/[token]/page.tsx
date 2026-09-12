import { resolvePublicInvitation } from "@/lib/candidates/public-invitation";

type CandidateInterviewPageProps = Readonly<{
  params: Promise<{ token: string }>;
}>;

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

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <section className="space-y-3" aria-labelledby="interview-heading">
        <p className="text-sm font-medium text-slate-600">
          {result.invitation.organizationName}
        </p>
        <h1 id="interview-heading" className="text-3xl font-semibold tracking-tight">
          {result.invitation.jobTitle} interview
        </h1>
      </section>
    </main>
  );
}
