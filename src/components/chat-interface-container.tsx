"use client";

import { useState } from "react";
import { AgentMonitor } from "@/components/agent-monitor";
import { ChatInterface } from "@/components/chat-interface";
import { AIContextMemory } from "@/components/ai-context-memory";

interface ChatInterfaceContainerProps {
  userId: string;
}

export function ChatInterfaceContainer({ userId }: ChatInterfaceContainerProps) {
  const [activeAgent, setActiveAgent] = useState<string>("Agente Baseado em Objetivos");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_320px]">
      <AgentMonitor activeAgent={activeAgent} />
      <ChatInterface onAgentChange={setActiveAgent} />
      <AIContextMemory userId={userId} />
    </div>
  );
}