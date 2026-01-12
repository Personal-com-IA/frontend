"use client";

import { ChatInterface } from "@/components/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-Agent AI System
          </h1>
          <p className="text-gray-600">
            Inteligência Artificial com N8N - Agente automático
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Principal */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Info Lateral */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>
                  ✨ Apenas <strong>digite sua mensagem</strong> e o sistema
                  automaticamente escolhe o melhor agente.
                </p>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-2">
                    Agentes Disponíveis:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      🔍 <strong>Reflexivo</strong> - Analisa e reflete
                    </li>
                    <li>
                      ⚙️ <strong>Estados</strong> - Gerencia transições
                    </li>
                    <li>
                      🎯 <strong>Objetivos</strong> - Foca em metas
                    </li>
                    <li>
                      🧠 <strong>Aprendizado</strong> - Se adapta
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-lg">Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Seleção inteligente de agentes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Integrado com N8N</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Histórico de conversa</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Processamento em tempo real</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
