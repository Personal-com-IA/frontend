import { AGENTS, type AgentType } from "@/lib/agents";

function buildSystemPrompt(agentType: AgentType, conversationLength: number) {
  const agent = AGENTS[agentType];
  let fullPrompt = agent.systemPrompt;

  // Adiciona contexto específico por tipo de agente
  if (agentType === "reflexive") {
    fullPrompt += `\n\nPara esta conversa:
    1. Primeiro, explique seu raciocínio
    2. Depois, critique sua própria resposta
    3. Por fim, ofereça a resposta aprimorada`;
  } else if (agentType === "state-machine") {
    const states = ["inicial", "análise", "solução", "conclusão"];
    const currentState = states[Math.min(conversationLength, 3)];
    fullPrompt += `\n\nEstado atual: ${currentState}
    Progresso da conversa: ${conversationLength} mensagens`;
  } else if (agentType === "objective-driven") {
    fullPrompt += `\n\nFoque em:
    1. Clareza dos objetivos
    2. Plano de ação estruturado
    3. Métricas mensuráveis
    4. Acompanhamento de progresso`;
  } else if (agentType === "learning") {
    fullPrompt += `\n\nAprenda com o histórico:
    - Número de trocas: ${conversationLength}
    - Adapte seu estilo conforme aprende sobre as preferências
    - Melhore respostas baseado em padrões`;
  }

  return fullPrompt;
}

export async function POST(req: Request) {
  const { messages, agent } = await req.json();

  const agentInfo = AGENTS[agent as AgentType];
  if (!agentInfo) {
    return new Response("Invalid agent", { status: 400 });
  }

  try {
    const systemPrompt = buildSystemPrompt(
      agent as AgentType,
      messages.length
    );

    // Enviar para N8N
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook";

    const response = await fetch(`${n8nWebhookUrl}/${agent}-workflow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify({
        agentType: agent,
        systemPrompt,
        messages,
        metadata: {
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N error: ${response.statusText}`);
    }

    const data = await response.json();

    // Retornar resposta do N8N
    return new Response(
      JSON.stringify({
        message: data.response || data.message || "Resposta do N8N",
        agentType: agent,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao conectar com N8N. Verifique a configuração.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
