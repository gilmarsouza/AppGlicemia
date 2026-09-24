import { z } from "zod";

const limit = (label: string) =>
  z.coerce
    .number({ error: `Informe o limite de ${label}` })
    .int("Informe um número inteiro")
    .min(1, "O valor deve ser maior que 0")
    .max(999, "O valor deve ser menor que 1000");

export const alertThresholdsSchema = z
  .object({
    hypo_mg_dl: limit("glicemia baixa"),
    hyper_fasting_mg_dl: limit("glicemia alta em jejum"),
    hyper_post_meal_mg_dl: limit("glicemia alta depois da refeição"),
  })
  .refine((t) => t.hypo_mg_dl < t.hyper_fasting_mg_dl, {
    path: ["hyper_fasting_mg_dl"],
    error: "Deve ser maior que o limite de glicemia baixa",
  })
  .refine((t) => t.hypo_mg_dl < t.hyper_post_meal_mg_dl, {
    path: ["hyper_post_meal_mg_dl"],
    error: "Deve ser maior que o limite de glicemia baixa",
  });
