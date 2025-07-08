import React, { useState } from "react";
import { askAI } from "../services/aiChatService";
import { Brain, Send } from "lucide-react";

const AIChat = () => {
  const [messages, setMessages] = useState([
    { sender: "ia", text: "¡Hola! Soy tu asistente de inversión. Pregúntame cualquier cosa sobre trading, inversiones, riesgos, estrategias o el mercado en tiempo real." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    const context = messages.map(m => (m.sender === "user" ? `Usuario: ${m.text}` : `AI: ${m.text}`)).join("\n");
    const aiResponse = await askAI(input, context);
    setMessages((msgs) => [...msgs, { sender: "ia", text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md z-50">
      <div className="bg-white border border-blue-200 rounded-2xl shadow-xl p-4 flex flex-col h-96">
        <div className="flex items-center mb-2">
          <Brain className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-blue-700">Asistente IA</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "ia" ? "justify-start" : "justify-end"}`}>
              <div className={`px-4 py-2 rounded-xl max-w-xs text-sm ${msg.sender === "ia" ? "bg-blue-50 text-blue-900" : "bg-green-100 text-green-900"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-900 max-w-xs text-sm animate-pulse">Pensando...</div>
            </div>
          )}
        </div>
        <div className="flex items-center mt-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white rounded-xl p-2 hover:bg-blue-700 disabled:bg-gray-300"
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
