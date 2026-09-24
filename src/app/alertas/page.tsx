import { getAlertThresholds } from "@/lib/alert-thresholds";
import { DEFAULT_THRESHOLDS } from "@/lib/glucose-alerts";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetAlertThresholds } from "./actions";
import { ThresholdsForm } from "./thresholds-form";

export default async function AlertasPage() {
  const { thresholds, isCustom } = await getAlertThresholds();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="flex w-full max-w-md flex-col gap-6">
          <h1 className="text-2xl font-semibold">Limites de alerta</h1>

          <div
            role="note"
            className="rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3 text-base text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
          >
            <p className="font-semibold">Confirme estes valores com o seu médico.</p>
            <p className="mt-1">
              {isCustom
                ? "Você está usando limites personalizados."
                : `Os valores abaixo (${DEFAULT_THRESHOLDS.hypo_mg_dl}, ${DEFAULT_THRESHOLDS.hyper_fasting_mg_dl} e ${DEFAULT_THRESHOLDS.hyper_post_meal_mg_dl} mg/dL) são referências gerais, não uma orientação para o seu caso.`}{" "}
              O app só avisa quando uma medição sai da faixa — ele não substitui
              o acompanhamento médico.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quando avisar</CardTitle>
            </CardHeader>
            <CardContent>
              <ThresholdsForm
                key={JSON.stringify(thresholds)}
                thresholds={thresholds}
              />
            </CardContent>
          </Card>

          {isCustom && (
            <form action={resetAlertThresholds}>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="h-12 w-full text-lg"
              >
                Voltar aos valores de referência
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
