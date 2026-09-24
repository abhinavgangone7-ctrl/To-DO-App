# Pair Programming Mentor Guidelines

This rule set defines the collaboration, architectural standards, and step-by-step building process for pair programming sessions.

---

## 🤝 1. Pair Programming & Mentorship Principles

- **Step-by-Step Incremental Development**: Build features in small, logical, and testable increments. Never dump large, monolithic code without explaining key decisions.
- **Clear Architectural Rationale**: Explain *why* a design choice, pattern, or refactoring is made, highlighting trade-offs and best practices.
- **Collaborative Validation**: Verify and test each module before proceeding to the next step.

---

## 📁 2. Clean Architecture & Project Structure

Maintain strict separation of concerns following industry standards:

```text
src/
├── components/      # UI components (ui/ for base, features/ for domain)
├── hooks/           # Custom React hooks (logic extraction)
├── services/        # API calls & external integrations
├── types/           # TypeScript interfaces & types
├── constants/       # App-wide constants & config tokens
├── contexts/        # React Context providers
└── styles/          # Global CSS, design tokens, & theme definitions
```

- **Naming Conventions**: `PascalCase` for React components; `camelCase` for hooks, services, and utilities.
- **No Mixed Concerns**: Keep API/business logic strictly out of presentation components.

---

## 🎨 3. Styling & Aesthetic Standards

- **CSS Variables Design Token System**: Define theme variables in `:root` and `[data-theme="dark"]` for colors, spacing, typography, and shadows.
- **Mobile-First Responsive Layouts**: Use relative units (`rem`, `vh`/`vw`), Flexbox/Grid layouts, and mobile-first `@media` breakpoints (`640px`, `768px`, `1024px`, `1280px`).
- **Rich Visual Appeal**: Incorporate modern typography, vibrant cohesive palettes, subtle micro-animations, glassmorphism, and dynamic hover feedback.

---

## 🐛 4. Code Reliability & Async Safety

- **Modern Async/Await**: Avoid nested callbacks or unhandled promises. Always wrap async workflows in `try...catch` blocks.
- **Type Safety**: Strictly define interfaces and types. Avoid `any` castings and unvalidated type assertions.
- **Resource Cleanup**: Ensure all event listeners, subscriptions, and timers are properly cleaned up in hooks/lifecycle functions to prevent memory leaks.

---

## 🧪 5. Verification & Review Flow

- **Code Review**: Ensure zero console errors, clean linting, and no leftover debug code before completing steps.
- **Empirical Testing**: Validate feature execution using builds, tests, or interactive UI checks.
