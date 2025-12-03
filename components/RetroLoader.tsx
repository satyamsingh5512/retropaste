"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RetroLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 retro-grid opacity-20" />

      {/* Main Loader */}
      <div className="relative z-10">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer Glow Ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 border-4 border-terminal rounded-full blur-xl"
              style={{ width: "200px", height: "200px", margin: "-20px" }}
            />

            {/* Main Circle */}
            <div className="relative w-40 h-40 border-4 border-terminal rounded-full flex items-center justify-center bg-black shadow-terminal-lg">
              {/* Inner Rotating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-terminal/50 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-2 border-terminal/30 rounded-full"
              />

              {/* Center Symbol */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl terminal-glow-strong font-retro"
              >
                &gt;_
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-terminal text-2xl font-mono mb-4 terminal-glow">
            RETROPASTE v2.0
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-black border-2 border-terminal mx-auto mb-4 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-terminal shadow-terminal"
            />
          </div>

          {/* Loading Messages */}
          <motion.div
            className="text-terminal-dim text-sm font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING SYSTEM{dots}
          </motion.div>

          {/* Blinking Cursor */}
          <div className="flex justify-center mt-4">
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-3 h-5 bg-terminal"
            />
          </div>
        </motion.div>

        {/* Scanline Effect */}
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(transparent 0%, rgba(0, 255, 65, 0.1) 50%, transparent 100%)",
            height: "200%",
          }}
        />
      </div>
    </div>
  );
}
