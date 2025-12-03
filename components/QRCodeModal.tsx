"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && url) {
      // Generate QR code using QR Server API (free, no API key needed)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'retropaste-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  &gt;&gt; QR CODE
                </h2>
                <p className="text-terminal-dim text-sm mt-2">
                  Scan to open this paste on mobile
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-lg">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="text-terminal animate-pulse">
                        Generating...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black border-2 border-terminal-dim p-3 mb-6 rounded">
                <div className="text-terminal-dim text-xs mb-1">URL:</div>
                <div className="text-terminal text-sm break-all">{url}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 btn-terminal px-6 py-3"
                >
                  [DOWNLOAD]
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-terminal-dim text-terminal-dim hover:border-terminal hover:text-terminal transition-all"
                >
                  [CLOSE]
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
