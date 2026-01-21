# N8N Integration Guide

## 🔌 Configuração da Integração com N8N

Este projeto está totalmente preparado para se conectar com n8n.

### 1. **Variáveis de Ambiente (.env.local)**

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=sua-chave-api-n8n
N8N_BASE_URL=http://localhost:5678
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. **Endpoints Disponíveis**

#### a) Webhook Receiver

```
POST /api/n8n/webhook
GET /api/n8n/webhook
```

Recebe dados do n8n e processa.

#### b) Workflow Executor

```
POST /api/n8n/execute
GET /api/n8n/execute
```

Executa workflows do n8n passando dados do frontend.

#### c) Status Check

```
GET /api/n8n/status
```

Verifica se a integração com n8n está configurada.

### 3. **Como Configurar no N8N**

#### Opção A: Usando Webhook (Recomendado)

1. **No N8N:**

   - Crie um novo workflow
   - Adicione um nó "Webhook" como trigger
   - Configure:
     - URL: `http://localhost:3000/api/n8n/webhook`
     - Método: `POST`
     - Autenticação: Use headers customizados

2. **No Frontend:**
   - Dados são enviados automaticamente para o webhook

#### Opção B: Usando HTTP Request

1. **No N8N:**
   - Adicione um nó "HTTP Request"
   - Configure:
     - URL: `http://localhost:3000/api/n8n/execute`
     - Método: `POST`
     - Headers:
       ```
       Content-Type: application/json
       X-API-Key: sua-chave-api
       ```
     - Body:
       ```json
       {
         "workflowPath": "seu-workflow",
         "messages": [...]
       }
       ```

### 4. **Estrutura de Payload**

```typescript
{
  agentType: "reflexive" | "state-machine" | "objective-driven" | "learning",
  messages: [
    {
      role: "user" | "assistant",
      content: "mensagem"
    }
  ],
  metadata: {
    source: "frontend",
    userId?: string,
    sessionId?: string
  },
  timestamp: "2024-01-08T10:30:00Z"
}
```

### 5. **Exemplo de Uso no N8N**

```
[Webhook]
  ↓
[Parse JSON]
  ↓
[Seu Processamento]
  ↓
[HTTP Response]
```

### 6. **Testing**

Verificar status da integração:

```bash
curl http://localhost:3000/api/n8n/status
```

### 7. **Fluxo de Dados**

```
Frontend Chat
    ↓
/api/chat (OpenAI)
    ↓
/api/n8n/execute (N8N Webhook)
    ↓
N8N Workflow
    ↓
Resposta para Frontend
```

### 8. **Segurança**

- Use `N8N_API_KEY` em variáveis de ambiente
- Não commit `.env.local` no git
- Valide tokens no webhook
- Use HTTPS em produção

### 9. **Monitoramento**

Verificar logs do N8N:

- Acesse `http://localhost:5678`
- Vá em "Executions"
- Monitor dos webhooks recebidos

## 📚 Documentação do Código

### `lib/n8n.ts`

Cliente n8n para enviar dados e chamar APIs.

### `app/api/n8n/webhook/route.ts`

Recebe webhooks do n8n.

### `app/api/n8n/execute/route.ts`

Executa workflows do n8n.

### `app/api/n8n/status/route.ts`

Status da integração.
