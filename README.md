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

### Decorators for class-based models (preview)

Decorators apply only to class properties. Interfaces and type aliases should use `FormConfig<T>` as shown above.

```ts
// import { Label, Placeholder, Validate } from 'react-ts-forms';
// class User { @Label('Full name') name!: string; @Validate({ type: 'email', message: 'Invalid' }) email!: string }
// // Pending implementation; see spec for details.
```

## Precedence rules

When combining sources, later entries win:
1. Inferred defaults (from types)
2. External `FormConfig<T>`
3. Decorators (class properties)
4. Future runtime overrides

This order is enforced during schema construction.

## Roadmap (high level)

- Phase 2: Foundational (types, registry) ✓
- Phase 3: MVP (parser, schema builder, text/number/checkbox/object fields, basic validation)
- Phase 4: Complex types (arrays, enums, unions, dates)
- Phase 5: Customization & styling (decorators, custom components, CSS tokens)
- Phase 6: Advanced (recursive, readonly, deep nesting)
- Phase 7: Vite plugin (build-time automation)
- Phase 8: Polish (a11y sweep, performance, docs, packaging)

For detailed tasks, see `specs/001-type-driven-form/tasks.md`.

## Requirements

- React 18+
- TypeScript 5.6+ with `experimentalDecorators: true`
- Build tool: Vite (recommended) — plugin coming in Phase 7

## Contributing

- Tests-first: write failing tests before implementation (Vitest + RTL + axe)
- Lint/format: oxlint/oxfmt (to be wired in setup tasks)
- Commands (planned):
  - `npm test`
  - `npm run lint`

See `specs/001-type-driven-form/` for the spec, plan, research, data model, and API contracts.

## Notes

- Temporary React type shim lives at `src/types/react-shim.d.ts` until dependencies are installed. It will be removed once React and its type definitions are added.
- Public API names may evolve prior to v1.0.0 as stories land; follow the changelog for updates.
