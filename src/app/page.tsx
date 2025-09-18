"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const KEY_STORAGE = "GEMINI_API_KEY";

export default function HomePage() {
  const [hasKey, setHasKey] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try { 
      setHasKey(!!localStorage.getItem(KEY_STORAGE)); 
    } catch {}
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* animated gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1920&auto=format&fit=crop)",
          backgroundSize: "cover",
        }}
      />

      {/* floating orbs */}
      <motion.div
        className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl"
        animate={{ x: [0, 40, -30, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl"
        animate={{ x: [0, -35, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white shadow">
            <Sparkles size={16} />
          </span>
          <span className="text-base font-semibold">Gemini Clone</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-14 sm:py-20 md:grid-cols-2">
        <div className="space-y-6">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Chat with Gemini
            <span className="block bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
              Fast. Simple. Beautiful.
            </span>
          </motion.h1>
          <motion.p
            className="max-w-prose text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A minimal Gemini chat experience that runs entirely in your browser.
            Provide your own API key, toggle themes, and start asking questions.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Link
              href="/setup"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow transition hover:translate-y-[-2px] hover:bg-blue-500 active:translate-y-0"
            >
              {isClient ? (hasKey ? "Update API Key" : "Add API Key") : "Add API Key"}
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              Open Chat <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="text-xs text-muted-foreground">
            Your API key stays in your browser. No account required.
          </div>
        </div>

        <motion.div
          className="relative hidden overflow-hidden rounded-2xl border bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 md:block"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            alt="Futuristic waves"
            src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop"
            className="h-80 w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 to-transparent dark:from-black/60" />
        </motion.div>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-xs text-muted-foreground">
        Built with Next.js 15, Tailwind, and framer-motion.
      </footer>
    </div>
  );
}