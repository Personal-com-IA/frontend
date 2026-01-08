"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentSelector } from "@/components/agent-selector";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { AGENTS, type AgentType } from "@/lib/agents";

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-Agent AI System
          </h1>
          <p className="text-gray-600">
            Sistema com 4 tipos diferentes de agentes inteligentes
          </p>
        </div>

        {selectedAgent ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
            {/* Sidebar com seleção de agentes */}
            <div className="lg:col-span-1 space-y-2">
              <h2 className="font-bold text-gray-900 mb-4">Agentes</h2>
              {Object.entries(AGENTS).map(([key, agent]) => (
                <Button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  variant={selectedAgent === agent.id ? "default" : "outline"}
                  className="w-full justify-start gap-2 text-left"
                >
                  <span className="text-lg">{agent.icon}</span>
                  <span className="hidden sm:inline text-xs truncate">
                    {agent.name}
                  </span>
                </Button>
              ))}
              <Button
                onClick={() => setSelectedAgent(null)}
                variant="destructive"
                className="w-full mt-4"
              >
                Voltar
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <ChatInterface agent={selectedAgent} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <Card className="p-8">
              <CardHeader className="text-center mb-8">
                <CardTitle className="text-2xl">
                  Escolha um tipo de agente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AgentSelector
                  selectedAgent={selectedAgent}
                  onSelectAgent={setSelectedAgent}
                />
              </CardContent>
            </Card>

            {/* Sobre os agentes */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Tipos de Agentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    🔍 Agente Reflexivo
                  </p>
                  <p>
                    Analisa suas respostas e reflete sobre o raciocínio. Mostra
                    o processo de pensamento completo.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ⚙️ Agente de Estados
                  </p>
                  <p>
                    Gerencia estados e transições durante a conversa. Guia o
                    usuário através de etapas bem definidas.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    🎯 Agente Orientado por Objetivos
                  </p>
                  <p>
                    Trabalha com objetivos claros e métricas de sucesso. Foco em
                    planos estruturados e mensuráveis.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    🧠 Agente que Aprende
                  </p>
                  <p>
                    Aprende com interações e adapta comportamento. Melhora
                    respostas baseado em padrões e feedback.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comparação de padrões */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Padrões Arquiteturais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 font-bold">Agente</th>
                      <th className="pb-2 font-bold">Padrão</th>
                      <th className="pb-2 font-bold">Foco</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2">Reflexivo</td>
                      <td>Metacognição</td>
                      <td>Análise de raciocínio</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2">Estados</td>
                      <td>Máquina de Estados</td>
                      <td>Transições e contexto</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2">Objetivos</td>
                      <td>Planejamento</td>
                      <td>Metas mensuráveis</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2">Aprendizado</td>
                      <td>ML/Adaptação</td>
                      <td>Evolução contínua</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
