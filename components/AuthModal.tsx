"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSwitchMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email, password }
        : { email, password, username };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Authentication failed");
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      onClose();
      
      // Redirect to paste editor
      window.location.href = "/paste/new";
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <div className="glass-terminal p-10 border-[3px] shadow-terminal-lg">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold terminal-glow text-retro">
                      {mode === "login" ? "&gt; LOGIN" : "&gt; REGISTER"}
                    </h2>
                    <button
                      onClick={onClose}
                      className="text-terminal-dim hover:text-error text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-terminal-dim text-sm font-mono">
                    &gt; user@retropaste:~$ enter_credentials
                  </div>
                </div>

                {/* Demo Credentials */}
                {mode === "login" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 border-2 border-terminal bg-terminal/10 p-4 rounded"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-terminal text-sm font-bold">
                        🎯 DEMO CREDENTIALS
                      </div>
                      <div className="text-terminal-dim text-xs">
                        For Judges/Testing
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-black/50 p-2 rounded">
                        <div className="text-terminal text-xs font-mono">
                          demo@retropaste.dev
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail("demo@retropaste.dev");
                            navigator.clipboard.writeText("demo@retropaste.dev");
                          }}
                          className="text-terminal hover:text-retro text-xs px-2 py-1 border border-terminal-dim hover:border-terminal transition-all"
                        >
                          [COPY]
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-black/50 p-2 rounded">
                        <div className="text-terminal text-xs font-mono">
                          demo123456
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPassword("demo123456");
                            navigator.clipboard.writeText("demo123456");
                          }}
                          className="text-terminal hover:text-retro text-xs px-2 py-1 border border-terminal-dim hover:border-terminal transition-all"
                        >
                          [COPY]
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("demo@retropaste.dev");
                          setPassword("demo123456");
                        }}
                        className="w-full text-terminal hover:text-retro text-xs py-2 border border-terminal-dim hover:border-terminal transition-all mt-2"
                      >
                        [AUTO-FILL DEMO CREDENTIALS]
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username (signup only) */}
                  {mode === "signup" && (
                    <div>
                      <label className="block text-terminal-dim text-sm mb-2 font-mono">
                        &gt; username:
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-terminal w-full h-12"
                        placeholder="hacker_elite"
                        autoComplete="username"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-terminal-dim text-sm mb-2 font-mono">
                      &gt; email:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-terminal w-full h-12"
                      placeholder="user@terminal.dev"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-terminal-dim text-sm mb-2 font-mono">
                      &gt; password:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="input-terminal w-full h-12 pr-12"
                        placeholder="••••••••"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-dim hover:text-terminal"
                      >
                        {showPassword ? "[HIDE]" : "[SHOW]"}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-l-4 border-error bg-error/10 p-3"
                    >
                      <div className="text-error text-sm font-mono">
                        &gt; ERROR: {error}
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-terminal w-full h-[52px] text-base"
                  >
                    {isSubmitting
                      ? "[AUTHENTICATING...]"
                      : mode === "login"
                      ? "[LOGIN]"
                      : "[CREATE ACCOUNT]"}
                  </button>
                </form>

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                  <button
                    onClick={onSwitchMode}
                    className="text-terminal-dim hover:text-terminal text-sm font-mono"
                  >
                    {mode === "login"
                      ? "&gt; Need an account? [REGISTER]"
                      : "&gt; Already have an account? [LOGIN]"}
                  </button>
                </div>

                {/* Social Login (Optional) */}
                <div className="mt-8 pt-8 border-t border-border-dim">
                  <div className="text-terminal-dim text-sm text-center mb-4 font-mono">
                    &gt; OR CONTINUE WITH:
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="px-4 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm font-mono"
                    >
                      [GITHUB]
                    </button>
                    <button
                      type="button"
                      className="px-4 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all text-sm font-mono"
                    >
                      [GOOGLE]
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
