"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";

export default function NewPastePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [visibility, setVisibility] = useState("public");
  const [expiresIn, setExpiresIn] = useState("24h");
  const [maxViews, setMaxViews] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const languages = [
    "javascript", "typescript", "python", "java", "cpp", "c", "csharp",
    "go", "rust", "php", "ruby", "swift", "kotlin", "sql", "html", "css",
    "json", "yaml", "markdown", "plaintext"
  ];

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("> ERROR: Code content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/paste/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: code,
          language,
          visibility,
          expiresIn,
          maxViews: maxViews || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/${data.shortId}`);
      } else {
        alert(`> ERROR: ${data.error}`);
      }
    } catch (error) {
      alert("> ERROR: Failed to create paste");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className="flex items-center gap-4">
            <span className="text-terminal-dim text-sm">
              {code.length} chars
            </span>
            <div className="h-6 w-px bg-border-dim" />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-terminal px-6 py-2 text-sm"
            >
              {isSubmitting ? "SAVING..." : "[SAVE PASTE]"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 flex h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="w-[280px] glass-terminal border-r-2 overflow-y-auto"
        >
          <div className="p-6">
            {/* Settings Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold terminal-glow text-retro">
                &gt; SETTINGS
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-terminal-dim hover:text-terminal"
              >
                {showSettings ? "[-]" : "[+]"}
              </button>
            </div>

            {showSettings && (
              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-terminal-dim text-sm mb-2">
                    &gt; SYNTAX:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-terminal w-full text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiration Time */}
                <div>
                  <label className="block text-terminal-dim text-sm mb-3">
                    &gt; EXPIRATION TIME:
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "10m", label: "10 minutes" },
                      { value: "1h", label: "1 hour" },
                      { value: "24h", label: "24 hours" },
                      { value: "7d", label: "7 days" },
                      { value: "never", label: "Never" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="expiration"
                          value={option.value}
                          checked={expiresIn === option.value}
                          onChange={(e) => setExpiresIn(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-terminal-dim group-hover:text-terminal text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-terminal-dim text-sm mb-3">
                    &gt; VISIBILITY:
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "public", label: "Public" },
                      { value: "unlisted", label: "Unlisted" },
                      { value: "private", label: "Private" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={visibility === option.value}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-terminal-dim group-hover:text-terminal text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Max Views */}
                <div>
                  <label className="block text-terminal-dim text-sm mb-2">
                    &gt; MAX VIEWS (optional):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Unlimited"
                    value={maxViews || ""}
                    onChange={(e) =>
                      setMaxViews(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="input-terminal w-full text-sm"
                  />
                  <p className="text-terminal-dim text-xs mt-1">
                    Paste will self-destruct after N views
                  </p>
                </div>
              </div>
            )}

            {/* Recent Pastes */}
            <div className="mt-8 pt-8 border-t border-border-dim">
              <h3 className="text-sm font-bold terminal-glow mb-3">
                &gt; RECENT PASTES
              </h3>
              <p className="text-terminal-dim text-xs">
                No recent pastes yet
              </p>
            </div>
          </div>
        </motion.aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="glass-terminal border-b-2 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-terminal-dim text-sm">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="w-3 h-3 rounded-full bg-terminal"></span>
              <span className="ml-4">user@retropaste:~$ new_paste</span>
            </div>
            <div className="text-terminal-dim text-sm">
              {language.toUpperCase()}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="text-terminal-dim">Loading editor...</div>
                </div>
              }
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: true },
                lineNumbers: "on",
                rulers: [80, 120],
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
              onMount={(editor) => {
                // Custom terminal theme
                editor.updateOptions({
                  theme: "vs-dark",
                });
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="glass-terminal border-t-2 px-6 py-4 flex items-center justify-between">
            <div className="text-terminal-dim text-sm">
              &gt; Ready to share your code
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCode("")}
                className="px-4 py-2 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm"
              >
                [CLEAR]
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-terminal px-6 py-2 text-sm"
              >
                {isSubmitting ? "ANALYZING..." : "[CREATE PASTE]"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
