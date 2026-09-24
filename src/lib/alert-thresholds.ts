import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THRESHOLDS, type AlertThresholds } from "@/lib/glucose-alerts";

// Users only get a row once they save custom limits; until then, defaults apply.
export async function getAlertThresholds(): Promise<{
  thresholds: AlertThresholds;
  isCustom: boolean;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("alert_thresholds")
    .select("hypo_mg_dl, hyper_fasting_mg_dl, hyper_post_meal_mg_dl")
    .maybeSingle<AlertThresholds>();

  return data
    ? { thresholds: data, isCustom: true }
    : { thresholds: DEFAULT_THRESHOLDS, isCustom: false };
}
