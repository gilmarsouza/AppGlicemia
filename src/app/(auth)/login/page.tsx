"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login, type AuthActionState } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Entrar</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-lg">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 text-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-lg">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-12 text-lg"
            />
          </div>
          {state.error && (
            <p className="text-base text-destructive">{state.error}</p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="h-12 text-lg"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="mt-4 text-base text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/signup" className="font-medium text-primary">
            Cadastre-se
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
