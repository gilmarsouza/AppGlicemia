"use client";

import { useActionState } from "react";

import { saveAlertThresholds, type ThresholdsActionState } from "./actions";
import type { AlertThresholds } from "@/lib/glucose-alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FIELDS: {
  name: keyof AlertThresholds;
  label: string;
  hint: string;
}[] = [
  {
    name: "hypo_mg_dl",
    label: "Glicemia baixa: abaixo de",
    hint: "Vale para qualquer momento do dia.",
  },
  {
    name: "hyper_fasting_mg_dl",
    label: "Glicemia alta em jejum / antes da refeição: acima de",
    hint: "Usado para medições em jejum e antes das refeições.",
  },
  {
    name: "hyper_post_meal_mg_dl",
    label: "Glicemia alta depois da refeição: acima de",
    hint: "Usado para medições depois das refeições e antes de dormir.",
  },
];

const initialState: ThresholdsActionState = {};

export function ThresholdsForm({ thresholds }: { thresholds: AlertThresholds }) {
  const [state, formAction, isPending] = useActionState(
    saveAlertThresholds,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-2">
          <Label htmlFor={field.name} className="text-lg leading-snug">
            {field.label}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={field.name}
              name={field.name}
              type="number"
              inputMode="numeric"
              required
              defaultValue={thresholds[field.name]}
              aria-invalid={state.fieldErrors?.[field.name] ? true : undefined}
              className="h-12 w-32 text-lg"
            />
            <span className="text-lg text-muted-foreground">mg/dL</span>
          </div>
          <p className="text-base text-muted-foreground">{field.hint}</p>
          {state.fieldErrors?.[field.name] && (
            <p className="text-base text-destructive">
              {state.fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      {state.error && (
        <p className="text-base text-destructive">{state.error}</p>
      )}
      {state.message && (
        <p className="text-base text-foreground" role="status">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="h-12 text-lg"
      >
        {isPending ? "Salvando..." : "Salvar limites"}
      </Button>
    </form>
  );
}
