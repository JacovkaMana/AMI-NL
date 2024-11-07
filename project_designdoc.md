# D&D Application Design System Documentation

## Core Design Philosophy
- Medieval fantasy aesthetic with modern UI principles
- Accessibility-first approach
- Responsive design for all devices
- Consistent component styling

## Theme System

### Light Theme Colors
```css
:root {
  --primary-bg: #ffffff;
  --secondary-bg: #f8f9fa;
  --primary-text: #2F4F4F;
  --accent-color: #7C3AED;
  --accent-hover: #6D28D9;
  --error-bg: #FEE2E2;
  --error-text: #DC2626;
  --border-color: #e2e8f0;
  --input-bg: #ffffff;
  --disabled-bg: #E2E8F0;
  --disabled-text: #94A3B8;
}
```

### Dark Theme Colors
```css
:root[data-theme="dark"] {
  --primary-bg: #1a202c;
  --secondary-bg: #2d3748;
  --primary-text: #e2e8f0;
  --accent-color: #818CF8;
  --accent-hover: #6366F1;
  --error-bg: #742A2A;
  --error-text: #FEE2E2;
  --border-color: #4a5568;
  --input-bg: #2d3748;
  --disabled-bg: #4A5568;
  --disabled-text: #A0AEC0;
}
```

## Typography

### Fonts
- Primary Font: 'Roboto', sans-serif
- Fantasy Font: 'MedievalSharp', cursive
- Headers Font: 'Cinzel', serif

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

## Component Styles

### Buttons
```css
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 200ms;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}
```

### Form Elements
```css
.input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--input-bg);
  color: var(--primary-text);
}

.select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--input-bg);
}
```

### Cards
```css
.card {
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## Layout

### Grid System
- 12-column grid system
- Responsive breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

## Animation

### Transitions
```css
--transition-fast: 150ms ease-in-out;
--transition-normal: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

### Hover Effects
- Scale transforms: 1.02 for subtle growth
- Opacity changes: 0.9 for slight dimming
- Shadow expansion for depth

## Page-Specific Styles

### Character Creation
- Three-column layout for desktop
- Single column for mobile
- Sticky navigation
- Progress indicator

### Chat Interface
- Two-column layout (chat + character sheet)
- Message bubbles with alternating alignment
- Typing indicators
- Character portraits