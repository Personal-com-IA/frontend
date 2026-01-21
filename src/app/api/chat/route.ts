import { NextResponse } from "next/server";
import { n8nClient, type N8nWebhookPayload } from "@/lib/n8n";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messages = [] } = await req.json();
  const normalized = Array.isArray(messages)
    ? messages.map((m: any) => ({ role: m.role, content: m.content }))
    : [];

  const lastUserMessage =
    [...normalized].reverse().find((msg) => msg.role === "user")?.content ||
    normalized.at(-1)?.content ||
    "";

  const payload: N8nWebhookPayload = {
    agentType: "auto",
    user_id: sessionData.session.user.id,
    message: lastUserMessage,
    messages: normalized,
    metadata: {
      timestamp: new Date().toISOString(),
      messageCount: normalized.length,
      lastMessage: lastUserMessage,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const result = await n8nClient.sendToWebhook("food-log", payload);
    if (!result.success) {
      throw new Error(result.error || "N8N webhook failed");
    }

    const data = result.data || {};
    
    console.log("N8N response data:", data);

    return NextResponse.json(
      {
        message: data.response || data.message || "Resposta do N8N.",
        agent: data.selectedAgent || data.agent || "automático",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique o N8N.",
        agent: "erro",
      },
      { status: 500 }
    );
  }
}