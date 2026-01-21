"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Zap, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NutritionMetrics {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  nutrition?: NutritionMetrics;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onAgentChange: (agent: string) => void;
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <span className="leading-relaxed whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="text-emerald-400 font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
}

function NutritionCard({ nutrition }: { nutrition: NutritionMetrics }) {
  const macroItems = [
    {
      label: "Calorias",
      value: Math.round(nutrition.calories),
      unit: "kcal",
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      textSize: "text-lg",
    },
    {
      label: "Proteína",
      value: nutrition.protein.toFixed(1),
      unit: "g",
      icon: Beef,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      textSize: "text-base",
    },
    {
      label: "Carbo",
      value: nutrition.carbs.toFixed(1),
      unit: "g",
      icon: Wheat,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textSize: "text-base",
    },
    {
      label: "Gordura",
      value: nutrition.fat.toFixed(1),
      unit: "g",
      icon: Droplets,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textSize: "text-base",
    },
  ];

  return (
    <div className="mt-3 mb-1">
      <div className="grid grid-cols-4 gap-2">
        {macroItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex flex-col items-center justify-center rounded-xl border ${item.borderColor} ${item.bgColor} p-2 text-center transition-all hover:scale-105`}
            >
              <Icon className={`h-4 w-4 mb-1 ${item.color}`} />
              <p className={`${item.textSize} font-bold ${item.color} leading-none`}>
                {item.value}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">
                {item.unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChatInterface({ onAgentChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentInput = input;
      setInput("");
      setIsLoading(true);

      try {
        const messagesList = [
          ...messages,
          { role: "user" as const, content: currentInput },
        ].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: messagesList }),
        });

        if (!response.ok) throw new Error("Erro na API");

        const data = await response.json();
        const selectedAgent = data.agent || "Agente Baseado em Estados";
        let nutritionData: NutritionMetrics | undefined;
        if (data?.saved_log && typeof data.saved_log === "object") {
          const log = data.saved_log;
          const cal = Number(log.calories);
          
          if (!isNaN(cal) && cal > 0) {
             nutritionData = {
                calories: cal,
                protein: Number(log.protein ?? 0),
                carbs: Number(log.carbs ?? 0),
                fat: Number(log.fat ?? 0),
             };
          }
        }

        let cleanContent = data.message || "Resposta do N8N.";
        if (nutritionData) {
            cleanContent = cleanContent.split("📊")[0].trim(); 
        }

        onAgentChange(selectedAgent);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanContent,
          agent: selectedAgent,
          nutrition: nutritionData,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "⚠️ Erro ao processar mensagem.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, isLoading, onAgentChange]
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Saúde IA</h2>
          <p className="text-xs text-slate-500">Assistente Multi-Agente</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <Zap className="h-3 w-3" /> Online
        </div>
      </div>

      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center mt-10">
              <Bot className="mx-auto mb-4 h-10 w-10 text-slate-600" />
              <p className="text-slate-400">Olá! Sou seu assistente de saúde.</p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                
                {!isUser && (
                  <div className="mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%]`}>
                  <div
                    className={`rounded-2xl px-5 py-3 text-sm shadow-sm ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <FormattedText text={message.content} />
                    {message.nutrition && !isUser && (
                      <NutritionCard nutrition={message.nutrition} />
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 px-1">
                    <span>
                      {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.agent && !isUser && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-500 font-medium">{message.agent}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 ml-11">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs">Digitando...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3 shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sobre sua refeição ou treino..."
          className="flex-1 border-slate-700 bg-slate-900/50 text-slate-200 focus-visible:ring-emerald-500"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}