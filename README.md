# react-ts-forms

Type-driven React form generator for TypeScript 5.6+ (with experimentalDecorators) that turns your types into accessible, performant forms. Build-time type introspection, runtime components, and a clean customization surface via decorators and external configs.

> Status: Early scaffolding. Foundational types and configuration primitives are in place; generator, fields, validation, and plugin are under active development.

## Highlights

- Build-time type introspection (TypeScript Compiler API, Vite plugin)
- Strongly-typed values end-to-end
- Accessible by default (WCAG 2.1 AA, semantic elements, ARIA)
- Customization via:
  - Class property decorators (for classes)
  - External `FormConfig<T>` objects (for interfaces/type aliases)
- Performance budget: <15KB gzipped core

## What's in the repo today

Exports available from `src/index.ts`:
- Types: `FormSchema`, `FieldDefinition`, `FieldType`, `ControlType`, `FieldOverride`
- Runtime state: `FormState`
- Validation types: `ValidationRule`, `ValidationType`, `ValidationTiming`
- Custom component props: `FieldProps`
- External config primitives: `FormConfig`, `defineFormConfig`

Scaffolding added for future phases:
- Decorator/config registry: `src/decorators/registry.ts`
- External config support: `src/decorators/formConfig.ts`
- Core type definitions: `src/types/*`

## Quick start (API preview)

The runtime generator and field components are coming soon. For now, you can author configuration using the exported types.

### Configure an interface using FormConfig (FR-021)

```ts
import { defineFormConfig } from 'react-ts-forms';

interface UserProfile {
  name: string;
  age?: number;
  email: string;
}

export const userProfileConfig = defineFormConfig<UserProfile>({
  name: { label: 'Full name', placeholder: 'Ada Lovelace' },
  age: { helpText: 'Optional', validators: [{ type: 'min', value: 0, message: 'Age must be positive' }] },
  email: { validators: [{ type: 'email', message: 'Please enter a valid email' }] }
});
```

### Decorators for class-based models (Phase 5) ✓

Decorators apply only to class properties. Interfaces and type aliases should use `FormConfig<T>` as shown above.

```ts
import { Label, Placeholder, HelpText, Validate, ControlType, CustomControl } from 'react-ts-forms';

class UserRegistration {
  @Label('Full Name')
  @Placeholder('Enter your full name')
  @Validate({ type: 'minLength', value: 2, message: 'Name is too short' })
  name!: string;

  @Label('Email Address')
  @Validate({ type: 'email', message: 'Invalid email address' })
  email!: string;

  @ControlType('textarea')
  @HelpText('Tell us a bit about yourself')
  bio?: string;

  @Validate({ type: 'min', value: 18, message: 'Must be 18 or older' })
  age!: number;

  @Validate({
    type: 'custom',
    message: 'Password must contain uppercase, lowercase, and number',
    validator: (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value as string)
  })
  password!: string;
}
```

**Available Decorators:**
- `@Label(text)` - Set custom field label
- `@Placeholder(text)` - Set placeholder text
- `@HelpText(text)` - Add help text below field
- `@Validate(rule)` - Add validation rules (can use multiple times)
- `@ControlType(type)` - Override control type (e.g., 'textarea', 'select')
- `@CustomControl(Component)` - Use custom React component
- `@UnionControl('radio' | 'select')` - Force union selector type

**Custom Validators:**
```ts
@Validate({
  type: 'custom',
  message: 'Error message',
  validator: (value, allValues) => boolean | Promise<boolean>,
  async: true, // Optional, for async validators
  timing: 'blur' // When to run: 'change' | 'blur' | 'submit'
})
```

## Precedence rules

When combining sources, later entries win:
1. Inferred defaults (from types)
2. External `FormConfig<T>`
3. Decorators (class properties)
4. Future runtime overrides

This order is enforced during schema construction.

## Advanced Features (Phase 6)

### Recursive Types

Forms support recursive data structures like trees with lazy expansion:

```ts
interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];  // Recursive reference
}
```

The TypeParser automatically detects circular references and creates expandable UI:
- Click to expand/collapse recursive instances
- Visual hierarchy with depth-based indentation
- ARIA-compliant with `aria-expanded` states

### Readonly Fields

Mark fields as readonly to prevent user edits:

```ts
const schema = SchemaBuilder.buildSchema('User', [
  TypeParser.parseType('id', { kind: 'string', readonly: true }),
  TypeParser.parseType('email', { kind: 'string', readonly: true }),
  TypeParser.parseType('name', { kind: 'string' }), // Editable
]);
```

Readonly fields render as disabled inputs with visual indicators.

### Template Literal Types & Field Masks

Use TypeScript template literal types for pattern-based validation and **automatic field masking**:

