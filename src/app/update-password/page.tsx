"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

function UpdatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = React.useMemo(() => createBrowserSupabaseClient(), []);

  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Para links de recuperação/confirm, o Supabase pode mandar ?code=...
    const code = searchParams.get("code");

    (async () => {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          setMessage("Sessão inválida. Peça um novo link de recuperação.");
          setReady(false);
          return;
        }

        setReady(true);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Não foi possível validar o link.";
        setMessage(errorMessage);
        setReady(false);
      }
    })();
  }, [searchParams, supabase]);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (!ready) {
        setMessage("Link inválido. Solicite novamente.");
        return;
      }
      if (password.length < 6) {
        setMessage("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage("Senha atualizada! Redirecionando...");
      setTimeout(() => router.replace("/"), 800);
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar senha.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-100">Definir nova senha</CardTitle>
        </CardHeader>

        <form onSubmit={updatePassword}>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Nova senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading || !ready}
                className="border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            {message && <p className="text-sm text-slate-300">{message}</p>}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading || !ready}
              className="bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              {loading ? "Salvando..." : "Atualizar senha"}
            </Button>

            <Link
              className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
              href="/login"
            >
              Ir para login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
