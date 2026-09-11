import Link from "next/link";

import { listOrganizations } from "@/lib/organization/repository";

export default async function AppPage() {
  const organizations = await listOrganizations();

  return (
    <section aria-labelledby="workspace-heading" className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Workspace
        </p>
        <h1 id="workspace-heading" className="text-3xl font-semibold tracking-tight">
          Your organizations
        </h1>
        <p className="max-w-2xl text-zinc-600">
          Choose an organization workspace or create one to start collaborating with your hiring team.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/organizations/new"
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Create organization
        </Link>
      </div>

      {organizations.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {organizations.map((organization) => (
            <li
              key={organization.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <Link
                href={`/app/o/${organization.id}`}
                className="text-lg font-semibold text-zinc-950 underline-offset-4 hover:underline"
              >
                {organization.name}
              </Link>
              {organization.companySize ? (
                <p className="mt-2 text-sm text-zinc-600">
                  {organization.companySize}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">No organizations yet</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Create your first organization to establish a tenant-scoped hiring workspace.
          </p>
        </div>
      )}
    </section>
  );
}
