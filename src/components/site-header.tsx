import Link from "next/link";

import { logout } from "@/app/(auth)/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Registrar" },
  { href: "/historico", label: "Histórico" },
  { href: "/alertas", label: "Alertas" },
];

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3">
      <span className="text-lg font-semibold">AppGlicemia</span>
      <div className="flex items-center gap-2">
        <nav className="flex gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 px-3 text-base",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <Button type="submit" variant="outline" size="lg" className="h-11 px-3 text-base">
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}
