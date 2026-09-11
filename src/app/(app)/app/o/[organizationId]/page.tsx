export default function TenantOverviewPage() {
  return (
    <section aria-labelledby="tenant-overview-heading" className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Organization workspace
      </p>
      <h1
        id="tenant-overview-heading"
        className="text-3xl font-semibold tracking-tight text-zinc-950"
      >
        Overview
      </h1>
      <p className="max-w-2xl text-zinc-600">
        Manage organization access and settings here. Jobs and interviewer configuration arrive in the next product milestone.
      </p>
    </section>
  );
}
