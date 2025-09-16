"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { ChatMessage, generateGeminiResponse } from "@/lib/gemini";
import { ArrowUp, Bot, KeyRound, Sparkles, User } from "lucide-react";

const KEY_STORAGE = "GEMINI_API_KEY";

export default function ChatPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "welcome",
    role: "model",
    content: "Hi! I\'m your Gemini assistant. Ask me anything.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = localStorage.getItem(KEY_STORAGE);
    if (!key) {
      router.replace("/setup");
      return;
    }
    setApiKey(key);
  }, [router]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !!apiKey && !loading, [input, apiKey, loading]);

  async function onSend() {
    if (!canSend || !apiKey) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const reply = await generateGeminiResponse(apiKey, [...messages, userMessage]);
      const modelMessage: ChatMessage = { id: crypto.randomUUID(), role: "model", content: reply };
      setMessages((m) => [...m, modelMessage]);
    } catch (e: any) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "model", content: `Error: ${e?.message || e}` }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function clearChat() {
    setMessages([{ id: "welcome", role: "model", content: "New chat. How can I help?" }]);
  }

  function changeKey() {
    localStorage.removeItem(KEY_STORAGE);
    router.push("/setup");
  }

  return (
    <div className="relative grid min-h-[100svh] grid-rows-[auto_1fr_auto] overflow-hidden">
      {/* animated background */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop)", backgroundSize: "cover" }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="text-blue-500" size={18} />
          <span>Gemini Clone</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="rounded-full border px-3 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10">New chat</button>
          <button onClick={changeKey} className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"><KeyRound size={14}/>Change key</button>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-2">
        <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border bg-white/40 p-4 backdrop-blur dark:border-white/10 dark:bg-black/30">
          {messages.map((m) => (
            <div key={m.id} className={`mb-3 flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "model" && <div className="mt-1 rounded-full bg-blue-500/10 p-1 text-blue-600 dark:text-blue-400"><Bot size={16}/></div>}
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white/80 dark:bg-white/10"}`}>
                {m.content}
              </div>
              {m.role === "user" && <div className="mt-1 rounded-full bg-fuchsia-500/10 p-1 text-fuchsia-600 dark:text-fuchsia-400"><User size={16}/></div>}
            </div>
          ))}
          {loading && (
            <div className="mb-3 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/10 p-1 text-blue-600 dark:text-blue-400"><Bot size={16}/></div>
              <div className="rounded-2xl bg-white/80 px-4 py-2 text-sm dark:bg-white/10">
                <span className="inline-block animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-6">
        <div className="flex items-end gap-2 rounded-xl border bg-white/60 p-2 backdrop-blur dark:border-white/10 dark:bg-black/30">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask anything..."
            className="min-h-[44px] max-h-40 flex-1 resize-none bg-transparent px-3 py-2 outline-none"
          />
          <button
            aria-label="Send"
            disabled={!canSend}
            onClick={onSend}
            className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white transition enabled:hover:bg-blue-500 disabled:opacity-50"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}