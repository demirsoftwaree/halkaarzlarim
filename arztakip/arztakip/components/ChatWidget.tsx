"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! Ben ARZ AI. Halka arz, lot dağıtımı, SPK mevzuatı veya BIST hakkında sorularını yanıtlayabilirim. Ne öğrenmek istersin?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Bilinmeyen hata" }));
        throw new Error(errData.error || "Yanıt alınamadı");
      }
      if (!res.body) throw new Error("Yanıt alınamadı");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `Hata: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Yapay zekaya sor"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && <span className="text-sm hidden sm:inline">Yapay Zekaya Sor</span>}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Bot size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ARZ AI</p>
              <p className="text-xs text-slate-400">Halka arz asistanı</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === "assistant"
                    ? "bg-emerald-500/20 border border-emerald-500/30"
                    : "bg-blue-500/20 border border-blue-500/30"
                }`}>
                  {msg.role === "assistant"
                    ? <Bot size={14} className="text-emerald-400" />
                    : <User size={14} className="text-blue-400" />
                  }
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "assistant"
                    ? "bg-slate-800 text-slate-200 rounded-tl-sm"
                    : "bg-emerald-500/20 text-emerald-100 rounded-tr-sm"
                }`}>
                  {msg.content || (loading && i === messages.length - 1 && (
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                  ))}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/50">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Halka arz hakkında sor..."
                disabled={loading}
                className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Yatırım tavsiyesi değildir. Bilgi amaçlıdır.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
