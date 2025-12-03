"use client";

import { motion } from "framer-motion";

interface StatsPanelProps {
  viewCount: number;
  createdAt: string;
  language: string;
  linesOfCode: number;
  characters: number;
}

export default function StatsPanel({
  viewCount,
  createdAt,
  language,
  linesOfCode,
  characters,
}: StatsPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    { label: "Views", value: viewCount.toLocaleString(), icon: "👁️" },
    { label: "Lines", value: linesOfCode.toLocaleString(), icon: "📝" },
    { label: "Characters", value: characters.toLocaleString(), icon: "🔤" },
    { label: "Language", value: language.toUpperCase(), icon: "💻" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-terminal p-6 mb-6"
    >
      <div className="border-b-2 border-border-dim pb-4 mb-4">
        <h3 className="text-xl font-bold terminal-glow text-retro">
          &gt;&gt; STATISTICS
        </h3>
        <p className="text-terminal-dim text-sm mt-1">
          Created: {formatDate(createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border-2 border-border-dim p-4 hover:border-terminal transition-all"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-terminal-dim text-xs mb-1">{stat.label}</div>
            <div className="text-terminal text-lg font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
