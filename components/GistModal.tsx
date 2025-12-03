"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GistModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
  onImport?: (code: string, language: string) => void;
}

export default function GistModal({ 
  isOpen, 
  onClose, 
  code, 
  language,
  onImport 
}: GistModalProps) {
  const [mode, setMode] = useState<"export" | "import">("export");
  const [gistUrl, setGistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      // Create anonymous gist (no auth required)
      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "Exported from RetroPaste",
          public: true,
          files: {
            [`code.${language}`]: {
              content: code,
            },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.html_url);
      } else {
        throw new Error("Failed to create gist");
      }
    } catch (err: any) {
      setError(err.message || "Failed to export to GitHub Gist");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      // Extract gist ID from URL
      const gistId = gistUrl.split("/").pop()?.split("?")[0];
      if (!gistId) {
        throw new Error("Invalid Gist URL");
      }

      const response = await fetch(`https://api.github.com/gists/${gistId}`);
      
      if (response.ok) {
        const data = await response.json();
        const files = Object.values(data.files) as any[];
        
        if (files.length > 0) {
          const file = files[0];
          const content = file.content;
          const filename = file.filename;
          const ext = filename.split(".").pop() || "txt";
          
          if (onImport) {
            onImport(content, ext);
          }
          setResult("✓ Gist imported successfully!");
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        throw new Error("Failed to fetch gist");
      }
    } catch (err: any) {
      setError(err.message || "Failed to import from GitHub Gist");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="glass-terminal p-6">
              <div className="border-b-2 border-border-dim pb-4 mb-6">
                <h2 className="text-2xl font-bold terminal-glow text-retro">
                  &gt;&gt; GITHUB GIST
                </h2>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("export")}
                  className={`flex-1 px-4 py-2 border-2 transition-all ${
                    mode === "export"
                      ? "border-terminal text-terminal bg-terminal/20"
                      : "border-terminal-dim text-terminal-dim"
                  }`}
                >
                  EXPORT
                </button>
                <button
                  onClick={() => setMode("import")}
                  className={`flex-1 px-4 py-2 border-2 transition-all ${
                    mode === "import"
                      ? "border-terminal text-terminal bg-terminal/20"
                      : "border-terminal-dim text-terminal-dim"
                  }`}
                >
                  IMPORT
                </button>
              </div>

              {mode === "export" ? (
                <div>
                  <p className="text-terminal-dim text-sm mb-4">
                    Export this code as a public GitHub Gist
                  </p>
                  
                  {result && (
                    <div className="bg-black border-2 border-terminal p-3 mb-4 rounded">
                      <div className="text-terminal-dim text-xs mb-2">
                        Gist created successfully!
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={result}
                          readOnly
                          className="flex-1 bg-transparent text-terminal text-sm border-none outline-none"
                        />
                        <button
                          onClick={copyToClipboard}
                          className="text-terminal hover:text-retro text-xs"
                        >
                          [COPY]
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-error/10 border-2 border-error p-3 mb-4 rounded">
                      <div className="text-error text-sm">{error}</div>
                    </div>
                  )}

                  <button
                    onClick={handleExport}
                    disabled={loading}
                    className="w-full btn-terminal px-6 py-3 disabled:opacity-50"
                  >
                    {loading ? "[CREATING...]" : "[CREATE GIST]"}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-terminal-dim text-sm mb-4">
                    Import code from a GitHub Gist URL
                  </p>

                  <input
                    type="text"
                    value={gistUrl}
                    onChange={(e) => setGistUrl(e.target.value)}
                    placeholder="https://gist.github.com/..."
                    className="w-full bg-black border-2 border-terminal-dim text-terminal px-4 py-3 mb-4 focus:border-terminal outline-none"
                  />

                  {result && (
                    <div className="bg-terminal/10 border-2 border-terminal p-3 mb-4 rounded">
                      <div className="text-terminal text-sm">{result}</div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-error/10 border-2 border-error p-3 mb-4 rounded">
                      <div className="text-error text-sm">{error}</div>
                    </div>
                  )}

                  <button
                    onClick={handleImport}
                    disabled={loading || !gistUrl}
                    className="w-full btn-terminal px-6 py-3 disabled:opacity-50"
                  >
                    {loading ? "[IMPORTING...]" : "[IMPORT GIST]"}
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full mt-3 px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all"
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
