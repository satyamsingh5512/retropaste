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
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const vulnerabilities: Vulnerability[] = [];
  const suggestions: Suggestion[] = [];
  let performanceScore = 85;

  // Basic pattern matching for common issues
  const lines = code.split('\n');

  // Check for SQL injection vulnerabilities
  if (code.includes('SELECT') && code.includes('+')) {
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'critical',
      line: lines.findIndex(l => l.includes('SELECT')) + 1,
      fix: 'Use parameterized queries or prepared statements',
    });
    performanceScore -= 20;
  }

  // Check for eval usage
  if (code.includes('eval(')) {
    vulnerabilities.push({
      type: 'Code Injection',
      severity: 'critical',
      line: lines.findIndex(l => l.includes('eval(')) + 1,
      fix: 'Avoid using eval(). Use safer alternatives like JSON.parse()',
    });
    performanceScore -= 15;
  }

  // Check for console.log in production
  if (code.includes('console.log')) {
    suggestions.push({
      category: 'Best Practices',
      improvement: 'Remove console.log statements before production',
      line: lines.findIndex(l => l.includes('console.log')) + 1,
    });
    performanceScore -= 5;
  }

  // Check for inefficient loops
  if (code.includes('for') && code.includes('for')) {
    suggestions.push({
      category: 'Performance',
      improvement: 'Nested loops detected. Consider optimizing with better data structures',
      line: lines.findIndex(l => l.includes('for')) + 1,
    });
    performanceScore -= 10;
  }

  // Check for missing error handling
  if ((code.includes('fetch') || code.includes('axios')) && !code.includes('catch')) {
    suggestions.push({
      category: 'Error Handling',
      improvement: 'Add error handling for async operations',
      line: lines.findIndex(l => l.includes('fetch') || l.includes('axios')) + 1,
    });
    performanceScore -= 10;
  }

  // Check for hardcoded credentials
  const credentialPatterns = ['password', 'api_key', 'secret', 'token'];
  credentialPatterns.forEach(pattern => {
    const regex = new RegExp(`${pattern}\\s*=\\s*['"][^'"]+['"]`, 'i');
    if (regex.test(code)) {
      vulnerabilities.push({
        type: 'Hardcoded Credentials',
        severity: 'high',
        line: lines.findIndex(l => regex.test(l)) + 1,
        fix: 'Use environment variables for sensitive data',
      });
      performanceScore -= 15;
    }
  });

  // Language-specific checks
  if (language === 'javascript' || language === 'typescript') {
    // Check for var usage
    if (code.includes('var ')) {
      suggestions.push({
        category: 'Modern Syntax',
        improvement: 'Use const or let instead of var',
        line: lines.findIndex(l => l.includes('var ')) + 1,
      });
      performanceScore -= 5;
    }

    // Check for == instead of ===
    if (code.includes('==') && !code.includes('===')) {
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
    if (code.includes('except:')) {
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
