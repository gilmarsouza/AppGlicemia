import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntryForm, type EditableReading } from "@/app/entry-form";
import { DeleteReadingButton } from "./delete-reading-button";

export default async function EditarMedicaoPage({
  params,
}: PageProps<"/historico/[id]/editar">) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: reading } = await supabase
    .from("glucose_readings")
    .select("id, value_mg_dl, context, measured_at")
    .eq("id", id)
    .maybeSingle<EditableReading>();

  if (!reading) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Link
            href="/historico"
            className="text-lg font-medium text-primary underline"
          >
            ← Voltar ao histórico
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Editar medição</CardTitle>
            </CardHeader>
            <CardContent>
              <EntryForm reading={reading} />
            </CardContent>
          </Card>
          <DeleteReadingButton id={reading.id} />
        </div>
      </main>
    </div>
  );
}
