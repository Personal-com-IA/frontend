# 🏋️ My Fitness AI

Assistente pessoal de saúde e fitness com IA, sistema multi-agente integrado com N8N e Supabase.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **Supabase** - Autenticação e banco de dados
- **N8N** - Orquestração de agentes IA
- **TailwindCSS** - Estilização
- **TypeScript** - Tipagem estática

## 📦 Estrutura do Projeto

```
my-fitness-ai/
├── src/
│   ├── app/
│   │   ├── api/chat/          # Endpoint principal de chat
│   │   ├── auth/              # Callback de autenticação
│   │   ├── login/             # Página de login/cadastro
│   │   ├── reset-password/    # Recuperação de senha
│   │   └── update-password/   # Atualização de senha
│   ├── components/
│   │   ├── agent-monitor.tsx         # Monitor de agentes ativos
│   │   ├── ai-context-memory.tsx     # Memória e aprendizado RAG
│   │   ├── chat-interface.tsx        # Interface de chat
│   │   └── chat-interface-container.tsx
│   └── lib/
│       ├── n8n.ts            # Cliente N8N
│       ├── utils.ts          # Utilitários
│       └── supabase/         # Configuração Supabase
└── public/
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica

# N8N
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=sua_chave_n8n
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🤖 Sistema Multi-Agente

O projeto utiliza 4 agentes IA especializados:

- **🔍 Agente Reflexivo** - Respostas imediatas
- **⚙️ Agente de Estados** - Gerencia contexto e fluxo
- **🎯 Agente de Objetivos** - Planejamento de metas
- **🧠 Agente de Aprendizado** - RAG e memória contínua

## 📝 Funcionalidades

- ✅ Autenticação completa (login, cadastro, recuperação de senha)
- ✅ Chat inteligente com seleção automática de agentes
- ✅ Registro automático de refeições com análise nutricional
- ✅ Memória de aprendizado com RAG
- ✅ Interface responsiva e moderna

## 🔗 Integração N8N

O sistema se conecta ao N8N através do webhook `food-log`. Configure seu workflow N8N para receber:

```json
{
  "agentType": "auto",
  "user_id": "uuid",
  "message": "string",
  "messages": [],
  "metadata": {},
  "timestamp": "ISO 8601"
}
```

## 📄 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Verifica código com ESLint

## 🙏 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
