import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatInterfaceContainer } from "@/components/chat-interface-container";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Saúde IA</h1>
            <p className="text-sm text-slate-400">
              Sistema Multi-Agente • n8n + Supabase + RAG
            </p>
          </div>
          <LogoutButton />
        </div>

        <ChatInterfaceContainer userId={user.id} />
      </div>
    </div>
  );
}
