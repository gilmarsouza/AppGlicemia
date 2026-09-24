"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createGlucoseReading, type CreateGlucoseReadingState } from "./actions";
import { updateGlucoseReading } from "./historico/actions";
import { statusStyles } from "@/components/reading-status-badge";
import { toDateTimeLocalValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  glucoseContextLabels,
  glucoseContextValues,
  glucoseReadingSchema,
  type GlucoseContext,
  type GlucoseReadingFormInput,
  type GlucoseReadingInput,
} from "@/lib/validations/glucose-reading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function nowForInput() {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export type EditableReading = {
  id: string;
  value_mg_dl: number;
  context: GlucoseContext;
  measured_at: string;
};

export function EntryForm({ reading }: { reading?: EditableReading }) {
  const router = useRouter();
  const [lastSaved, setLastSaved] = useState<CreateGlucoseReadingState | null>(
    null,
  );
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<GlucoseReadingFormInput, unknown, GlucoseReadingInput>({
    resolver: zodResolver(glucoseReadingSchema),
    defaultValues: reading
      ? {
          value_mg_dl: reading.value_mg_dl,
          context: reading.context,
          measured_at: toDateTimeLocalValue(reading.measured_at),
        }
      : {
          value_mg_dl: "" as unknown as GlucoseReadingFormInput["value_mg_dl"],
          context: "jejum",
          measured_at: nowForInput(),
        },
  });

  async function onSubmit(values: GlucoseReadingInput) {
    if (reading) {
      const result = await updateGlucoseReading(reading.id, values);
      if (result.error) {
        setError("root", { message: result.error });
        return;
      }
      router.push("/historico");
      return;
    }

    const result = await createGlucoseReading(values);

    if (result.error) {
      setLastSaved(null);
      setError("root", { message: result.error });
      return;
    }

    setLastSaved(result);
    reset({
      value_mg_dl: "" as unknown as GlucoseReadingFormInput["value_mg_dl"],
      context: "jejum",
      measured_at: nowForInput(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="value_mg_dl" className="text-lg">
          Glicemia (mg/dL)
        </Label>
        <Input
          id="value_mg_dl"
          type="number"
          inputMode="numeric"
          className="h-12 text-lg"
          {...register("value_mg_dl")}
        />
        {errors.value_mg_dl && (
          <p className="text-base text-destructive">
            {errors.value_mg_dl.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="context" className="text-lg">
          Quando foi medida
        </Label>
        <Controller
          control={control}
          name="context"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="context" className="h-12 w-full text-lg">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {glucoseContextValues.map((value) => (
                  <SelectItem key={value} value={value} className="text-lg">
                    {glucoseContextLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.context && (
          <p className="text-base text-destructive">
            {errors.context.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="measured_at" className="text-lg">
          Data e hora
        </Label>
        <Input
          id="measured_at"
          type="datetime-local"
          className="h-12 text-lg"
          {...register("measured_at")}
        />
        {errors.measured_at && (
          <p className="text-base text-destructive">
            {errors.measured_at.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-base text-destructive">{errors.root.message}</p>
      )}

      {lastSaved?.classification &&
        lastSaved.classification.status !== "normal" && (
          <div
            role="alert"
            className={cn(
              "rounded-lg border-2 px-4 py-3 text-lg",
              statusStyles[lastSaved.classification.status].banner,
            )}
          >
            <p className="font-semibold">
              {lastSaved.classification.status === "baixa"
                ? `Glicemia baixa: ${lastSaved.value} mg/dL (abaixo de ${lastSaved.classification.limit})`
                : `Glicemia alta: ${lastSaved.value} mg/dL (acima de ${lastSaved.classification.limit})`}
            </p>
            <p className="mt-1 text-base">
              {lastSaved.classification.status === "baixa"
                ? "Siga o que foi combinado com seu médico para glicemia baixa. Se sentir tremor, suor frio, tontura ou confusão, peça ajuda."
                : "Siga o que foi combinado com seu médico para glicemia alta."}
            </p>
          </div>
        )}

      {lastSaved && (
        <p className="text-base text-foreground" role="status">
          Registro salvo!{" "}
          <Link href="/historico" className="font-medium text-primary underline">
            Ver histórico
          </Link>
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 text-lg"
      >
        {isSubmitting ? "Salvando..." : reading ? "Salvar alterações" : "Salvar"}
      </Button>
    </form>
  );
}