```ts
// User ID pattern: user-{number}
const userIdField = TypeParser.parseType('userId', {
  kind: 'template-literal',
  templatePattern: 'user-${number}',
  required: true,
});
// Auto-formats input: "123" → "user-123"

// SKU pattern: SKU-{text}-{number}
const skuField = TypeParser.parseType('sku', {
  kind: 'template-literal',
  templatePattern: 'SKU-${string}-${number}',
  required: true,
});
// Auto-formats: "LAPTOP4567" → "SKU-LAPTOP-4567"

// Semantic version: major.minor.patch
const versionField = TypeParser.parseType('version', {
  kind: 'template-literal',
  templatePattern: '${number}.${number}.${number}',
  required: true,
});
// Auto-formats: "210" → "2.1.0"
```

**Supported placeholders:**
- `${string}` - Any string (.* in regex)
- `${number}` - Numeric digits (\d+ in regex)
- `${bigint}` - Numeric digits (\d+ in regex)
- `${boolean}` - Literal "true" or "false"

**Template patterns automatically generate:**
- ✅ Pattern validation (regex)
- ✅ Helpful error messages
- ✅ **Field masks** - Auto-format input as users type
- ✅ Auto-generated placeholders

**Field Mask Features:**
- Formats input in real-time as users type
- Extracts raw value for validation and submission
- Maintains cursor position during formatting
- Automatically adds literal separators (-, ., etc.)
- Visual feedback for expected format

**Manual Field Mask Usage:**
```ts
import { generateFieldMask } from 'react-ts-forms';

const mask = generateFieldMask('user-${number}');
// mask.format('123') → 'user-123'
// mask.parse('user-123') → '123'
// mask.placeholder → 'user-123'
```

### Generic Type Resolution

TypeParser can resolve generic type parameters:

```ts
const listType = {
  kind: 'array',
  elementType: { kind: 'generic', name: 'T' }
};

const resolved = TypeParser.resolveGenerics(listType, {
  T: { kind: 'string' }
});
// Results in: array of string
```

## Vite Plugin (Phase 7) ✓

The Vite plugin provides build-time integration for optimized performance and better developer experience.

### Installation

```bash
npm install @mouli.dev/react-ts-forms
```

### Configuration

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { typeFormPlugin } from '@mouli.dev/react-ts-forms/vite';

export default defineConfig({
  plugins: [
    react(),
    typeFormPlugin({
      debug: true,  // Enable debug logging
      cache: true,  // Enable schema caching (default: true)
      include: ['**/*.tsx', '**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**'],
    }),
  ],
});
```

### Plugin Options

```ts
interface TypeFormPluginOptions {
  /**
   * File patterns to include for type analysis
   * @default ['**/*.tsx', '**/*.ts']
   */
  include?: string | string[];

  /**
   * File patterns to exclude from type analysis
   * @default ['**\/node_modules/**', '**\/*.test.ts', '**\/*.test.tsx']
   */
  exclude?: string | string[];

  /**
   * Enable debug logging with performance metrics
   * @default false
   */
  debug?: boolean;

  /**
   * Cache parsed schemas (recommended for performance)
   * @default true
   */
  cache?: boolean;
}
```

### Features

- **Automatic Type Detection**: Monitors TypeScript files during build
- **Performance Optimization**: Caches schemas and only regenerates on file changes
- **Debug Metrics**: Shows transform times and cache hit rates
- **Smart Filtering**: Automatically excludes test files and node_modules

### Example Output (Debug Mode)

```
[react-ts-forms] Processing: src/components/UserForm.tsx
[react-ts-forms] Processed in 12.34ms

[react-ts-forms] Performance Metrics:
  Total transforms: 15
  Cache hits: 12
  Cache misses: 3
  Cache hit rate: 80.0%
```

## Roadmap (high level)

- Phase 2: Foundational (types, registry) ✓
- Phase 3: MVP (parser, schema builder, text/number/checkbox/object fields, basic validation) ✓
- Phase 4: Complex types (arrays, enums, unions, dates) ✓
- Phase 5: Customization & styling (decorators, custom components, CSS tokens) ✓
- Phase 6: Advanced (recursive types, readonly fields, generic resolution, template literals, field masks) ✓
- Phase 7: Vite plugin (build-time automation) ✓
- Phase 8: Polish (a11y sweep, performance, docs, packaging)

For detailed tasks, see `specs/001-type-driven-form/tasks.md`.

## Requirements

- React 18+
- TypeScript 5.6+ with `experimentalDecorators: true`
- Build tool: Vite (recommended) — plugin coming in Phase 7

## Contributing

- Tests-first: write failing tests before implementation (Vitest + RTL + axe)
- Lint/format: oxlint/oxfmt
- Commands:
  - `npm test`
  - `npm run lint`
  - `npm run build`
  - `npm run storybook`

See `specs/001-type-driven-form/` for the spec, plan, research, data model, and API contracts.

## Notes

- Temporary React type shim lives at `src/types/react-shim.d.ts` until dependencies are installed. It will be removed once React and its type definitions are added.
- Public API names may evolve prior to v1.0.0 as stories land; follow the changelog for updates.
