"use client";

import { useActionState } from "react";

import {
  idleProfileActionState,
  type ProfileActionState,
} from "@/lib/profile/action-state";

type ProfileAction = (
  previousState: ProfileActionState,
  formData: FormData,
) => Promise<ProfileActionState>;

type ProfileFormProps = Readonly<{
  initialDisplayName: string | null;
  action?: ProfileAction;
  message?: string;
  messageRole?: "alert" | "status";
}>;

async function idleAction(state: ProfileActionState): Promise<ProfileActionState> {
  return state;
}

export function ProfileForm({
  initialDisplayName,
  action = idleAction,
  message,
  messageRole,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, idleProfileActionState);
  const activeMessage = message ?? state.message ?? null;
  const role = messageRole ?? (state.status === "saved" ? "status" : "alert");

  return (
    <section aria-labelledby="profile-title" className="max-w-2xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Account settings
        </p>
        <h1 id="profile-title" className="text-3xl font-semibold tracking-tight text-zinc-950">
          Profile
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Set the name shown in your Hire Evidence workspace. Organization roles and team settings arrive in a later capability.
        </p>
      </div>

      <form action={formAction} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="profile-display-name" className="block text-sm font-medium text-zinc-800">
            Display name
          </label>
          <input
            id="profile-display-name"
            name="display_name"
            type="text"
            autoComplete="name"
            maxLength={120}
            defaultValue={initialDisplayName ?? ""}
            aria-describedby="profile-display-name-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p id="profile-display-name-help" className="text-xs leading-5 text-zinc-500">
            Optional. Use 120 characters or fewer.
          </p>
        </div>

        {activeMessage ? (
          <p role={role} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            {activeMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </form>
    </section>
  );
}
