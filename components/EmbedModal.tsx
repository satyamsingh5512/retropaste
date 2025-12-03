"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortId: string;
}

export default function EmbedModal({ isOpen, onClose, shortId }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [height, setHeight] = useState("400");

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `${baseUrl}/embed/${shortId}?theme=${theme}&height=${height}`;
  
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${height}px" frameborder="0" style="border: 2px solid #00ff00; border-radius: 4px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="glass-terminal p-6">
              <div className="border-b-2 border-border-dim pb-4 mb-6">
                <h2 className="text-2xl font-bold terminal-glow text-retro">
                  &gt;&gt; EMBED CODE
                </h2>
                <p className="text-terminal-dim text-sm mt-2">
                  Embed this paste in your website or blog
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-terminal-dim text-sm mb-2 block">
                    Theme:
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                    className="w-full bg-black border-2 border-terminal-dim text-terminal px-3 py-2 focus:border-terminal outline-none"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div>
                  <label className="text-terminal-dim text-sm mb-2 block">
                    Height (px):
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="200"
                    max="800"
                    className="w-full bg-black border-2 border-terminal-dim text-terminal px-3 py-2 focus:border-terminal outline-none"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <div className="text-terminal-dim text-sm mb-2">Preview:</div>
                <div className="bg-black border-2 border-terminal-dim p-4 rounded">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="200px"
                    className="border-2 border-terminal rounded"
                    title="Embed Preview"
                  />
                </div>
              </div>

              {/* Embed Code */}
              <div className="mb-6">
                <div className="text-terminal-dim text-sm mb-2">Embed Code:</div>
                <div className="bg-black border-2 border-terminal-dim p-4 rounded relative">
                  <pre className="text-terminal text-xs overflow-x-auto whitespace-pre-wrap break-all">
                    {iframeCode}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-3 py-1 bg-terminal text-black text-xs hover:bg-retro transition-colors"
                  >
                    {copied ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all"
              >
                [CLOSE]
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
