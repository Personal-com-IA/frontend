"use client";

import { AGENTS, type AgentType } from "@/lib/agents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AgentSelectorProps {
  selectedAgent: AgentType | null;
  onSelectAgent: (agent: AgentType) => void;
}

export function AgentSelector({
  selectedAgent,
  onSelectAgent,
}: AgentSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(AGENTS).map(([key, agent]) => {
        const isSelected = selectedAgent === key;
        return (
          <Card
            key={agent.id}
            className={`p-4 cursor-pointer transition-all ${
              isSelected
                ? `bg-gradient-to-r ${agent.color} text-white`
                : "hover:shadow-lg"
            }`}
          >
            <div onClick={() => onSelectAgent(agent.id)} className="space-y-3">
              <div className="text-4xl mb-2">{agent.icon}</div>
              <h3 className="font-bold text-lg">{agent.name}</h3>
              <p className={isSelected ? "text-white/90" : "text-gray-600"}>
                {agent.description}
              </p>
              <div className="text-xs font-semibold mt-2">
                <span
                  className={isSelected ? "text-white/80" : "text-gray-500"}
                >
                  Tipo: {agent.type}
                </span>
              </div>
              {isSelected && (
                <Button
                  className="w-full mt-4 bg-white text-gray-900 hover:bg-gray-100"
                  size="sm"
                >
                  Selecionado ✓
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
