import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(process.env.N8N_WEBHOOK_URL);
  const userId =
    process.env.N8N_USER_ID; 
    // Messagem do usuário
  const userMessage =
  Array.isArray(messages) && messages.length > 0
    ? messages[messages.length - 1].content
    : "";



  try {
    // Endpoint direto do fluxo N8N
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/food-log";

    // Enviar para o webhook do fluxo configurado
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"X-API-Key": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify({
        messages,
        metadata: {
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
        },
        user_id: userId,
        message: userMessage, 
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const detail =
        typeof responseBody === "string"
          ? responseBody
          : responseBody?.error || responseBody?.message || "unknown error";
      throw new Error(
        `N8N responded with status ${response.status}$${detail ? `: ${detail}` : ""}`,
      );
    }

    const data =
      typeof responseBody === "object" && responseBody !== null
        ? responseBody
        : { response: responseBody };

    // Retornar resposta do N8N com o agente selecionado
    
    return NextResponse.json(
      {
        message: data.response || data.message || "Resposta do N8N.",
        agent: data.selectedAgent || data.agent || "automático",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique se o N8N está rodando.",
        agent: "erro",
      },
      { status: 500 },
    );
  }
}
