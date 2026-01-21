export interface N8nWebhookPayload {
  agentType: string;
  user_id?: string;
  message?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface N8nResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  workflowId?: string;
}

class N8nClient {
  private apiKey: string;
  private baseUrl: string;
  private webhookBaseUrl: string;

  constructor() {
    this.baseUrl = (process.env.N8N_BASE_URL || "").replace(/\/$/, "");
    this.apiKey = process.env.N8N_API_KEY || "";
    const envWebhookBase = (process.env.N8N_WEBHOOK_BASE_URL || "").replace(
      /\/$/,
      "",
    );

    this.webhookBaseUrl =
      envWebhookBase || (this.baseUrl ? `${this.baseUrl}/webhook` : "");
  }

  async sendToWebhook(
    path: string,
    payload: N8nWebhookPayload,
  ): Promise<N8nResponse> {
    try {
      if (!this.webhookBaseUrl) {
        throw new Error("N8N webhook base URL not configured");
      }
      const normalizedPath = path.replace(/^\//, "");
      const url = `${this.webhookBaseUrl}/${normalizedPath}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`N8N webhook error: ${response.status} ${text}`);
      }

      const data = await response.json().catch(() => ({}));
      return { success: true, data };
    } catch (error) {
      console.error("N8N webhook error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async callApi(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    try {
      if (!this.baseUrl) throw new Error("N8N base URL not configured");
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": this.apiKey,
          ...options.headers,
        },
        ...options,
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`N8N API error: ${response.status} ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error("N8N API error:", error);
      throw error;
    }
  }

  getWebhookUrl(): string {
    return this.webhookBaseUrl;
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }
}

export const n8nClient = new N8nClient();
