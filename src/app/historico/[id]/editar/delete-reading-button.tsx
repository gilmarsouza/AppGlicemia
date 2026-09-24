"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteGlucoseReading } from "../../actions";
import { Button } from "@/components/ui/button";

export function DeleteReadingButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGlucoseReading(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/historico");
    });
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="h-12 w-full text-lg"
        onClick={() => setConfirming(true)}
      >
        Excluir medição
      </Button>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby="delete-confirm-title"
      className="flex flex-col gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-4"
    >
      <p id="delete-confirm-title" className="text-lg font-semibold">
        Tem certeza que quer excluir esta medição? Isso não pode ser desfeito.
      </p>
      {error && <p className="text-base text-destructive">{error}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          size="lg"
          disabled={isPending}
          onClick={handleDelete}
          className="h-12 flex-1 bg-destructive text-lg text-white hover:bg-destructive/90"
        >
          {isPending ? "Excluindo..." : "Sim, excluir"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isPending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          className="h-12 flex-1 text-lg"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
