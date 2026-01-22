import { NextResponse } from "next/server";
import { n8nClient, type N8nWebhookPayload } from "@/lib/n8n";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messages = [] } = await req.json();
  const normalized = Array.isArray(messages)
    ? messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    : [];

  const lastUserMessage =
    [...normalized].reverse().find((msg) => msg.role === "user")?.content ||
    normalized.at(-1)?.content ||
    "";

  const payload: N8nWebhookPayload = {
    agentType: "auto",
    user_id: userData.user.id,
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

    const data = (result.data as Record<string, unknown>) || {};

    console.log("N8N response data:", data);

    return NextResponse.json(
      {
        message:
          (data.response as string) ||
          (data.message as string) ||
          "Resposta do N8N.",
        agent:
          (data.selectedAgent as string) ||
          (data.agent as string) ||
          "automático",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique o N8N.",
        agent: "erro",
      },
      { status: 500 },
    );
  }
}
