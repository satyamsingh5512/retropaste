"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Editor from "@monaco-editor/react";

interface PasteData {
  shortId: string;
  content: string;
  language: string;
  visibility: string;
  createdAt: string;
  expiresAt?: string;
  viewCount: number;
  viewsRemaining: number | null;
  timeRemaining: string;
  aiAnalysis?: {
    vulnerabilities: Array<{
      type: string;
      severity: string;
      line: number;
      fix: string;
    }>;
    suggestions: Array<{
      category: string;
      improvement: string;
      line: number;
    }>;
    performanceScore: number;
    analyzedAt: string;
  };
}

export default function PasteViewPage() {
  const params = useParams();
  const router = useRouter();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
    try {
      const response = await fetch(`/api/paste/${params.shortId}`);
      const data = await response.json();

      if (response.ok) {
        setPaste(data);
      } else {
        setError(data.error || "Paste not found");
      }
    } catch (err) {
      setError("Failed to load paste");
    } finally {
      setLoading(false);
    }
    };

    fetchPaste();
  }, [params.shortId]);

  const handleCopy = async () => {
    if (paste) {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm("> CONFIRM: Delete this paste?")) return;

    try {
      const response = await fetch(`/api/paste/${params.shortId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("> ERROR: Failed to delete paste");
      }
    } catch (err) {
      alert("> ERROR: Failed to delete paste");
    }
  };

  const handleRaw = () => {
    const blob = new Blob([paste?.content || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">&gt;_</div>
          <div className="text-terminal-dim">LOADING PASTE...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-error">✗</div>
          <div className="text-error text-xl mb-4">&gt; ERROR: {error}</div>
          <Link href="/">
            <button className="btn-terminal px-6 py-3">
              [RETURN HOME]
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-terminal border-b-2 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">&gt;_</span>
            <span className="text-xl font-bold terminal-glow text-retro">
              RETROPASTE
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-terminal-dim">
              Views: {paste?.viewCount}
              {paste?.viewsRemaining && ` / ${paste.viewsRemaining} left`}
            </span>
            <span className="text-terminal-dim">
              Expires: {paste?.timeRemaining}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-terminal p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-terminal-dim text-sm">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="w-3 h-3 rounded-full bg-terminal"></span>
              <span className="ml-4">
                {paste?.language.toUpperCase()} • {paste?.visibility.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm"
              >
                {copied ? "[COPIED!]" : "[COPY]"}
              </button>
              <button
                onClick={handleRaw}
                className="px-4 py-2 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm"
              >
                [RAW]
              </button>
              <button
                onClick={() => router.push("/paste/new")}
                className="px-4 py-2 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm"
              >
                [FORK]
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border-2 border-error text-error hover:bg-error hover:text-black transition-all text-sm"
              >
                [DELETE]
              </button>
            </div>
          </motion.div>

          {/* Code Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-terminal mb-6"
          >
            <div className="h-[500px]">
              <Editor
                height="100%"
                language={paste?.language}
                value={paste?.content}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: true },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </motion.div>

          {/* AI Analysis Panel */}
          {paste?.aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-terminal p-6"
            >
              <div className="border-b-2 border-border-dim pb-4 mb-6">
                <h2 className="text-2xl font-bold terminal-glow text-retro">
                  &gt;&gt; AI CODE ANALYSIS COMPLETE
                </h2>
              </div>

              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass-terminal p-4">
                  <div className="text-terminal-dim text-sm mb-2">
                    VULNERABILITIES
                  </div>
                  <div className="text-3xl font-bold">
                    {paste.aiAnalysis.vulnerabilities.length > 0 ? (
                      <span className="text-error">
                        ⚠ {paste.aiAnalysis.vulnerabilities.length}
                      </span>
                    ) : (
                      <span className="text-terminal">✓ 0</span>
                    )}
                  </div>
                </div>

                <div className="glass-terminal p-4">
                  <div className="text-terminal-dim text-sm mb-2">
                    PERFORMANCE SCORE
                  </div>
                  <div className="text-3xl font-bold terminal-glow">
                    {paste.aiAnalysis.performanceScore}/100
                  </div>
                </div>

                <div className="glass-terminal p-4">
                  <div className="text-terminal-dim text-sm mb-2">
                    COMPLEXITY
                  </div>
                  <div className="text-3xl font-bold text-warning">
                    {paste.aiAnalysis.performanceScore >= 80
                      ? "LOW"
                      : paste.aiAnalysis.performanceScore >= 60
                      ? "MEDIUM"
                      : "HIGH"}
                  </div>
                </div>
              </div>

              {/* Vulnerabilities */}
              {paste.aiAnalysis.vulnerabilities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-error mb-4">
                    &gt; SECURITY VULNERABILITIES
                  </h3>
                  <div className="space-y-3">
                    {paste.aiAnalysis.vulnerabilities.map((vuln, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-error bg-error/10 p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-bold text-error">
                            {vuln.type}
                          </div>
                          <div className="text-xs px-2 py-1 bg-error text-black rounded">
                            {vuln.severity.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-terminal-dim text-sm mb-2">
                          Line {vuln.line}
                        </div>
                        <div className="text-terminal text-sm">
                          💡 Fix: {vuln.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {paste.aiAnalysis.suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-warning mb-4">
                    &gt; OPTIMIZATION SUGGESTIONS
                  </h3>
                  <div className="space-y-3">
                    {paste.aiAnalysis.suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-warning bg-warning/10 p-4"
                      >
                        <div className="font-bold text-warning mb-2">
                          {suggestion.category}
                        </div>
                        <div className="text-terminal-dim text-sm mb-2">
                          Line {suggestion.line}
                        </div>
                        <div className="text-terminal text-sm">
                          {suggestion.improvement}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Issues */}
              {paste.aiAnalysis.vulnerabilities.length === 0 &&
                paste.aiAnalysis.suggestions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✓</div>
                    <div className="text-terminal text-xl">
                      No issues detected! Your code looks great.
                    </div>
                  </div>
                )}
            </motion.div>
          )}

          {/* Loading AI Analysis */}
          {!paste?.aiAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-terminal p-8 text-center"
            >
              <div className="text-4xl mb-4 animate-pulse">🤖</div>
              <div className="text-terminal-dim">
                AI analysis in progress...
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
