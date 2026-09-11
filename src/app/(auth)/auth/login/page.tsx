import { AuthForm } from "@/components/auth/auth-form";

import { loginAction } from "../actions";

type LoginPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = firstValue(params.next);
  const errorCode = firstValue(params.error);
  const errorMessage =
    errorCode === "verification"
      ? "We could not verify that email link. Request a new link or try logging in."
      : null;

  const sharedProps = {
    mode: "login" as const,
    action: loginAction,
    errorMessage,
  };

  return nextPath ? (
    <AuthForm {...sharedProps} nextPath={nextPath} />
  ) : (
    <AuthForm {...sharedProps} />
  );
}
