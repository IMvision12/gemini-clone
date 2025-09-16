"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const KEY_STORAGE = "GEMINI_API_KEY";

export default function SetupPage() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const existing = localStorage.getItem(KEY_STORAGE);
    if (existing) setApiKey(existing);
  }, []);

  function validate(key: string) {
    // Basic validation for Google API key format
    return /^AIza[0-9A-Za-z-_]{20,100}$/.test(key);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate(apiKey)) {
      setError("Please enter a valid Gemini API key (starts with AIza...)");
      return;
    }
    try {
      localStorage.setItem(KEY_STORAGE, apiKey.trim());
    } catch {}
    router.push("/chat");
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* animated background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl"
        animate={{ x: [0, 50, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ x: [0, -40, 30, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow" />
          <h1 className="text-lg font-semibold">Gemini Clone</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto grid max-w-xl gap-6 px-6 py-8">
        <div className="rounded-2xl border bg-white/50 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
          <h2 className="mb-2 text-xl font-semibold">Add your Gemini API key</h2>
          <p className="mb-4 text-sm text-muted-foreground">Your key is stored only in your browser and never sent to our servers.</p>
          <form onSubmit={onSubmit} className="grid gap-4">
            <input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/15"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-transform hover:translate-y-[-1px] hover:bg-blue-500 active:translate-y-[0]"
            >
              Save & Continue
            </button>
          </form>
        </div>

        <div className="text-xs text-muted-foreground">
          Don\'t have a key? Create one in Google AI Studio, enable Generative Language API, and paste here.
        </div>
      </main>
    </div>
  );
}