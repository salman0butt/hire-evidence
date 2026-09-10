import Link from "next/link";

import { logoutAction } from "@/app/(auth)/auth/actions";

type AppNavigationProps = Readonly<{
  userEmail: string;
}>;

export function AppNavigation({ userEmail }: AppNavigationProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/app" className="text-lg font-semibold tracking-tight text-zinc-950">
          Hire Evidence
        </Link>
        <nav aria-label="Application" className="flex items-center gap-4 text-sm">
          <span className="text-zinc-600">{userEmail}</span>
          <Link
            href="/app/profile"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Profile
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-3 py-2 font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
