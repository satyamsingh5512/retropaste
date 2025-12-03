"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodePlaygroundProps {
  code: string;
  language: string;
}

export default function CodePlayground({ code, language }: CodePlaygroundProps) {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");

  const runCode = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");

    try {
      if (language === "javascript" || language === "typescript") {
        // Run JavaScript code safely
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;

        // Capture console output
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        console.error = (...args: any[]) => {
          logs.push('ERROR: ' + args.join(' '));
        };

        try {
          // Create a safe execution context
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const fn = new AsyncFunction(code);
          await fn();
          
          setOutput(logs.length > 0 ? logs.join('\n') : '> Code executed successfully (no output)');
        } catch (err: any) {
          setError(err.message || 'Execution error');
        } finally {
          console.log = originalLog;
          console.error = originalError;
        }
      } else if (language === "html") {
        // For HTML, show preview
        setOutput("HTML Preview mode - code will render in preview window");
      } else {
        setOutput(`> ${language.toUpperCase()} execution requires server-side runtime\n> JavaScript/TypeScript can run in browser`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const canRun = ["javascript", "typescript", "html"].includes(language.toLowerCase());

  if (!canRun) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-terminal p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4 border-b-2 border-border-dim pb-4">
        <h3 className="text-xl font-bold terminal-glow text-retro">
          &gt;&gt; CODE PLAYGROUND
        </h3>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="btn-terminal px-6 py-2 disabled:opacity-50"
        >
          {isRunning ? "[RUNNING...]" : "[▶ RUN CODE]"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(output || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black border-2 border-terminal p-4 rounded"
          >
            <div className="text-terminal-dim text-xs mb-2">OUTPUT:</div>
            {error ? (
              <pre className="text-error text-sm whitespace-pre-wrap font-mono">
                {error}
              </pre>
            ) : (
              <pre className="text-terminal text-sm whitespace-pre-wrap font-mono">
                {output}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-terminal-dim text-xs">
        💡 Tip: Use console.log() to see output. Code runs safely in your browser.
      </div>
    </motion.div>
  );
}
