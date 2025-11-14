# Contributing to react-ts-forms

Thank you for your interest in contributing to react-ts-forms! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/pradeepmouli/react-ts-forms.git
cd react-ts-forms

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run Storybook for development
npm run storybook
```

## Project Structure

```
src/
├── components/        # React components
│   ├── fields/       # Field components (TextField, NumberField, etc.)
│   └── utils/        # Utility functions (validation, fieldMask, etc.)
├── decorators/       # TypeScript decorators
├── generator/        # Type parsing and schema generation
├── types/            # TypeScript type definitions
├── vite-plugin/      # Vite plugin for build-time integration
└── styles/           # CSS styles

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── a11y/             # Accessibility tests

examples/
└── vite-basic/       # Example Vite project
```

## Testing Guidelines

### Writing Tests

We follow Test-Driven Development (TDD):

1. **Write tests first** - Tests should fail before implementation
2. **Write minimal code** - Only write enough code to make tests pass
3. **Refactor** - Improve code while keeping tests green

### Test Types

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test complete workflows (type → schema → form → submission)
- **Accessibility Tests**: Test WCAG 2.1 AA compliance using axe-core

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only accessibility tests
npm test tests/a11y
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for public APIs
- Export types that users will interact with

### React

- Use functional components with hooks
- Memoize components and callbacks where appropriate
- Use semantic HTML and ARIA attributes for accessibility

### Naming Conventions

- Components: PascalCase (e.g., `TextField`, `FormGenerator`)
- Functions: camelCase (e.g., `generateFieldMask`, `parseType`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_VALIDATORS`)
- Files: Match the main export (e.g., `TextField.tsx`, `validation.ts`)

## Accessibility Requirements

All contributions must meet WCAG 2.1 AA standards:

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **ARIA Attributes**: Use proper ARIA roles, labels, and states
- **Focus Management**: Visible focus indicators, logical tab order
- **Screen Readers**: Meaningful labels and announcements
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text

Run accessibility tests before submitting:

```bash
npm test tests/a11y
```

## Pull Request Process

### Before Submitting

1. **Run all quality checks**:
   ```bash
   npm run lint    # Linting
   npm run build   # Build
   npm test        # Tests
   ```

2. **Update documentation**:
   - Add/update JSDoc comments for public APIs
   - Update README.md if adding new features
   - Add Storybook stories for new components

3. **Check bundle size**:
   ```bash
   npm run size-limit
   ```

### PR Guidelines

- **Title**: Use conventional commits format: `feat:`, `fix:`, `docs:`, etc.
- **Description**: Explain what and why, not just how
- **Tests**: Include tests for new features or bug fixes
- **Breaking Changes**: Clearly document in PR description and CHANGELOG.md
- **Small PRs**: Keep changes focused and reviewable

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Example**:
```
feat(fields): add MaskedTextField component

Implements real-time field masking for template literal types.
Preserves cursor position during formatting.

Closes #123
```

## Development Workflow

### Adding a New Field Component

1. Create test file first: `tests/unit/fields/YourField.test.tsx`
2. Write failing tests for expected behavior
3. Implement component: `src/components/fields/YourField.tsx`
4. Make tests pass
5. Add accessibility tests: `tests/a11y/your-field.test.tsx`
6. Add Storybook story: `src/components/FormGenerator.stories.tsx`
7. Export from `src/index.ts`
8. Update README.md

### Adding a New Decorator

1. Create decorator: `src/decorators/YourDecorator.ts`
2. Update DecoratorProcessor to handle new metadata
3. Add tests: `tests/unit/decorators/YourDecorator.test.ts`
4. Add Storybook example
5. Export from `src/index.ts`
6. Document in README.md

## Performance Guidelines

- Keep bundle size under 15KB gzipped
- Use `React.memo` for components that render frequently
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations
- Avoid unnecessary re-renders

## Security

- Never commit secrets or API keys
- Validate all user input
- Sanitize field paths to prevent XSS
- Guard against prototype pollution
- Avoid regex patterns with catastrophic backtracking

## Questions?

If you have questions, please:
- Check existing issues and discussions
- Read the README.md and documentation
- Ask in a new GitHub issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
