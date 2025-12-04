---
inclusion: manual
---

# Retro Terminal Design Guidelines

## Visual Style
- Use terminal green (#00ff00) as primary color
- Add CRT scan lines effect
- Include phosphor glow on text
- Use monospace fonts (JetBrains Mono)
- Add VHS noise texture
- Implement glitch effects on hover

## Color Palette
```css
--terminal: #00ff00
--terminal-dim: #00aa00
--terminal-glow: #00ff00
--bg-black: #000000
--bg-card: #0a0a0a
--border-dim: #003300
--error: #ff0000
--warning: #ffaa00
--retro: #00ffff
```

## Animation Principles
- Use Framer Motion for smooth transitions
- Add entrance animations (fade + slide)
- Include hover effects
- Use spring animations for buttons
- Add loading states with retro spinners
- Implement glitch effects sparingly

## Typography
- Headings: Bold, uppercase, with glow
- Body: Regular weight, readable size
- Code: Monospace, syntax highlighted
- Labels: Small, dimmed color
- Buttons: Uppercase, bracketed [BUTTON]

## Component Patterns
- Glass morphism with terminal borders
- Rounded corners minimal (4px max)
- Border width: 2px
- Padding: Consistent spacing (4, 8, 16, 24)
- Shadows: Glow effects, not drop shadows

## Sound Design
- Use 8-bit style beeps
- Click: 800Hz square wave
- Hover: 600Hz sine wave
- Success: Ascending tones
- Error: Descending tones
- Keep volume low (0.1-0.2)
