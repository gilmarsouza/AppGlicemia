import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import {
  glucoseContextLabels,
  type GlucoseContext,
} from "@/lib/validations/glucose-reading";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GlucoseChart, type ChartPoint } from "./glucose-chart";

const PERIODS = [
  { days: 7, label: "7 dias" },
  { days: 30, label: "30 dias" },
  { days: 90, label: "90 dias" },
] as const;

const DEFAULT_DAYS = 30;

type Reading = {
  id: string;
  value_mg_dl: number;
  context: GlucoseContext;
  measured_at: string;
};

async function getReadingsSince(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const supabase = await createClient();
  return supabase
    .from("glucose_readings")
    .select("id, value_mg_dl, context, measured_at")
    .gte("measured_at", since.toISOString())
    .order("measured_at", { ascending: true })
    .returns<Reading[]>();
}

export default async function HistoricoPage({
  searchParams,
}: PageProps<"/historico">) {
  const { periodo } = await searchParams;
  const days =
    PERIODS.find((p) => String(p.days) === periodo)?.days ?? DEFAULT_DAYS;

  const { data, error } = await getReadingsSince(days);

  const readings = data ?? [];
  const chartData: ChartPoint[] = readings.map((r) => ({
    time: new Date(r.measured_at).getTime(),
    value: r.value_mg_dl,
    context: r.context,
  }));
  const newestFirst = [...readings].reverse();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Histórico</h1>
            <nav className="flex gap-2" aria-label="Período">
              {PERIODS.map((p) => (
                <Link
                  key={p.days}
                  href={`/historico?periodo=${p.days}`}
                  aria-current={p.days === days ? "page" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: p.days === days ? "default" : "outline",
                      size: "lg",
                    }),
                    "h-11 px-4 text-base",
                  )}
                >
                  {p.label}
                </Link>
              ))}
            </nav>
          </div>

          {error ? (
            <p className="text-base text-destructive">
              Não foi possível carregar o histórico. Tente novamente.
            </p>
          ) : readings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-4 py-2">
                <p className="text-lg">
                  Nenhuma medição nos últimos {days} dias.
                </p>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-6 text-lg",
                  )}
                >
                  Registrar glicemia
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Glicemia (mg/dL) — últimos {days} dias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GlucoseChart data={chartData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Medições ({readings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {newestFirst.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-lg">
                            {glucoseContextLabels[r.context]}
                          </span>
                          <span className="text-base text-muted-foreground">
                            {formatDateTime(r.measured_at)}
                          </span>
                        </div>
                        <span className="text-2xl font-semibold tabular-nums">
                          {r.value_mg_dl}
                          <span className="ml-1 text-base font-normal text-muted-foreground">
                            mg/dL
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
