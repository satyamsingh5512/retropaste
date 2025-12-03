"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="glass-terminal p-12 max-w-2xl border-error">
          {/* Error Icon */}
          <div className="text-6xl mb-6 animate-pulse">⚠️</div>

          <h1 className="text-4xl font-bold text-error text-retro mb-4">
            &gt; SYSTEM ERROR
          </h1>

          <p className="text-terminal-dim mb-6 text-lg">
            Something went wrong. The terminal encountered an unexpected error.
          </p>

          {/* Error Details */}
          <div className="bg-black/50 border border-error/30 p-4 mb-8 text-left">
            <div className="text-error text-sm font-mono">
              &gt; ERROR: {error.message}
            </div>
            {error.digest && (
              <div className="text-terminal-dim text-xs mt-2 font-mono">
                &gt; Digest: {error.digest}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-terminal px-6 py-3"
            >
              [TRY AGAIN]
            </button>
            <Link href="/">
              <button className="px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all">
                [GO HOME]
              </button>
            </Link>
          </div>

          <div className="mt-8 text-terminal-dim text-sm font-mono">
            &gt; If this persists, please report the issue
          </div>
        </div>
      </motion.div>
    </div>
  );
}
