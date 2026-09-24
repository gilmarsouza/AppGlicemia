import type { ReadingStatus } from "@/lib/glucose-alerts";
import { cn } from "@/lib/utils";

export const statusStyles: Record<
  Exclude<ReadingStatus, "normal">,
  { label: string; badge: string; banner: string }
> = {
  baixa: {
    label: "Baixa",
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    banner:
      "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
  },
  alta: {
    label: "Alta",
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    banner:
      "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
  },
};

export function ReadingStatusBadge({ status }: { status: ReadingStatus }) {
  if (status === "normal") return null;
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-base font-semibold",
        style.badge,
      )}
    >
      {style.label}
    </span>
  );
}
