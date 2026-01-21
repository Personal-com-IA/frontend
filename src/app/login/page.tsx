"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = React.useMemo(() => createBrowserSupabaseClient(), []);

  const [mode, setMode] = React.useState<Mode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setMessage("Informe email e senha.");
        return;
      }

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/");
        return;
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;

      setMessage(
        "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
      );
    } catch (err: any) {
      setMessage(err?.message ?? "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-100">
            {mode === "signin" ? "Entrar" : "Criar conta"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {mode === "signin"
              ? "Acesse o chat com seu e-mail e senha."
              : "Crie sua conta com e-mail e senha."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email</label>
              <Input
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                className="border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-300">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                disabled={loading}
                className="border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            {message && <p className="text-sm text-slate-300">{message}</p>}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-slate-800 text-slate-100 hover:bg-slate-700 mt-4"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Processando..."
                : mode === "signin"
                  ? "Entrar"
                  : "Cadastrar"}
            </Button>

            <div className="flex w-full items-center justify-between text-sm">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
                onClick={() =>
                  setMode((m) => (m === "signin" ? "signup" : "signin"))
                }
                disabled={loading}
              >
                {mode === "signin" ? "Criar conta" : "Já tenho conta"}
              </button>

              {mode === "signin" && (
                <Link
                  className="text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
                  href="/reset-password"
                >
                  Esqueci minha senha
                </Link>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
