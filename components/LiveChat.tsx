"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LiveChatProps {
  pasteContent: string;
  language: string;
}

export default function LiveChat({ pasteContent, language }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your AI code assistant. Ask me anything about this code!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          code: pasteContent,
          language,
          history: messages.slice(-5), // Last 5 messages for context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What does this code do?",
    "Are there any bugs?",
    "How can I improve this?",
    "Explain this code",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terminal border-2 border-terminal shadow-lg shadow-terminal/50 flex items-center justify-center text-black hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] glass-terminal flex flex-col"
          >
            {/* Header */}
            <div className="border-b-2 border-border-dim p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold terminal-glow text-retro">
                  &gt;&gt; AI ASSISTANT
                </h3>
                <p className="text-xs text-terminal-dim">Ask about the code</p>
              </div>
              <button
                onClick={() => setMessages([messages[0]])}
                className="text-terminal-dim hover:text-terminal text-xs"
                title="Clear chat"
              >
                [CLEAR]
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded ${
                      msg.role === "user"
                        ? "bg-terminal/20 border-l-2 border-terminal"
                        : "bg-card border-l-2 border-retro"
                    }`}
                  >
                    <div className="text-xs text-terminal-dim mb-1">
                      {msg.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="text-sm text-terminal whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div className="text-xs text-terminal-dim mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border-l-2 border-retro p-3 rounded">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-terminal rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-terminal rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-terminal rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="border-t-2 border-border-dim p-3">
                <div className="text-xs text-terminal-dim mb-2">
                  Quick questions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="text-xs px-2 py-1 border border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t-2 border-border-dim p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  disabled={loading}
                  className="flex-1 bg-black border-2 border-terminal-dim text-terminal px-3 py-2 text-sm focus:border-terminal outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-terminal text-black font-bold hover:bg-retro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
              <div className="text-xs text-terminal-dim mt-2">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
