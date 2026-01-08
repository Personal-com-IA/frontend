# 🚀 Integração N8N - Guia Rápido

## ✅ Tudo Pronto!

Seu projeto está **100% preparado** para se conectar com N8N. Aqui está o que foi configurado:

---

## 📁 Estrutura Criada

```
my-fitness-ai/
├── .env.local                 ← Configure aqui
├── .env.example              ← Exemplo de variáveis
├── lib/
│   ├── n8n.ts               ← Cliente N8N
│   └── n8n-examples.ts      ← Exemplos de workflows
├── app/api/n8n/
│   ├── webhook/route.ts     ← Recebe webhooks
│   ├── execute/route.ts     ← Executa workflows
│   └── status/route.ts      ← Verifica status
├── components/
│   └── chat-interface.tsx   ← Integrado com N8N
├── N8N_SETUP.md             ← Documentação completa
└── scripts/
    └── test-n8n.js          ← Scripts de teste
```

---

## 🔧 Configuração em 3 Passos

### 1️⃣ Configure as Variáveis de Ambiente

Edite `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-sua-chave-aqui

# N8N Configuration
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=sua-chave-api-n8n
N8N_BASE_URL=http://localhost:5678

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 2️⃣ Instale e Inicie N8N

```bash
# Instalar N8N globalmente
npm install -g n8n

# Ou com Docker (recomendado)
docker run -it --rm --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Inicie o servidor
npm run dev
```

### 3️⃣ Crie um Workflow no N8N

1. Acesse: `http://localhost:5678`
2. Crie um novo workflow
3. Adicione um nó **Webhook** como trigger
4. Configure URL: `http://localhost:3000/api/n8n/webhook`
5. Adicione seus nós de processamento
6. Clique em "Test" para ativar

---

## 🔌 Endpoints Disponíveis

### Status da Integração

```bash
GET /api/n8n/status
```

Resposta:

```json
{
  "status": "ok",
  "n8n": {
    "configured": true,
    "baseUrl": "http://localhost:5678",
    "webhookUrl": "http://localhost:5678/webhook"
  }
}
```

### Webhook Receiver (N8N → Frontend)

```bash
POST /api/n8n/webhook
Content-Type: application/json

{
  "agentType": "reflexive",
  "messages": [{"role": "user", "content": "..."}],
  "metadata": {...},
  "timestamp": "2024-01-08T..."
}
```

### Workflow Executor (Frontend → N8N)

```bash
POST /api/n8n/execute
Content-Type: application/json

{
  "workflowPath": "reflexive-workflow",
  "messages": [...],
  "agent": "reflexive",
  "metadata": {...}
}
```

---

## 💬 Como Funciona

```
┌─────────────────────────────────────────────────┐
│         Frontend Chat Interface                  │
│  (Agentes: Reflexivo, Estados, Objetivos)      │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    OpenAI API          N8N Webhook
    (Default)           (Optional)
         │                   │
         │         ┌─────────┴──────────┐
         │         │                    │
         │         ▼                    ▼
         │      Webhook Receiver    N8N Workflow
         │          │                   │
         └──────────┼───────────────────┘
                    │
                    ▼
            Chat Interface
            (Resposta Formatada)
```

---

## 🎯 Exemplos de Uso

### 1️⃣ Agente Reflexivo + N8N

```javascript
// Frontend envia dados
fetch("/api/n8n/execute", {
  method: "POST",
  body: JSON.stringify({
    workflowPath: "reflexive-workflow",
    agent: "reflexive",
    messages: [{ role: "user", content: "Como melhorar?" }],
  }),
});
```

N8N processa:

1. Recebe via Webhook
2. Invoca LLM para análise
3. Invoca LLM para crítica
4. Invoca LLM para melhoria
5. Retorna resposta completa

### 2️⃣ Máquina de Estados + N8N

```javascript
fetch('/api/n8n/execute', {
  method: 'POST',
  body: JSON.stringify({
    workflowPath: 'state-machine-workflow',
    agent: 'state-machine',
    messages: [...]
  })
})
```

### 3️⃣ Agente de Aprendizado + N8N

```javascript
fetch('/api/n8n/execute', {
  method: 'POST',
  body: JSON.stringify({
    workflowPath: 'learning-workflow',
    agent: 'learning',
    messages: [...]
  })
})
```

---

## 🧪 Testar a Integração

### Via cURL

```bash
# 1. Verificar status
curl http://localhost:3000/api/n8n/status

# 2. Testar webhook
curl -X POST http://localhost:3000/api/n8n/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "reflexive",
    "messages": [{"role": "user", "content": "teste"}],
    "metadata": {"source": "test"},
    "timestamp": "2024-01-08T10:30:00Z"
  }'

# 3. Executar workflow
curl -X POST http://localhost:3000/api/n8n/execute \
  -H "Content-Type: application/json" \
  -d '{
    "workflowPath": "reflexive-workflow",
    "messages": [{"role": "user", "content": "teste"}],
    "agent": "reflexive"
  }'
```

### Via Node.js Script

```bash
node scripts/test-n8n.js
```

---

## 🎨 Interface Chat Atualizada

A interface agora possui:

✅ **Toggle N8N/OpenAI** - Escolha a fonte de resposta
✅ **Indicador de Origem** - Mostra se é OpenAI ou N8N
✅ **Status Check** - Verifica se N8N está configurado
✅ **Alerta de Configuração** - Aviso se N8N não está setup
✅ **Processamento em Tempo Real** - Streaming de respostas

---

## 🔒 Segurança

- [ ] Use variáveis de ambiente
- [ ] Configure chaves API seguras
- [ ] Use HTTPS em produção
- [ ] Valide tokens do N8N
- [ ] Não commit `.env.local` no git

---

## 📚 Próximos Passos

1. **Configure N8N** com seus workflows
2. **Teste os endpoints** com cURL
3. **Ative o toggle N8N** na interface chat
4. **Monitore os logs** do N8N
5. **Implemente lógica customizada** nos workflows

---

## 🆘 Troubleshooting

### N8N não conecta

```bash
# Verifique se N8N está rodando
curl http://localhost:5678

# Verifique variáveis de ambiente
echo $N8N_API_KEY
echo $N8N_WEBHOOK_URL
```

### Webhook não recebe dados

1. Verifique a URL no N8N
2. Verifique se N8N webhook está ativado
3. Veja os logs: `http://localhost:5678/executions`

### Erro na execução

1. Verifique `.env.local`
2. Confirme chaves API
3. Verifique estrutura do payload

---

## 📖 Documentação Completa

Veja [N8N_SETUP.md](./N8N_SETUP.md) para documentação detalhada.

---

## ✨ Pronto para Usar!

Seu sistema está **100% integrado com N8N**. Aproveite! 🚀
