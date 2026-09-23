"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { glucoseReadingSchema } from "@/lib/validations/glucose-reading";

export type CreateGlucoseReadingState = {
  error?: string;
  success?: boolean;
};

export async function createGlucoseReading(
  input: unknown,
): Promise<CreateGlucoseReadingState> {
  const parsed = glucoseReadingSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("glucose_readings").insert({
    user_id: user.id,
    value_mg_dl: parsed.data.value_mg_dl,
    context: parsed.data.context,
    measured_at: parsed.data.measured_at.toISOString(),
  });

  if (error) {
    return { error: "Não foi possível salvar o registro. Tente novamente." };
  }

  return { success: true };
}
