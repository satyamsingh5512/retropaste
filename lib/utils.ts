import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate short ID for paste URLs
export function generateShortId(length: number = 8): string {
  return nanoid(length);
}

// Generate API key
export function generateApiKey(): string {
  return `rp_${nanoid(32)}`;
}

// JWT functions
export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Calculate expiration date
export function calculateExpiresAt(expiresIn: string): Date | undefined {
  const now = new Date();
  
  switch (expiresIn) {
    case '10m':
      return new Date(now.getTime() + 10 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000);
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'never':
      return undefined;
    default:
      return new Date(now.getTime() + 60 * 60 * 1000); // Default 1 hour
  }
}

// Format time remaining
export function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// Detect programming language from content
export function detectLanguage(content: string): string {
  // Simple heuristics for language detection
  if (content.includes('function') && content.includes('{')) return 'javascript';
  if (content.includes('def ') && content.includes(':')) return 'python';
  if (content.includes('<?php')) return 'php';
  if (content.includes('public class') || content.includes('import java')) return 'java';
  if (content.includes('#include') || content.includes('int main')) return 'cpp';
  if (content.includes('fn ') && content.includes('->')) return 'rust';
  if (content.includes('package main') && content.includes('func')) return 'go';
  if (content.includes('<!DOCTYPE html>') || content.includes('<html')) return 'html';
  if (content.includes('{') && content.includes('}') && content.includes(':')) return 'json';
  
  return 'plaintext';
}
