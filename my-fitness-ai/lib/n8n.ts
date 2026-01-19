/**
 * N8N Integration Library
 * Handles communication with n8n workflows
 */

export interface N8nWebhookPayload {
  agentType: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface N8nResponse {
  success: boolean;
  data?: any;
  error?: string;
  workflowId?: string;
}

class N8nClient {
  private webhookUrl: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.webhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/food-log";
    this.apiKey = process.env.N8N_API_KEY || "";
    this.baseUrl = process.env.N8N_BASE_URL || "http://localhost:5678";
  }

  /**
   * Envia dados para webhook n8n
   */
  async sendToWebhook(
    path: string,
    payload: N8nWebhookPayload,
  ): Promise<N8nResponse> {
    try {
      const normalizedBase = this.webhookUrl.replace(/\/?$/, "");
      const normalizedPath = path.replace(/^\//, "");
      const response = await fetch(`${normalizedBase}/${normalizedPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`N8N webhook error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("N8N webhook error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Chama API REST do n8n
   */
  async callApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": this.apiKey,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("N8N API error:", error);
      throw error;
    }
  }

  /**
   * Retorna a URL do webhook para configuração
   */
  getWebhookUrl(): string {
    return this.webhookUrl;
  }

  /**
   * Verifica se n8n está configurado
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.webhookUrl !== "";
  }
}

export const n8nClient = new N8nClient();
