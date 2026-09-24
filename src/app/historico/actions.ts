"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { glucoseReadingSchema } from "@/lib/validations/glucose-reading";

export type ReadingMutationState = {
  error?: string;
  success?: boolean;
};

const readingIdSchema = z.uuid();

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function updateGlucoseReading(
  id: unknown,
  input: unknown,
): Promise<ReadingMutationState> {
  const parsedId = readingIdSchema.safeParse(id);
  const parsed = glucoseReadingSchema.safeParse(input);

  if (!parsedId.success) {
    return { error: "Medição não encontrada." };
  }
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("glucose_readings")
    .update({
      value_mg_dl: parsed.data.value_mg_dl,
      context: parsed.data.context,
      measured_at: parsed.data.measured_at.toISOString(),
    })
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { error: "Não foi possível salvar as alterações. Tente novamente." };
  }
  if (!data?.length) {
    return { error: "Medição não encontrada." };
  }

  revalidatePath("/historico");
  return { success: true };
}

export async function deleteGlucoseReading(
  id: unknown,
): Promise<ReadingMutationState> {
  const parsedId = readingIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { error: "Medição não encontrada." };
  }

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("glucose_readings")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return { error: "Não foi possível excluir a medição. Tente novamente." };
  }
  if (!data?.length) {
    return { error: "Medição não encontrada." };
  }

  revalidatePath("/historico");
  return { success: true };
}
