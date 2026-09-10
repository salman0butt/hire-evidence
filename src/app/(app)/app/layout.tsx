import type { ReactNode } from "react";

import { AppNavigation } from "@/components/app/app-navigation";
import { requireUser } from "@/lib/auth/require-user";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  const user = await requireUser("/app");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <AppNavigation userEmail={user.email ?? "Signed in user"} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
