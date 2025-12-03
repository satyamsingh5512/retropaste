// Syntax error detection for common languages

interface SyntaxError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export function checkSyntax(code: string, language: string): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const lines = code.split('\n');

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
      return checkJavaScriptSyntax(lines);
    case 'python':
      return checkPythonSyntax(lines);
    case 'json':
      return checkJSONSyntax(code);
    default:
      return [];
  }
}

function checkJavaScriptSyntax(lines: string[]): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const brackets: { char: string; line: number }[] = [];
  const bracketPairs: { [key: string]: string } = {
    '{': '}',
    '[': ']',
    '(': ')',
  };

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check for unclosed strings
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    const backticks = (line.match(/`/g) || []).length;

    if (singleQuotes % 2 !== 0 && !line.includes('//')) {
      errors.push({
        line: lineNum,
        message: "Unclosed single quote",
        severity: 'error',
      });
    }

    if (doubleQuotes % 2 !== 0 && !line.includes('//')) {
      errors.push({
        line: lineNum,
        message: "Unclosed double quote",
        severity: 'error',
      });
    }

    // Check brackets
    for (const char of line) {
      if (char in bracketPairs) {
        brackets.push({ char, line: lineNum });
      } else if (Object.values(bracketPairs).includes(char)) {
        const last = brackets.pop();
        if (!last || bracketPairs[last.char] !== char) {
          errors.push({
            line: lineNum,
            message: `Mismatched bracket: expected ${last ? bracketPairs[last.char] : 'nothing'}, found ${char}`,
            severity: 'error',
          });
        }
      }
    }

    // Check for missing semicolons (warning only)
    if (
      trimmed &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.endsWith(',') &&
      !trimmed.includes('function') &&
      !trimmed.includes('class') &&
      !trimmed.includes('if') &&
      !trimmed.includes('for') &&
      !trimmed.includes('while')
    ) {
      errors.push({
        line: lineNum,
        message: "Missing semicolon",
        severity: 'warning',
      });
    }
  });

  // Check for unclosed brackets
  brackets.forEach((bracket) => {
    errors.push({
      line: bracket.line,
      message: `Unclosed ${bracket.char}`,
      severity: 'error',
    });
  });

  return errors;
}

function checkPythonSyntax(lines: string[]): SyntaxError[] {
  const errors: SyntaxError[] = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check for missing colons
    if (
      (trimmed.startsWith('if ') ||
        trimmed.startsWith('elif ') ||
        trimmed.startsWith('else') ||
        trimmed.startsWith('for ') ||
        trimmed.startsWith('while ') ||
        trimmed.startsWith('def ') ||
        trimmed.startsWith('class ')) &&
      !trimmed.endsWith(':')
    ) {
      errors.push({
        line: lineNum,
        message: "Missing colon at end of statement",
        severity: 'error',
      });
    }

    // Check for inconsistent indentation
    if (line.length > 0 && line[0] === ' ') {
      const spaces = line.match(/^ */)?.[0].length || 0;
      if (spaces % 4 !== 0) {
        errors.push({
          line: lineNum,
          message: "Inconsistent indentation (use 4 spaces)",
          severity: 'warning',
        });
      }
    }
  });

  return errors;
}

function checkJSONSyntax(code: string): SyntaxError[] {
  try {
    JSON.parse(code);
    return [];
  } catch (err: any) {
    const match = err.message.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : 0;
    const lines = code.substring(0, position).split('\n');
    
    return [
      {
        line: lines.length,
        message: err.message,
        severity: 'error',
      },
    ];
  }
}
