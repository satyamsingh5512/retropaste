# Code Playground - Design

## Architecture

### Component Structure
```
CodePlayground
├── RunButton (triggers execution)
├── OutputDisplay (shows results)
└── ErrorDisplay (shows errors)
```

### Execution Flow
1. User clicks "Run Code"
2. Set loading state
3. Capture console methods
4. Execute code in AsyncFunction
5. Restore console methods
6. Display output or errors
7. Clear loading state

## Implementation Details

### Console Capture
```typescript
const logs: string[] = [];
const originalLog = console.log;
console.log = (...args) => {
  logs.push(args.join(' '));
};
```

### Safe Execution
```typescript
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const fn = new AsyncFunction(code);
await fn();
```

### Error Handling
- Try-catch around execution
- Display error message
- Show line number if available
- Highlight syntax errors

## UI Design
- Terminal-style output box
- Green text on black background
- Monospace font
- Run button with loading state
- Clear output button
- Copy output button

## Edge Cases
- Empty code
- Infinite loops (timeout)
- Large output (truncate)
- Syntax errors
- Runtime errors
- Async code
