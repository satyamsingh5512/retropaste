// AI Code Analysis Service
// This is a mock implementation. In production, integrate with OpenAI or Claude API

interface Vulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  line: number;
  fix: string;
}

interface Suggestion {
  category: string;
  improvement: string;
  line: number;
}

interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  suggestions: Suggestion[];
  performanceScore: number;
}

export async function analyzeCode(
  code: string,
  language: string
): Promise<AnalysisResult> {
  // Reduced delay for faster response
  await new Promise(resolve => setTimeout(resolve, 500));

  const vulnerabilities: Vulnerability[] = [];
  const suggestions: Suggestion[] = [];
  let performanceScore = 85;

  // Limit code analysis to first 5000 characters for performance
  const limitedCode = code.substring(0, 5000);
  const lines = limitedCode.split('\n');

  // Check for SQL injection vulnerabilities
  if (limitedCode.includes('SELECT') && limitedCode.includes('+')) {
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'critical',
      line: lines.findIndex(l => l.includes('SELECT')) + 1,
      fix: 'Use parameterized queries or prepared statements',
    });
    performanceScore -= 20;
  }

  // Check for eval usage
  if (limitedCode.includes('eval(')) {
    vulnerabilities.push({
      type: 'Code Injection',
      severity: 'critical',
      line: lines.findIndex(l => l.includes('eval(')) + 1,
      fix: 'Avoid using eval(). Use safer alternatives like JSON.parse()',
    });
    performanceScore -= 15;
  }

  // Check for console.log in production
  if (limitedCode.includes('console.log')) {
    suggestions.push({
      category: 'Best Practices',
      improvement: 'Remove console.log statements before production',
      line: lines.findIndex(l => l.includes('console.log')) + 1,
    });
    performanceScore -= 5;
  }

  // Check for inefficient loops
  const forCount = (limitedCode.match(/\bfor\b/g) || []).length;
  if (forCount >= 2) {
    suggestions.push({
      category: 'Performance',
      improvement: 'Nested loops detected. Consider optimizing with better data structures',
      line: lines.findIndex(l => l.includes('for')) + 1,
    });
    performanceScore -= 10;
  }

  // Check for missing error handling
  if ((limitedCode.includes('fetch') || limitedCode.includes('axios')) && !limitedCode.includes('catch')) {
    suggestions.push({
      category: 'Error Handling',
      improvement: 'Add error handling for async operations',
      line: lines.findIndex(l => l.includes('fetch') || l.includes('axios')) + 1,
    });
    performanceScore -= 10;
  }

  // Check for hardcoded credentials (optimized with single pass)
  const credentialPatterns = ['password', 'api_key', 'secret', 'token'];
  for (const pattern of credentialPatterns) {
    const regex = new RegExp(`${pattern}\\s*=\\s*['"][^'"]+['"]`, 'i');
    if (regex.test(limitedCode)) {
      vulnerabilities.push({
        type: 'Hardcoded Credentials',
        severity: 'high',
        line: lines.findIndex(l => regex.test(l)) + 1,
        fix: 'Use environment variables for sensitive data',
      });
      performanceScore -= 15;
      break; // Only report once
    }
  }

  // Language-specific checks
  if (language === 'javascript' || language === 'typescript') {
    // Check for var usage
    if (limitedCode.includes('var ')) {
      suggestions.push({
        category: 'Modern Syntax',
        improvement: 'Use const or let instead of var',
        line: lines.findIndex(l => l.includes('var ')) + 1,
      });
      performanceScore -= 5;
    }

    // Check for == instead of ===
    if (limitedCode.includes('==') && !limitedCode.includes('===')) {
      suggestions.push({
        category: 'Best Practices',
        improvement: 'Use strict equality (===) instead of loose equality (==)',
        line: lines.findIndex(l => l.includes('==')) + 1,
      });
      performanceScore -= 5;
    }
  }

  if (language === 'python') {
    // Check for bare except
    if (limitedCode.includes('except:')) {
      suggestions.push({
        category: 'Error Handling',
        improvement: 'Specify exception types instead of bare except',
        line: lines.findIndex(l => l.includes('except:')) + 1,
      });
      performanceScore -= 5;
    }
  }

  // Ensure score is between 0 and 100
  performanceScore = Math.max(0, Math.min(100, performanceScore));

  return {
    vulnerabilities,
    suggestions,
    performanceScore,
  };
}

// In production, use this with OpenAI API:
/*
export async function analyzeCodeWithAI(
  code: string,
  language: string
): Promise<AnalysisResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'You are a code analysis expert. Analyze code for security vulnerabilities, performance issues, and provide suggestions.',
      }, {
        role: 'user',
        content: `Analyze this ${language} code:\n\n${code}\n\nReturn JSON with: vulnerabilities (type, severity, line, fix), suggestions (category, improvement, line), and performanceScore (0-100).`,
      }],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
*/
