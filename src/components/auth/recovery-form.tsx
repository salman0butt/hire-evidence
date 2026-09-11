"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  idleAuthActionState,
  type AuthActionState,
} from "@/lib/auth/action-state";

type RecoveryMode = "request" | "reset";

type RecoveryAction = (
  previousState: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

type RecoveryFormProps = Readonly<{
  mode: RecoveryMode;
  action?: RecoveryAction;
  message?: string;
  messageRole?: "alert" | "status";
}>;

async function idleAction(state: AuthActionState): Promise<AuthActionState> {
  return state;
}

export function RecoveryForm({
  mode,
  action = idleAction,
  message,
  messageRole,
}: RecoveryFormProps) {
  const [state, formAction, pending] = useActionState(action, idleAuthActionState);
  const isRequest = mode === "request";
  const activeMessage = message ?? state.message ?? null;
  const role =
    messageRole ?? (state.status === "recovery-requested" || state.status === "password-updated" ? "status" : "alert");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <section aria-labelledby="recovery-title" className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Hire Evidence
          </p>
          <h1 id="recovery-title" className="text-3xl font-semibold tracking-tight text-zinc-950">
            {isRequest ? "Reset your password" : "Choose a new password"}
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            {isRequest
              ? "Enter your account email and we’ll send reset instructions if an account exists."
              : "Set a new password for your Hire Evidence account."}
          </p>
        </div>

        <form action={formAction} className="space-y-5" noValidate>
          {isRequest ? (
            <div className="space-y-2">
              <label htmlFor="recovery-email" className="block text-sm font-medium text-zinc-800">
                Email
              </label>
              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="recovery-password" className="block text-sm font-medium text-zinc-800">
                New password
              </label>
              <input
                id="recovery-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                aria-describedby="recovery-password-help"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
              <p id="recovery-password-help" className="text-xs leading-5 text-zinc-500">
                Use at least 8 characters.
              </p>
            </div>
          )}

          {activeMessage ? (
            <p role={role} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {activeMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait…" : isRequest ? "Send reset link" : "Update password"}
          </button>
        </form>

        <p className="text-sm text-zinc-600">
          <Link
            href={isRequest ? "/auth/login" : "/auth/forgot-password"}
            className="font-semibold text-zinc-950 underline underline-offset-4"
          >
            {isRequest ? "Back to log in" : "Request a new reset link"}
          </Link>
        </p>
      </section>
    </main>
  );
}
