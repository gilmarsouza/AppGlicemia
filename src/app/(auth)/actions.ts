"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { authCredentialsSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  message?: string;
};

function loginErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.";
    default:
      return "E-mail ou senha incorretos.";
  }
}

function signupErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "user_already_exists":
      return "Já existe uma conta com esse e-mail. Tente entrar em vez de cadastrar.";
    case "over_email_send_rate_limit":
      return "O limite de e-mails do projeto foi atingido. Desative a confirmação por e-mail em Authentication > Providers > Email no painel do Supabase, ou aguarde algumas horas e tente de novo.";
    case "weak_password":
      return "Senha muito fraca. Use pelo menos 6 caracteres.";
    default:
      return `Não foi possível criar a conta (${error.message}).`;
  }
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: loginErrorMessage(error) };
  }

  redirect("/");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { error: signupErrorMessage(error) };
  }

  if (!data.session) {
    return {
      message:
        "Conta criada! Verifique seu e-mail para confirmar antes de entrar.",
    };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
