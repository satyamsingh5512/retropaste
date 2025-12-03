import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroPaste - Terminal Pastebin with AI Analysis",
  description: "Share code snippets with retro terminal aesthetics and AI-powered analysis",
  keywords: ["pastebin", "code sharing", "terminal", "retro", "AI analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt-effect">
        {children}
      </body>
    </html>
  );
}
