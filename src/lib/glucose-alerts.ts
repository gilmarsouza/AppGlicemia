import type { GlucoseContext } from "@/lib/validations/glucose-reading";

export type AlertThresholds = {
  hypo_mg_dl: number;
  hyper_fasting_mg_dl: number;
  hyper_post_meal_mg_dl: number;
};

// Mirrors the column defaults in supabase/migrations/0001_init.sql. Generic
// reference values, NOT validated by a doctor for this patient (PROJETO.md §5/§11).
export const DEFAULT_THRESHOLDS: AlertThresholds = {
  hypo_mg_dl: 70,
  hyper_fasting_mg_dl: 130,
  hyper_post_meal_mg_dl: 180,
};

export type ReadingStatus = "baixa" | "normal" | "alta";

export type ReadingClassification = {
  status: ReadingStatus;
  limit: number | null;
};

// Pre-meal readings are compared against the fasting limit; bedtime readings
// against the post-meal limit, since they usually come a few hours after dinner.
function hyperLimitFor(context: GlucoseContext, t: AlertThresholds) {
  return context === "jejum" || context === "antes_refeicao"
    ? t.hyper_fasting_mg_dl
    : t.hyper_post_meal_mg_dl;
}

export function classifyReading(
  value: number,
  context: GlucoseContext,
  thresholds: AlertThresholds,
): ReadingClassification {
  if (value < thresholds.hypo_mg_dl) {
    return { status: "baixa", limit: thresholds.hypo_mg_dl };
  }
  const hyperLimit = hyperLimitFor(context, thresholds);
  if (value > hyperLimit) {
    return { status: "alta", limit: hyperLimit };
  }
  return { status: "normal", limit: null };
}
