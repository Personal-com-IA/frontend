/**
 * N8N Workflow Examples
 * Exemplos de workflows N8N para integração
 */

export const N8N_WORKFLOW_EXAMPLES = {
  reflexiveAgent: {
    name: "Reflexive Agent Workflow",
    description: "Processa respostas do agente reflexivo",
    webhook: "reflexive-workflow",
    structure: `
      [Webhook] 
        ↓ (recebe agentType, messages, metadata)
      [Parse JSON]
        ↓
      [Process Agent Type]
        ↓
      [Invoke LLM - Think]
        ↓
      [Invoke LLM - Critique]
        ↓
      [Invoke LLM - Improve]
        ↓
      [HTTP Response]
    `,
  },
  stateMachineAgent: {
    name: "State Machine Agent Workflow",
    description: "Gerencia estados e transições",
    webhook: "state-machine-workflow",
    structure: `
      [Webhook]
        ↓
      [Determine Current State]
        ↓
      [Apply State Handler]
        ↓
      [Transition Logic]
        ↓
      [Generate Response]
        ↓
      [Update State]
        ↓
      [HTTP Response]
    `,
  },
  objectiveDriven: {
    name: "Objective-Driven Agent Workflow",
    description: "Trabalha com objetivos e métricas",
    webhook: "objective-workflow",
    structure: `
      [Webhook]
        ↓
      [Extract Objectives]
        ↓
      [Define Metrics]
        ↓
      [Create Action Plan]
        ↓
      [Track Progress]
        ↓
      [Generate Report]
        ↓
      [HTTP Response]
    `,
  },
  learningAgent: {
    name: "Learning Agent Workflow",
    description: "Aprende e adapta comportamento",
    webhook: "learning-workflow",
    structure: `
      [Webhook]
        ↓
      [Analyze History]
        ↓
      [Extract Patterns]
        ↓
      [Update Preferences]
        ↓
      [Adapt Response Style]
        ↓
      [Store Learning Data]
        ↓
      [HTTP Response]
    `,
  },
};

/**
 * Exemplo de Webhook JSON Structure
 */
export const WEBHOOK_PAYLOAD_EXAMPLE = {
  agentType: "reflexive",
  messages: [
    {
      role: "user",
      content: "Como posso melhorar minha produtividade?",
    },
  ],
  metadata: {
    source: "frontend",
    userId: "user-123",
    sessionId: "session-456",
    messageCount: 1,
  },
  timestamp: "2024-01-08T10:30:00Z",
};

/**
 * Exemplo de Resposta N8N
 */
export const N8N_RESPONSE_EXAMPLE = {
  success: true,
  data: {
    response:
      "Para melhorar sua produtividade, você pode: 1. Estabelecer objetivos claros...",
    analysis: {
      reflexion: "Esta é uma pergunta sobre desenvolvimento pessoal",
      critique: "A resposta é útil mas pode ser mais específica",
      improvement: "Adicionadas estratégias específicas",
    },
    metadata: {
      processingTime: 1234,
      model: "gpt-4",
      agentType: "reflexive",
    },
  },
};

/**
 * URL Configuration para Diferentes Ambientes
 */
export const ENVIRONMENT_URLS = {
  development: {
    frontend: "http://localhost:3000",
    n8n: "http://localhost:5678",
    webhook: "http://localhost:3000/api/n8n/webhook",
  },
  staging: {
    frontend: "https://staging.example.com",
    n8n: "https://n8n-staging.example.com",
    webhook: "https://staging.example.com/api/n8n/webhook",
  },
  production: {
    frontend: "https://example.com",
    n8n: "https://n8n.example.com",
    webhook: "https://example.com/api/n8n/webhook",
  },
};
