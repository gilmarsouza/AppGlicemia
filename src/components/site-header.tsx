import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <span className="text-lg font-semibold">AppGlicemia</span>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Sair
        </Button>
      </form>
    </header>
  );
}
