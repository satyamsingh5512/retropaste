"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: string;
  shortId: string;
  onUpdate: (mode: string) => void;
}

export default function PermissionsModal({
  isOpen,
  onClose,
  currentMode,
  shortId,
  onUpdate,
}: PermissionsModalProps) {
  const [mode, setMode] = useState(currentMode);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/paste/${shortId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      if (response.ok) {
        onUpdate(mode);
        onClose();
      }
    } catch (error) {
      console.error("Failed to update permissions:", error);
    } finally {
      setLoading(false);
    }
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
                  &gt;&gt; PERMISSIONS
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="mode"
                    value="view-only"
                    checked={mode === "view-only"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-terminal group-hover:text-retro transition-colors">
                      👁️ VIEW ONLY
                    </div>
                    <div className="text-sm text-terminal-dim">
                      Users can only view the code, no editing allowed
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="mode"
                    value="edit"
                    checked={mode === "edit"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-terminal group-hover:text-retro transition-colors">
                      ✏️ EDIT
                    </div>
                    <div className="text-sm text-terminal-dim">
                      Users can edit and save changes (no real-time sync)
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="mode"
                    value="edit-together"
                    checked={mode === "edit-together"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-terminal group-hover:text-retro transition-colors">
                      👥 EDIT TOGETHER
                    </div>
                    <div className="text-sm text-terminal-dim">
                      Real-time collaborative editing with live cursors
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 btn-terminal px-6 py-3 disabled:opacity-50"
                >
                  {loading ? "[SAVING...]" : "[SAVE]"}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all"
                >
                  [CANCEL]
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
