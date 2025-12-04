# RetroPaste Project Context

## Project Overview
RetroPaste is a terminal-themed code sharing platform with AI-powered analysis and retro aesthetics.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Code Style Guidelines
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use async/await over promises
- Add proper error handling
- Include loading states
- Use Framer Motion for animations
- Follow Next.js 16 best practices

## Component Structure
- Keep components small and focused
- Use proper TypeScript interfaces
- Add JSDoc comments for complex logic
- Export interfaces separately
- Use proper file naming (PascalCase for components)

## API Routes
- Always validate input
- Return proper HTTP status codes
- Include error messages
- Use try-catch blocks
- Add request logging
- Optimize database queries

## Performance Guidelines
- Use React.memo for expensive components
- Implement proper caching
- Debounce user inputs
- Optimize images
- Minimize bundle size
- Use lazy loading where appropriate

## Security
- Validate all user inputs
- Sanitize database queries
- Use environment variables for secrets
- Implement rate limiting
- Add CSRF protection
- Use secure headers
