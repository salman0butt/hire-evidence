"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  idleAuthActionState,
  type AuthActionState,
} from "@/lib/auth/action-state";

type AuthMode = "login" | "signup";

type AuthAction = (
  previousState: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

type AuthFormProps = Readonly<{
  mode: AuthMode;
  action?: AuthAction;
  errorMessage: string | null;
  nextPath?: string;
}>;

async function idleAction(state: AuthActionState): Promise<AuthActionState> {
  return state;
}

export function AuthForm({
  mode,
  action = idleAction,
  errorMessage,
  nextPath,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, idleAuthActionState);
  const isLogin = mode === "login";
  const message = errorMessage ?? state.message ?? null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <section aria-labelledby="auth-title" className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Hire Evidence
          </p>
          <h1 id="auth-title" className="text-3xl font-semibold tracking-tight text-zinc-950">
            {isLogin ? "Log in to Hire Evidence" : "Create your Hire Evidence account"}
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            {isLogin
              ? "Continue to your structured interview workspace."
              : "Start building structured interviews with evidence-linked review."}
          </p>
        </div>

        <form action={formAction} className="space-y-5" noValidate>
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

          <div className="space-y-2">
            <label htmlFor={`${mode}-email`} className="block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${mode}-password`} className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={8}
              required
              aria-describedby={`${mode}-password-help`}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
            <p id={`${mode}-password-help`} className="text-xs leading-5 text-zinc-500">
              Use at least 8 characters.
            </p>
          </div>

          {message ? (
            <p
              role={state.status === "verification-required" ? "status" : "alert"}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-zinc-600">
          {isLogin ? "New to Hire Evidence? " : "Already have an account? "}
          <Link
            href={isLogin ? "/auth/signup" : "/auth/login"}
            className="font-semibold text-zinc-950 underline underline-offset-4"
          >
            {isLogin ? "Create an account" : "Log in instead"}
          </Link>
        </p>
      </section>
    </main>
  );
}
