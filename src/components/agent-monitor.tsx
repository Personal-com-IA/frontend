"use client";

import { Brain, Cpu, Target, Sparkles } from "lucide-react";

interface AgentMonitorProps {
  activeAgent: string;
}

const agentArchitectures = [
  {
    id: "Agente Reflexivo Simples",
    displayName: "Agente Reflexivo",
    description: "Resposta imediata",
    color: "red",
    bgActive: "bg-red-500/20",
    bgInactive: "bg-red-500/5",
    borderActive: "border-red-500/60",
    borderInactive: "border-red-500/20",
    textColor: "text-red-400",
    glowActive: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    icon: Brain,
  },
  {
    id: "Agente Baseado em Estados",
    displayName: "Máquina de Estados",
    description: "Contexto & Fluxo",
    color: "blue",
    bgActive: "bg-blue-500/20",
    bgInactive: "bg-blue-500/5",
    borderActive: "border-blue-500/60",
    borderInactive: "border-blue-500/20",
    textColor: "text-blue-400",
    glowActive: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    icon: Cpu,
  },
  {
    id: "Agente Baseado em Objetivos",
    displayName: "Planejador (Planner)",
    description: "Estratégia & Meta",
    color: "purple",
    bgActive: "bg-purple-500/20",
    bgInactive: "bg-purple-500/5",
    borderActive: "border-purple-500/60",
    borderInactive: "border-purple-500/20",
    textColor: "text-purple-400",
    glowActive: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    icon: Target,
  },
  {
    id: "Agente que Aprende",
    displayName: "Núcleo de Aprendizado",
    description: "RAG & Memória",
    color: "yellow",
    bgActive: "bg-yellow-500/20",
    bgInactive: "bg-yellow-500/5",
    borderActive: "border-yellow-500/60",
    borderInactive: "border-yellow-500/20",
    textColor: "text-yellow-400",
    glowActive: "shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    icon: Sparkles,
  },
] as const;

export function AgentMonitor({ activeAgent }: AgentMonitorProps) {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">Monitor de Agentes</p>
          <p className="text-xs text-slate-500">Sistema Multi-Agente</p>
        </div>
      </div>

      <div className="space-y-3">
        {agentArchitectures.map((agent) => {
          const isActive = agent.id === activeAgent;
          const Icon = agent.icon;
          
          return (
            <div
              key={agent.id}
              className={`
                relative rounded-xl border px-3 py-3 transition-all duration-300
                ${isActive 
                  ? `${agent.borderActive} ${agent.bgActive} ${agent.glowActive} opacity-100` 
                  : `${agent.borderInactive} ${agent.bgInactive} opacity-50`
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-lg border transition-all
                    ${isActive ? agent.borderActive : agent.borderInactive}
                    ${isActive ? agent.bgActive : 'bg-slate-900/60'}
                  `}
                >
                  <Icon className={`h-4 w-4 ${agent.textColor} ${isActive ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                    {agent.displayName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {agent.description}
                  </p>
                </div>
                {isActive && (
                  <div className="relative">
                    <span className={`absolute h-3 w-3 animate-ping rounded-full ${agent.bgActive}`} />
                    <span className={`relative block h-3 w-3 rounded-full ${agent.textColor.replace('text-', 'bg-')}`} />
                  </div>
                )}
              </div>
              
              {isActive && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span className="animate-pulse">●</span>
                  <span>Ativo agora</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/30 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Status do Sistema
        </p>
        <div className="mt-2 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">N8N</span>
            <span className="text-emerald-400">● Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Supabase</span>
            <span className="text-emerald-400">● Operacional</span>
          </div>
        </div>
      </div>
    </aside>
  );
}