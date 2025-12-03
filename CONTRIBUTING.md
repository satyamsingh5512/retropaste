# Contributing to RetroPaste

Thank you for your interest in contributing to RetroPaste! 🎉

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something cool together.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has been suggested
2. Open an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Make** your changes
4. **Test** your changes: `npm run build`
5. **Commit** with clear messages: `git commit -m 'Add: feature description'`
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/retropaste.git
cd retropaste

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your MongoDB URI

# Run development server
npm run dev
```

### Coding Standards

- Use TypeScript
- Follow existing code style
- Add comments for complex logic
- Keep functions small and focused
- Write meaningful commit messages

### Commit Message Format

```
Type: Brief description

Detailed explanation (if needed)

Examples:
- Add: New retro sound effect
- Fix: MongoDB connection error
- Update: README with new features
- Refactor: Simplify AI analysis logic
```

### Testing

Before submitting:
- [ ] Code builds without errors: `npm run build`
- [ ] No TypeScript errors
- [ ] Tested in browser
- [ ] Responsive design works
- [ ] No console errors

## Project Structure

```
retropaste/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and services
├── models/           # Database models
└── public/           # Static assets
```

## Areas for Contribution

### High Priority
- [ ] User dashboard
- [ ] Paste search
- [ ] More AI analysis rules
- [ ] Rate limiting
- [ ] API documentation

### Medium Priority
- [ ] More retro themes
- [ ] Collaborative editing
- [ ] Code execution
- [ ] More languages
- [ ] Custom short URLs

### Low Priority
- [ ] Mobile app
- [ ] Browser extension
- [ ] CLI tool
- [ ] Syntax themes
- [ ] More animations

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Read the README.md

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to RetroPaste!** 🖥️👻
