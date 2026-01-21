"use client";

import * as React from "react";
import Link from "next/link";

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

export default function ResetPasswordPage() {
  const supabase = React.useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function sendResetEmail(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`,
      });
      if (error) throw error;

      setMessage("Link enviado! Verifique seu e-mail para redefinir a senha.");
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao enviar link.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-100">Recuperar senha</CardTitle>
        </CardHeader>

        <form onSubmit={sendResetEmail}>
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

            {message && <p className="text-sm text-slate-300">{message}</p>}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading}
              className="bg-slate-800 text-slate-100 hover:bg-slate-700"
            >
              {loading ? "Enviando..." : "Enviar link"}
            </Button>

            <Link
              className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
              href="/login"
            >
              Voltar
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
