"use client";

import { useEffect, useState } from "react";
import { Brain, Sparkles, History, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LearningEntry {
  id: string;
  bad_experience: string;
  created_at: string;
}

export function AIContextMemory({ userId }: { userId: string }) {
  const [learningHistory, setLearningHistory] = useState<LearningEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemory = async () => {
      const supabase = createClient();

      try {
        const { data: learningData } = await supabase
          .from("ai_learning")
          .select("id, bad_experience, created_at") 
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);

        setLearningHistory(learningData || []);
      } catch (error) {
        console.error("Erro ao sincronizar memória:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemory();
    const intervalId = setInterval(fetchMemory, 3000);

    return () => clearInterval(intervalId);
  }, [userId]);

  if (isLoading) {
    return (
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-purple-400" />
          <span className="text-[10px] font-mono text-slate-500">
            Sincronizando Memória...
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl h-full flex flex-col">
      <div className="mb-5 flex items-center gap-3 shrink-0">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/10 to-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Sparkles className="h-5 w-5 text-purple-300" />
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">Memória Viva</p>
          <p className="text-xs text-slate-500">Aprendizado Contínuo (RAG)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {learningHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
            <Brain className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">
              O banco de episódios está vazio.
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              Dê feedbacks para a IA aprender.
            </p>
          </div>
        ) : (
          learningHistory.map((entry) => (
            <div
              key={entry.id}
              className="group relative rounded-xl border border-slate-800 bg-slate-900/40 p-3 transition-all hover:border-purple-500/30 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />                  
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    FEEDBACK
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-600">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(entry.created_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="relative pl-2 border-l-2 border-slate-700 group-hover:border-purple-500/50 transition-colors">
                <p className="font-mono text-[11px] leading-relaxed text-slate-300 line-clamp-3">
                  &quot;{entry.bad_experience}&quot;
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[10px] text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <History className="h-3 w-3" />
          <span>{learningHistory.length} registros</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500/80">SYNC AUTO</span>
        </div>
      </div>
    </aside>
  );
}