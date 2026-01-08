/**
 * N8N Execution Endpoint
 * Executa workflows do n8n através da API
 */

import { n8nClient, type N8nWebhookPayload } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const { workflowPath, messages, agent, metadata } = await request.json();

    if (!workflowPath || !messages || !agent) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: workflowPath, messages, agent",
        }),
        { status: 400 }
      );
    }

    // Preparar payload
    const payload: N8nWebhookPayload = {
      agentType: agent,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      metadata: {
        source: "frontend",
        ...metadata,
      },
      timestamp: new Date().toISOString(),
    };

    // Enviar para webhook do n8n
    const result = await n8nClient.sendToWebhook(workflowPath, payload);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("N8N execution error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

// Endpoint para verificar status do n8n
export async function GET() {
  const isConfigured = true; // n8nClient.isConfigured()

  return new Response(
    JSON.stringify({
      status: isConfigured ? "configured" : "not-configured",
      webhookUrl: "http://localhost:3000/api/n8n/webhook",
      message: "N8N execution endpoint ready",
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
