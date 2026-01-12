import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    // N8N escolhe o agente automaticamente baseado no conteúdo
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook";

    // Enviar para webhook de classificação automática no N8N
    const response = await fetch(`${n8nWebhookUrl}/auto-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify({
        messages,
        metadata: {
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
          // N8N irá classificar o melhor agente automaticamente
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N responded with status ${response.status}`);
    }

    const data = await response.json();

    // Retornar resposta do N8N com o agente selecionado
    return NextResponse.json(
      {
        message: data.response || data.message || "Resposta do N8N",
        agent: data.selectedAgent || data.agent || "automático",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique se o N8N está rodando.",
        agent: "erro",
      },
      { status: 500 }
    );
  }
}
