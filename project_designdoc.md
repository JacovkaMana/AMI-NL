# D&D Character Creation and Chat Room Application Design System

## Overview
This design system defines the core visual elements and styling principles for the D&D application, based on the implemented character creation page. These guidelines ensure consistency across all pages.

## Design Principles
- **User-Centric**: Focus on intuitive navigation and form layouts
- **Depth and Dimension**: Use of shadows and borders for visual hierarchy
- **Component-Based**: Modular design approach for reusable elements
- **Responsive Design**: Fluid layouts that adapt to different screen sizes

## Theme System

### Light Theme Colors
```css
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-text-primary: #2F4F4F;
  --color-border: #e2e8f0;
  --color-accent: #4A5568;
  --color-accent-hover: #2D3748;
  --color-bg-error: #FEE2E2;
  --color-primary: #7C3AED;
  --color-primary-dark: #6D28D9;
  --color-primary-darker: #5B21B6;
  --color-primary-light: #8B5CF6;
  --color-primary-lighter: #A78BFA;
  --color-button-disabled: #E2E8F0;
  --color-button-disabled-text: #94A3B8;
}
```

### Dark Theme Colors
```css
:root[data-theme="dark"] {
  --color-bg-primary: #1a202c;
  --color-bg-secondary: #2d3748;
  --color-text-primary: #e2e8f0;
  --color-border: #4a5568;
  --color-accent: #90cdf4;
  --color-accent-hover: #63b3ed;
  --color-bg-error: #742A2A;
}
```

## Typography

### Font Families
- **Headings**: 'Cinzel', serif
  - Used for page titles, section headers, and important labels
- **Body**: 'Roboto', sans-serif
  - Used for general text, form inputs, and content

### Font Sizes
- **Page Title**: 2.25rem (36px)
- **Section Headers**: 1.25rem (20px)
- **Body Text**: 1rem (16px)
- **Small Text**: 0.875rem (14px)

## Spacing System
- **Base Unit**: 0.25rem (4px)
- **Common Spacing Values**:
  - Extra Small: 0.5rem (8px)
  - Small: 1rem (16px)
  - Medium: 1.5rem (24px)
  - Large: 2rem (32px)
  - Extra Large: 3rem (48px)

## Component Properties

### Borders
- **Border Radius**:
  - Small: 0.375rem (6px)
  - Medium: 0.5rem (8px)
  - Large: 1rem (16px)
  - Full: 9999px (for circular elements)
- **Border Width**:
  - Default: 1px
  - Medium: 2px
  - Heavy: 4px

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Buttons
```css
.btn-primary, .btn-secondary, .btn-tertiary {
  /* Common Base Styles */
  padding: 0.75rem 1.5rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.btn-primary {
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: var(--color-bg-secondary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-secondary {
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-tertiary {
  border: 1px solid var(--color-border);
}

.btn-tertiary:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* Disabled State for all buttons */
.btn-primary:disabled,
.btn-secondary:disabled,
.btn-tertiary:disabled {
  background: var(--color-button-disabled);
  color: var(--color-button-disabled-text);
  border-color: var(--color-button-disabled);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Focus states for accessibility */
.btn-primary:focus,
.btn-secondary:focus,
.btn-tertiary:focus {
  outline: none;
  ring: 2px;
  ring-offset: 2px;
  ring-color: var(--color-primary);
}
```

### Updated Color Variables
```css
:root {
  /* Core Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-text-primary: #2F4F4F;
  --color-text-secondary: #4A5568;
  --color-border: #e2e8f0;
  
  /* Button & Interactive Colors */
  --color-primary: #6366F1;        /* Changed to Indigo */
  --color-primary-dark: #4F46E5;
  --color-primary-darker: #4338CA;
  --color-primary-light: #818CF8;
  --color-primary-lighter: #A5B4FC;
  
  /* Accent Colors */
  --color-accent: #4A5568;
  --color-accent-hover: #2D3748;
  
  /* State Colors */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-bg-error: #FEE2E2;
  
  /* Disabled States */
  --color-button-disabled: #E2E8F0;
  --color-button-disabled-text: #94A3B8;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark Theme Colors */
:root[data-theme="dark"] {
  --color-bg-primary: #1a202c;
  --color-bg-secondary: #2d3748;
  --color-text-primary: #e2e8f0;
  --color-text-secondary: #a0aec0;
  --color-border: #4a5568;
  
  /* Button & Interactive Colors - Adjusted for dark theme */
  --color-primary: #818CF8;
  --color-primary-dark: #6366F1;
  --color-primary-darker: #4F46E5;
  --color-primary-light: #A5B4FC;
  --color-primary-lighter: #C7D2FE;
  
  /* Accent Colors */
  --color-accent: #90cdf4;
  --color-accent-hover: #63b3ed;
  
  /* State Colors */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-bg-error: #742A2A;
}
```

## Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large Desktop**: 1280px

## Animation & Transitions
- **Duration**: 
  - Fast: 150ms
  - Default: 200ms
  - Slow: 300ms
- **Timing Functions**:
  - Default: ease-in-out
  - Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

## Accessibility Guidelines
- Maintain WCAG 2.1 AA compliance
- Minimum contrast ratio of 4.5:1 for normal text
- Focus states must be clearly visible
- Interactive elements must be keyboard accessible
- Support for screen readers through ARIA labels

## Implementation Notes
- Use Tailwind CSS for consistent styling
- Implement dark mode through data-theme attribute
- Follow mobile-first responsive approach
- Maintain component-based architecture
- Use CSS variables for theme values

## Updated Button Styles

### Light Theme
- **Button Text Color**: `var(--color-text-primary)`
- **Button Background Color**: `var(--color-bg-secondary)`

### Dark Theme
- **Button Text Color**: `var(--color-bg-secondary)`
- **Button Background Color**: `var(--color-text-primary)`