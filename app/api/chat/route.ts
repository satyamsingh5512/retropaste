import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, code, language, history } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Limit code context to reduce processing time
    const codeContext = code.substring(0, 1000);
    
    // Limit history to last 3 messages only
    const recentHistory = history?.slice(-3) || [];
    
    // Generate response with optimized context
    const response = await generateAIResponse(message, codeContext, language, recentHistory);

    const apiResponse = NextResponse.json({
      success: true,
      response,
    });

    // Cache common questions for 5 minutes
    apiResponse.headers.set('Cache-Control', 'public, s-maxage=300');
    
    return apiResponse;

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// Mock AI response generator
// Replace this with actual AI API integration
async function generateAIResponse(
  message: string,
  code: string,
  language: string,
  history: any[]
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  // Simple pattern matching for demo
  if (lowerMessage.includes('what does') || lowerMessage.includes('explain')) {
    return `This ${language} code appears to be a snippet that needs analysis. Based on the structure, it seems to handle specific functionality. 

Key observations:
• The code uses ${language}-specific syntax and patterns
• It follows standard conventions for ${language}
• Consider reviewing the logic flow for optimization

Would you like me to explain any specific part in more detail?`;
  }

  if (lowerMessage.includes('bug') || lowerMessage.includes('error') || lowerMessage.includes('issue')) {
    return `I've analyzed the code for potential issues:

✓ **Syntax**: No obvious syntax errors detected
⚠️ **Best Practices**: Consider adding error handling
💡 **Suggestion**: Add input validation where applicable

Common ${language} pitfalls to watch for:
• Null/undefined checks
• Type safety
• Resource cleanup

Would you like me to review a specific section?`;
  }

  if (lowerMessage.includes('improve') || lowerMessage.includes('optimize') || lowerMessage.includes('better')) {
    return `Here are some improvement suggestions for this ${language} code:

**Performance:**
• Consider caching repeated calculations
• Optimize loops and iterations
• Use appropriate data structures

**Readability:**
• Add descriptive comments
• Use meaningful variable names
• Break down complex functions

**Maintainability:**
• Follow ${language} conventions
• Add error handling
• Write unit tests

Which area would you like to focus on?`;
  }

  if (lowerMessage.includes('security') || lowerMessage.includes('vulnerable')) {
    return `Security analysis for this ${language} code:

🔒 **Security Considerations:**
• Input validation and sanitization
• Authentication and authorization
• Data encryption for sensitive information
• Protection against common vulnerabilities (XSS, SQL injection, etc.)

**Recommendations:**
• Use parameterized queries
• Validate all user inputs
• Implement proper error handling without exposing sensitive data
• Keep dependencies updated

Need more specific security guidance?`;
  }

  // Default response
  return `I'm here to help you understand this ${language} code! 

I can help you with:
• Explaining what the code does
• Finding potential bugs or issues
• Suggesting improvements and optimizations
• Security analysis
• Best practices for ${language}

What specific aspect would you like to explore?`;
}
