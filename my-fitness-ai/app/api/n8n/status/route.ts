/**
 * N8N Status Endpoint
 * Verifica o status da conexão e configuração com n8n
 */

export async function GET() {
  const n8nUrl = process.env.N8N_BASE_URL || "http://localhost:5678";
  const webhookUrl =
    process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook";
  const isConfigured = !!process.env.N8N_API_KEY;

  return Response.json(
    {
      status: "ok",
      n8n: {
        configured: isConfigured,
        baseUrl: n8nUrl,
        webhookUrl: webhookUrl,
        apiKeySet: isConfigured,
      },
      endpoints: {
        webhook: "/api/n8n/webhook",
        execute: "/api/n8n/execute",
        status: "/api/n8n/status",
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
