import { z } from "zod";

export const glucoseContextValues = [
  "jejum",
  "antes_refeicao",
  "depois_refeicao",
  "antes_dormir",
] as const;

export type GlucoseContext = (typeof glucoseContextValues)[number];

export const glucoseContextLabels: Record<GlucoseContext, string> = {
  jejum: "Jejum",
  antes_refeicao: "Antes da refeição",
  depois_refeicao: "Depois da refeição",
  antes_dormir: "Antes de dormir",
};

export const glucoseReadingSchema = z.object({
  value_mg_dl: z.coerce
    .number({ error: "Informe um número" })
    .int("Informe um número inteiro")
    .min(1, "O valor deve ser maior que 0")
    .max(999, "O valor deve ser menor que 1000"),
  context: z.enum(glucoseContextValues, {
    error: "Selecione quando essa medição foi feita",
  }),
  measured_at: z.coerce.date({ error: "Informe uma data/hora válida" }),
});

// The parsed/coerced shape (value_mg_dl: number, measured_at: Date) — what
// the server action receives after validation.
export type GlucoseReadingInput = z.output<typeof glucoseReadingSchema>;

// The raw shape coming out of form fields (value_mg_dl/measured_at as
// strings) before Zod's coercion runs — what react-hook-form should be
// typed with, since zodResolver coerces on submit, not on change.
export type GlucoseReadingFormInput = z.input<typeof glucoseReadingSchema>;
