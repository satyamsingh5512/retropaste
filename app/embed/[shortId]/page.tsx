"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";

interface PasteData {
  content: string;
  language: string;
}

export default function EmbedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = searchParams.get("theme") || "dark";

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/paste/${params.shortId}`);
        const data = await response.json();

        if (response.ok) {
          setPaste(data);
        }
      } catch (err) {
        console.error("Failed to load paste");
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [params.shortId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-terminal">Loading...</div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-error">Paste not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Editor
        height="100%"
        language={paste.language}
        value={paste.content}
        theme={theme === "light" ? "vs-light" : "vs-dark"}
        options={{
          readOnly: true,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
