"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="glass-terminal p-12 max-w-2xl">
          {/* ASCII Art 404 */}
          <pre className="text-error text-sm mb-8 font-mono">
{`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═████╗██║  ██║
  ███████║██║██╔██║███████║
  ╚════██║████╔╝██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝
`}
          </pre>

          <h1 className="text-4xl font-bold terminal-glow text-retro mb-4">
            &gt; PAGE NOT FOUND
          </h1>

          <p className="text-terminal-dim mb-8 text-lg">
            The page you're looking for has vanished into the void.
            <br />
            Perhaps it expired, or never existed at all.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/">
              <button className="btn-terminal px-6 py-3">
                [RETURN HOME]
              </button>
            </Link>
            <Link href="/paste/new">
              <button className="px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all">
                [CREATE PASTE]
              </button>
            </Link>
          </div>

          <div className="mt-8 text-terminal-dim text-sm font-mono">
            &gt; Error Code: 404_PASTE_NOT_FOUND
          </div>
        </div>
      </motion.div>
    </div>
  );
}
