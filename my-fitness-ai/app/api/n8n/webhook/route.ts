/**
 * N8N Webhook Receiver
 * Recebe e processa webhooks do n8n
 */

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("N8N Webhook received:", {
      timestamp: new Date().toISOString(),
      payload,
    });

    // Validar payload
    if (!payload.agentType || !payload.messages) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Processar dados do n8n
    const processedData = {
      received: true,
      timestamp: new Date().toISOString(),
      agentType: payload.agentType,
      messageCount: payload.messages.length,
      metadata: payload.metadata || {},
    };

    return Response.json(processedData, { status: 200 });
  } catch (error) {
    console.error("N8N webhook error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Método GET para testar se webhook está funcionando
export async function GET() {
  return Response.json(
    {
      status: "active",
      message: "N8N webhook endpoint is ready",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
