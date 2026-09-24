"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { alertThresholdsSchema } from "@/lib/validations/alert-thresholds";

export type ThresholdsActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  message?: string;
};

export async function saveAlertThresholds(
  _prevState: ThresholdsActionState,
  formData: FormData,
): Promise<ThresholdsActionState> {
  const parsed = alertThresholdsSchema.safeParse({
    hypo_mg_dl: formData.get("hypo_mg_dl"),
    hyper_fasting_mg_dl: formData.get("hyper_fasting_mg_dl"),
    hyper_post_meal_mg_dl: formData.get("hyper_post_meal_mg_dl"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("alert_thresholds").upsert({
    user_id: user.id,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: "Não foi possível salvar os limites. Tente novamente." };
  }

  revalidatePath("/alertas");
  revalidatePath("/historico");
  return { message: "Limites salvos!" };
}

export async function resetAlertThresholds(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("alert_thresholds")
    .delete()
    .eq("user_id", user.id);

  revalidatePath("/alertas");
  revalidatePath("/historico");
}
