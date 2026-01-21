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
            Inteligência Artificial com N8N 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Principal */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Info Lateral */}
          
        </div>
      </div>
    </div>
  );
}
