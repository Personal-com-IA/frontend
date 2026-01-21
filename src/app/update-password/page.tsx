import { Suspense } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { UpdatePasswordClient } from "./update-password-client";

export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
          <Card className="w-full max-w-md border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-100">Carregando...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <UpdatePasswordClient />
    </Suspense>
  );
}
