# Seleção Automática de Agentes - Guia de Implementação N8N

## 📋 Visão Geral

O sistema agora funciona com **seleção automática de agentes**. O usuário apenas digita uma mensagem e o N8N automaticamente classifica qual agente deve responder baseado no conteúdo da entrada.

## 🔄 Fluxo de Funcionamento

```
Usuário digita mensagem
         ↓
Frontend envia para /api/chat
         ↓
API envia para N8N webhook: /webhook/auto-agent
         ↓
N8N CLASSIFICA e escolhe agente
         ↓
N8N processa com agente selecionado
         ↓
N8N retorna: { response, selectedAgent }
         ↓
Frontend exibe resposta + agente selecionado
```

## 🎯 Agentes Disponíveis

| Agente             | Tipo               | Melhor Para                                |
| ------------------ | ------------------ | ------------------------------------------ |
| 🔍 **Reflexivo**   | Metacognição       | Análise profunda, questões complexas       |
| ⚙️ **Estados**     | Máquina de Estados | Processos estruturados, passos sequenciais |
| 🎯 **Objetivos**   | Planejamento       | Metas mensuráveis, planos de ação          |
| 🧠 **Aprendizado** | Adaptação          | Padrões recorrentes, evolução contínua     |

## 📝 Estrutura de Mensagens

### Frontend → API

```json
POST /api/chat
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Nota:** Não enviar mais o parâmetro `agent` - N8N escolhe automaticamente!

### API → N8N

```json
POST /webhook/auto-agent
{
  "messages": [...],
  "metadata": {
    "timestamp": "2024-...",
    "messageCount": 2
  }
}
```

### N8N → API (Resposta esperada)

```json
{
  "response": "Sua resposta aqui...",
  "selectedAgent": "reflexive" | "state-machine" | "objective-driven" | "learning"
}
```

## 🔧 Configuração do N8N

### Passo 1: Criar Workflow de Auto-Classificação

1. Criar novo workflow chamado `auto-agent`
2. Adicionar trigger: **Webhook**
3. Configurar URL do webhook: `http://localhost:5678/webhook/auto-agent`
4. HTTP Method: `POST`

### Passo 2: Adicionar Nó de Classificação

Use um dos seguintes métodos:

#### Opção A: IF/ELSE Statements (Simples)

```
Analisar a última mensagem do usuário
IF contém palavras-chave reflexivas → agent = "reflexive"
ELSE IF contém palavras-chave de objetivos → agent = "objective-driven"
ELSE IF contém passos/sequências → agent = "state-machine"
ELSE → agent = "learning"
```

#### Opção B: LLM/AI (Mais inteligente)

```
1. Adicionar nó "LLM" ou integração OpenAI/ChatGPT
2. Prompt: "Classifique esta mensagem em um dos agentes: reflexive, state-machine, objective-driven, learning. Retorne apenas o nome do agente."
3. Parse resposta e selecione agente
```

#### Opção C: Webhook para Serviço de Classificação

```
Chamar API de classificação externa que retorna o agente apropriado
```

### Passo 3: Chamar Agente Selecionado

Baseado no `selectedAgent`:

```javascript
// Para cada agente, usar o system prompt apropriado
if (selectedAgent === "reflexive") {
  systemPrompt =
    "Você é um agente reflexivo que analisa e critica seu próprio raciocínio...";
} else if (selectedAgent === "state-machine") {
  systemPrompt = "Você é um agente de estados que gerencia transições...";
  // etc
}
```

### Passo 4: Retornar Resposta

```json
{
  "response": "resultado da AI...",
  "selectedAgent": "reflexive"
}
```

## 🌐 Exemplos de Entrada e Saída

### Exemplo 1: Pergunta Reflexiva

**Entrada:**

```
"Qual é o significado profundo de motivação em fitness?"
```

**Saída Esperada:**

```
Agent: reflexive
Response: "Deixe-me refletir sobre isso... [análise profunda]"
```

### Exemplo 2: Objetivos Mensuráveis

**Entrada:**

```
"Quero ganhar 5kg de músculo em 3 meses, como faço um plano?"
```

**Saída Esperada:**

```
Agent: objective-driven
Response: "Seu objetivo é claro! Aqui está o plano: 1) ... 2) ... 3) ..."
```

### Exemplo 3: Processo Estruturado

**Entrada:**

```
"Me guie pelo processo de começar a treinar"
```

**Saída Esperada:**

```
Agent: state-machine
Response: "Vamos por etapas: ETAPA 1: Avaliação... ETAPA 2: Preparação..."
```

## 🧪 Testando o Sistema

### Via cURL

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Como começo a malhar?"}
    ]
  }'
```

### Via Frontend

1. Abrir aplicação em `http://localhost:3000`
2. Digitar qualquer mensagem
3. Aguardar N8N processar (deve exibir "N8N está processando...")
4. Ver resposta com agente selecionado

## ⚙️ Configurações de Ambiente

```env
# .env.local
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=seu_api_key_opcional
```

## 🔍 Troubleshooting

### Erro: "N8N está processando..." - sem resposta

- ✅ Verificar se N8N está rodando: `http://localhost:5678`
- ✅ Verificar URL do webhook está correta
- ✅ Ver logs do N8N

### Erro: "selectedAgent é undefined"

- ✅ N8N está retornando `selectedAgent`?
- ✅ Testar webhook diretamente com POST
- ✅ Ver resposta JSON do N8N

### Agente sempre retorna "automático"

- ✅ `selectedAgent` não está vindo do N8N
- ✅ Estrutura de resposta precisa incluir `selectedAgent`

## 📚 Próximos Passos

1. **Implementar Classificação**: Criar lógica de classificação inteligente no N8N
2. **Melhorar Acurácia**: Treinar/ajustar regras de classificação
3. **Analytics**: Coletar dados sobre qual agente é selecionado com mais frequência
4. **Feedback Loop**: Permitir usuário confirmar se agente foi apropriado

## 🎓 Referência de Prompts do Sistema

Cada agente tem seu próprio system prompt em `lib/agents.ts`:

```typescript
AGENTS = {
  reflexive: { systemPrompt: "..." },
  "state-machine": { systemPrompt: "..." },
  "objective-driven": { systemPrompt: "..." },
  learning: { systemPrompt: "..." },
};
```

Estes prompts devem ser usados pelo N8N ao chamar a IA.

---

**Status**: ✅ Sistema pronto para receber input automático via N8N
