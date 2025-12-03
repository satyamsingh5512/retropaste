"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DocsPage() {
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

          <Link href="/">
            <button className="btn-terminal px-6 py-2 text-sm">
              [BACK TO HOME]
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto p-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-terminal p-8 mb-6"
          >
            <h1 className="text-4xl font-bold terminal-glow text-retro mb-4">
              &gt;&gt; DOCUMENTATION
            </h1>
            <p className="text-terminal-dim text-lg">
              Everything you need to know about RetroPaste
            </p>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-terminal p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-terminal mb-4 border-b-2 border-border-dim pb-2">
              &gt; GETTING STARTED
            </h2>
            
            <div className="space-y-4 text-terminal-dim">
              <p>
                RetroPaste is a terminal-themed pastebin with AI-powered code analysis
                and collaborative editing features.
              </p>
              
              <div className="bg-card p-4 border-l-4 border-terminal">
                <h3 className="text-terminal font-bold mb-2">Quick Start:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Paste your code on the home page</li>
                  <li>Select language and visibility settings</li>
                  <li>Set expiration time (optional)</li>
                  <li>Click [CREATE PASTE]</li>
                  <li>Share the generated URL</li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-terminal p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-terminal mb-4 border-b-2 border-border-dim pb-2">
              &gt; FEATURES
            </h2>
            
            <div className="space-y-6">
              {/* AI Analysis */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">🤖 AI Code Analysis</h3>
                <p className="text-terminal-dim mb-2">
                  Automatic code analysis that detects:
                </p>
                <ul className="list-disc list-inside text-terminal-dim space-y-1 ml-4">
                  <li>Security vulnerabilities</li>
                  <li>Performance issues</li>
                  <li>Code quality suggestions</li>
                  <li>Best practice recommendations</li>
                </ul>
              </div>

              {/* Collaborative Editing */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">👥 Collaborative Editing</h3>
                <p className="text-terminal-dim mb-2">
                  Three permission modes for collaboration:
                </p>
                <ul className="list-disc list-inside text-terminal-dim space-y-1 ml-4">
                  <li><strong className="text-terminal">View Only:</strong> Read-only access</li>
                  <li><strong className="text-terminal">Edit:</strong> Manual save editing</li>
                  <li><strong className="text-terminal">Edit Together:</strong> Real-time collaborative editing with auto-save</li>
                </ul>
              </div>

              {/* Live Chat */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">💬 Live Chat Assistant</h3>
                <p className="text-terminal-dim mb-2">
                  AI-powered chat to help you understand code:
                </p>
                <ul className="list-disc list-inside text-terminal-dim space-y-1 ml-4">
                  <li>Ask questions about the code</li>
                  <li>Get explanations and suggestions</li>
                  <li>Find bugs and security issues</li>
                  <li>Learn best practices</li>
                </ul>
              </div>

              {/* Syntax Highlighting */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">🎨 Syntax Highlighting</h3>
                <p className="text-terminal-dim">
                  Support for 100+ programming languages with Monaco Editor
                </p>
              </div>

              {/* Privacy Options */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">🔒 Privacy Options</h3>
                <ul className="list-disc list-inside text-terminal-dim space-y-1 ml-4">
                  <li><strong className="text-terminal">Public:</strong> Listed and searchable</li>
                  <li><strong className="text-terminal">Unlisted:</strong> Only accessible via link</li>
                  <li><strong className="text-terminal">Private:</strong> Requires authentication</li>
                </ul>
              </div>

              {/* Expiration */}
              <div>
                <h3 className="text-lg font-bold text-retro mb-2">⏰ Auto-Expiration</h3>
                <p className="text-terminal-dim">
                  Set custom expiration times or view limits for your pastes
                </p>
              </div>
            </div>
          </motion.div>

          {/* API Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-terminal p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-terminal mb-4 border-b-2 border-border-dim pb-2">
              &gt; API USAGE
            </h2>
            
            <div className="space-y-4">
              <p className="text-terminal-dim">
                Create pastes programmatically using our API:
              </p>

              <div className="bg-black p-4 border-2 border-terminal-dim">
                <pre className="text-terminal text-sm overflow-x-auto">
{`curl -X POST https://retropaste.vercel.app/api/paste/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "console.log('Hello World');",
    "language": "javascript",
    "visibility": "public",
    "expiresIn": "24h"
  }'`}
                </pre>
              </div>

              <div className="bg-card p-4 border-l-4 border-retro">
                <h3 className="text-terminal font-bold mb-2">Response:</h3>
                <pre className="text-terminal-dim text-sm overflow-x-auto">
{`{
  "success": true,
  "shortId": "abc123",
  "url": "https://retropaste.vercel.app/abc123",
  "expiresAt": "2024-01-02T00:00:00.000Z"
}`}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-terminal p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-terminal mb-4 border-b-2 border-border-dim pb-2">
              &gt; KEYBOARD SHORTCUTS
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card p-3 border-l-2 border-terminal">
                <span className="text-terminal font-bold">Ctrl/Cmd + S</span>
                <p className="text-terminal-dim text-sm">Save paste</p>
              </div>
              <div className="bg-card p-3 border-l-2 border-terminal">
                <span className="text-terminal font-bold">Ctrl/Cmd + K</span>
                <p className="text-terminal-dim text-sm">Open chat</p>
              </div>
              <div className="bg-card p-3 border-l-2 border-terminal">
                <span className="text-terminal font-bold">Ctrl/Cmd + /</span>
                <p className="text-terminal-dim text-sm">Toggle comments</p>
              </div>
              <div className="bg-card p-3 border-l-2 border-terminal">
                <span className="text-terminal font-bold">Ctrl/Cmd + F</span>
                <p className="text-terminal-dim text-sm">Find in code</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-terminal p-8"
          >
            <h2 className="text-2xl font-bold text-terminal mb-4 border-b-2 border-border-dim pb-2">
              &gt; FAQ
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-terminal font-bold mb-2">Q: How long are pastes stored?</h3>
                <p className="text-terminal-dim">
                  A: Pastes are stored based on your expiration settings. Default is 24 hours,
                  but you can set custom durations or make them permanent.
                </p>
              </div>

              <div>
                <h3 className="text-terminal font-bold mb-2">Q: Is my code private?</h3>
                <p className="text-terminal-dim">
                  A: Yes! Use "Private" or "Unlisted" visibility. Private pastes require
                  authentication, while unlisted pastes are only accessible via direct link.
                </p>
              </div>

              <div>
                <h3 className="text-terminal font-bold mb-2">Q: Can I edit a paste after creating it?</h3>
                <p className="text-terminal-dim">
                  A: Yes! Change the permission mode to "Edit" or "Edit Together" to enable editing.
                </p>
              </div>

              <div>
                <h3 className="text-terminal font-bold mb-2">Q: What languages are supported?</h3>
                <p className="text-terminal-dim">
                  A: We support 100+ programming languages including JavaScript, Python, Java,
                  C++, Go, Rust, and many more.
                </p>
              </div>

              <div>
                <h3 className="text-terminal font-bold mb-2">Q: Is the AI analysis accurate?</h3>
                <p className="text-terminal-dim">
                  A: The AI provides helpful suggestions but should not replace manual code review.
                  Always verify recommendations before implementing them.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
