"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import RetroLoader from "@/components/RetroLoader";
import { useRetroSound } from "@/hooks/useRetroSound";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false); // Changed to false
  const [bootComplete, setBootComplete] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  
  // Safely initialize sound hooks
  const soundHooks = useRetroSound();
  const playClick = soundHooks?.playClick || (() => {});
  const playHover = soundHooks?.playHover || (() => {});

  const bootSequence = [
    "> BIOS INITIALIZED...",
    "> LOADING KERNEL 5.15.0",
    "> MOUNTING FILESYSTEMS...",
    "> STARTING RETROPASTE v2.0",
    "> SYSTEM READY █",
  ];

  useEffect(() => {
    if (currentLine < bootSequence.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (currentLine >= bootSequence.length) {
      const timer = setTimeout(() => setBootComplete(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentLine, bootSequence.length]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Retro Effects */}
      <div className="retro-grid fixed inset-0" />
      <div className="retro-scanline" />
      <div className="vhs-noise" />
      
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-terminal border-b-2">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              &gt;_
            </motion.span>
            <span className="text-xl font-bold terminal-glow text-retro">
              RETROPASTE
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/paste/new"
              className="text-terminal hover:terminal-glow-strong transition-all"
            >
              NEW PASTE
            </Link>
            <Link
              href="/docs"
              className="text-terminal-dim hover:text-terminal transition-all"
            >
              DOCS
            </Link>
            <div className="h-6 w-px bg-border-dim" />
            <button
              onClick={() => {
                playClick();
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              onMouseEnter={playHover}
              className="text-terminal-dim hover:text-terminal transition-all"
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                playClick();
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
              onMouseEnter={playHover}
              className="btn-terminal px-4 py-2 text-sm retro-button"
            >
              REGISTER
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Boot Sequence */}
          {!bootComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12 font-mono text-sm"
            >
              {bootSequence.slice(0, currentLine).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-terminal-dim mb-1"
                >
                  {line}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Main Hero Content */}
          {bootComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Glitch Logo */}
              <motion.h1
                className="text-7xl md:text-8xl font-bold mb-6 text-retro glitch-text terminal-glow-strong"
                data-text="RETROPASTE"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                RETROPASTE
              </motion.h1>

              <motion.p
                className="text-2xl md:text-3xl mb-4 text-terminal-dim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                &gt; RESURRECT YOUR CODE SHARING
              </motion.p>

              <motion.p
                className="text-lg text-terminal-dim mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Terminal-themed pastebin with AI-powered code analysis.
                <br />
                Share snippets that self-destruct. Embrace the retro.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex gap-6 justify-center flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/paste/new">
                  <motion.button
                    className="btn-terminal px-8 py-4 text-lg retro-button neon-pulse"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    [ENTER THE TERMINAL]
                  </motion.button>
                </Link>

                <Link href="/docs">
                  <motion.button
                    className="px-8 py-4 text-lg border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all retro-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    [VIEW DOCS]
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex gap-12 justify-center mt-16 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div>
                  <div className="text-3xl font-bold terminal-glow">10K+</div>
                  <div className="text-terminal-dim mt-1">PASTES</div>
                </div>
                <div>
                  <div className="text-3xl font-bold terminal-glow">AI</div>
                  <div className="text-terminal-dim mt-1">POWERED</div>
                </div>
                <div>
                  <div className="text-3xl font-bold terminal-glow">100%</div>
                  <div className="text-terminal-dim mt-1">RETRO</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Features Grid */}
          {bootComplete && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="grid md:grid-cols-3 gap-6 mt-32"
            >
              <FeatureCard
                icon="🤖"
                title="AI CODE ANALYSIS"
                description="Instant vulnerability detection, performance optimization suggestions, and code quality scoring powered by advanced AI"
                delay={0}
              />
              <FeatureCard
                icon="⏱️"
                title="EPHEMERAL PASTES"
                description="Self-destructing snippets with time-based or view-based expiration. Your code vanishes like it never existed"
                delay={0.1}
              />
              <FeatureCard
                icon="🎨"
                title="SYNTAX HIGHLIGHTING"
                description="Monaco editor with 50+ languages, intelligent auto-detection, and retro terminal color schemes"
                delay={0.2}
              />
            </motion.div>
          )}

          {/* Demo Section */}
          {bootComplete && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-32"
            >
              <h2 className="text-4xl font-bold text-center mb-12 text-retro terminal-glow">
                &gt; SEE IT IN ACTION
              </h2>

              <div className="glass-terminal p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4 text-terminal-dim text-sm">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span className="w-3 h-3 rounded-full bg-warning"></span>
                  <span className="w-3 h-3 rounded-full bg-terminal"></span>
                  <span className="ml-4">user@retropaste:~$</span>
                </div>

                <pre className="text-terminal font-mono text-sm overflow-x-auto">
                  <code>{`> paste create --language javascript --expires 1h

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

> AI ANALYSIS COMPLETE
✓ Performance Score: 45/100
⚠ Warning: Exponential time complexity detected
💡 Suggestion: Use memoization or iterative approach

> Paste created: https://retropaste.dev/a8Kx9mP2
> Expires in: 59 minutes 58 seconds`}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border-dim py-8 mt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-terminal-dim text-sm">
            &gt; BUILT WITH 💚 FOR THE TERMINAL LOVERS
          </p>
          <p className="text-terminal-dim text-xs mt-2">
            © 2024 RetroPaste. Open Source. MIT License.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "signup" : "login")}
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-terminal p-8 group cursor-pointer"
    >
      {/* ASCII Art Border */}
      <div className="text-terminal-dim text-xs mb-4 font-mono">
        ┌{'─'.repeat(30)}┐
      </div>

      <div className="text-5xl mb-4">{icon}</div>

      <h3 className="text-xl font-bold mb-3 terminal-glow text-retro group-hover:terminal-glow-strong transition-all">
        {title}
      </h3>

      <p className="text-terminal-dim leading-relaxed text-sm">
        {description}
      </p>

      <div className="text-terminal-dim text-xs mt-4 font-mono">
        └{'─'.repeat(30)}┘
      </div>
    </motion.div>
  );
}

function MatrixRain() {
  const [chars, setChars] = useState<Array<{ char: string; left: number; delay: number }>>([]);

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const newChars = Array.from({ length: 30 }, () => ({
      char: characters[Math.floor(Math.random() * characters.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setChars(newChars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
      {chars.map((item, i) => (
        <motion.div
          key={i}
          className="matrix-char absolute"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
          initial={{ y: -20 }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
}
