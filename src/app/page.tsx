import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntryForm } from "./entry-form";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Registrar glicemia</CardTitle>
            </CardHeader>
            <CardContent>
              <EntryForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
