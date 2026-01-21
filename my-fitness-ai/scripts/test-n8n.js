/**
 * N8N Integration Test Script
 * Execute no terminal para testar a conexão com N8N
 * 
 * Uso: curl http://localhost:3000/api/n8n/status
 */

const BASE_URL = "http://localhost:3000";

console.log("🔍 N8N Integration Test Script\n");

// 1. Testar endpoint de status
console.log("1️⃣ Testando status endpoint...");
console.log(`   curl ${BASE_URL}/api/n8n/status\n`);

// 2. Testar webhook receiver
console.log("2️⃣ Testando webhook receiver...");
console.log(`   curl -X POST ${BASE_URL}/api/n8n/webhook \\`);
console.log(`   -H "Content-Type: application/json" \\`);
console.log(`   -d '{
    "agentType": "reflexive",
    "messages": [{"role": "user", "content": "teste"}],
    "metadata": {"source": "test"},
    "timestamp": "2024-01-08T10:30:00Z"
  }'\n`);

// 3. Testar workflow executor
console.log("3️⃣ Testando workflow executor...");
console.log(`   curl -X POST ${BASE_URL}/api/n8n/execute \\`);
console.log(`   -H "Content-Type: application/json" \\`);
console.log(`   -d '{
    "workflowPath": "reflexive-workflow",
    "messages": [{"role": "user", "content": "teste"}],
    "agent": "reflexive",
    "metadata": {"source": "test"}
  }'\n`);

// 4. Dicas de configuração
console.log("⚙️ Configuração N8N:");
console.log("   ✅ Instale n8n: npm install -g n8n");
console.log("   ✅ Inicie n8n: n8n start");
console.log("   ✅ Acesse: http://localhost:5678");
console.log("   ✅ Crie um webhook com URL: http://localhost:3000/api/n8n/webhook\n");

// 5. Variáveis de ambiente
console.log("🔐 Variáveis de ambiente (.env.local):");
console.log("   N8N_WEBHOOK_URL=http://localhost:5678/webhook");
console.log("   N8N_API_KEY=sua-chave-api");
console.log("   N8N_BASE_URL=http://localhost:5678\n");

console.log("✨ Teste concluído!");
