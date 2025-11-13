# Implementation Plan: Type-Driven Form Generator

**Branch**: `001-type-driven-form` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-type-driven-form/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. If command docs are present, refer to the repository's commands documentation for the execution workflow.

## Summary

A React component that accepts a TypeScript type or interface definition and generates a complete, accessible form with appropriate input controls at build-time. The component eliminates repetitive form coding by introspecting type definitions during bundling, supporting complex types (arrays, unions, enums, nested objects, recursive types) with decorator-based customization for labels, validation, and styling. Technical approach uses TypeScript compiler API or bundler plugins for build-time type analysis, rendering accessible form controls with WCAG 2.1 AA compliance.

## Technical Context

**Language/Version**: TypeScript 5.6+ with experimentalDecorators enabled
**Primary Dependencies**: React 18+, TypeScript compiler API or Vite/webpack plugin for build-time type introspection, react-jsonschema-form (reference for validation patterns)
**Storage**: N/A
**Testing**: Vitest with jsdom, React Testing Library, axe-core for a11y testing
**Target Platform**: Browser (component library for web applications)
**Project Type**: Single package - component library
**Performance Goals**: Bundle size <15KB gzipped for core library, <100ms validation response time, smooth rendering for forms with 50+ fields
**Constraints**: WCAG 2.1 AA compliance (NON-NEGOTIABLE), build-time only generation (no runtime type introspection), decorator support required in consuming projects
**Scale/Scope**: Support 20+ field types, handle types with 10+ nesting levels, support unlimited recursive depth with lazy expansion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The following MUST be validated against the constitution before proceeding:

1. **Accessibility & UX**: 
   - ✅ All form controls will have ARIA labels (aria-label, aria-describedby for errors, aria-required, aria-invalid)
   - ✅ Keyboard navigation: Tab order for fields, Enter to submit, Space for checkboxes/radios, Arrow keys for radio groups and select dropdowns
   - ✅ Focus management: Autofocus on first invalid field after submission, visible focus indicators (CSS :focus-visible)
   - ✅ Screen reader support: Field labels associated via htmlFor, error announcements via aria-live regions
   - ✅ Visual states: hover, focus, active, disabled, invalid (with error icons/messages), loading (for async validation)
   - ✅ Array controls: Add/remove/reorder buttons with ARIA labels ("Add item", "Remove item 3", "Move up", "Move down")
   - ✅ Recursive types: Expand/collapse controls with ARIA expanded state and keyboard support
   - ✅ Union types: Type selector (radio group or select) with proper ARIA semantics before conditional input appears

2. **API Stability**: 
   - ✅ Public API: Component props (type definition input, onChange callback, onSubmit, decorators API)
   - ✅ Decorator API: @FormField, @Validate, @Label, @Placeholder, @CustomControl - these are MAJOR version contracts
   - ✅ Breaking changes: Any decorator signature change, prop removal, or type introspection behavior change requires MAJOR bump
   - ✅ Migration notes: Will document decorator migration path if API evolves
   - ✅ CSS variables: Form control styling uses --rtsf-* prefixed variables (stable public contract)

3. **Test Strategy**: 
   - ✅ Unit tests: Type parser (handles primitives, arrays, objects, enums, unions, recursive types), decorator extractor, validation engine
   - ✅ Integration tests: Full form rendering from TypeScript type, form submission with typed data output, validation error display
   - ✅ Interaction tests: Add/remove array items, reorder array items, expand/collapse recursive fields, select union type variant
   - ✅ A11y tests: axe-core scan for each field type, keyboard navigation test, screen reader announcement test
   - ✅ Test matrix:
     | Component | Unit | Integration | Interaction | A11y |
     |-----------|------|-------------|-------------|------|
     | TypeParser | ✓ | ✓ | - | - |
     | FormGenerator | ✓ | ✓ | ✓ | ✓ |
     | FieldControls (text, number, checkbox, select, date, array, object) | ✓ | - | ✓ | ✓ |
     | ValidationEngine | ✓ | ✓ | - | - |
     | DecoratorProcessor | ✓ | ✓ | - | - |

4. **Documentation**: 
   - ✅ Storybook stories plan:
     - Primary: Simple form (user profile type)
     - Variants: Arrays, nested objects, enums, unions, dates, recursive types, validation errors
     - Accessibility: Keyboard navigation demo, screen reader announcement demo, error state demo
   - ✅ README updates: 
     - Quick start (basic usage example)
     - Decorator API reference
     - Build configuration (TypeScript compiler API or Vite plugin setup)
     - Supported types table
     - Migration guide (if breaking changes)
   - ✅ Prop tables: Auto-generated from TypeScript types in Storybook
   - ✅ Changelog entry: Features (type-driven generation, decorator customization), breaking changes (N/A for v1.0.0)

5. **Performance**: 
   - ✅ Bundle size budget: Core library <15KB gzipped (per SC-007)
   - ✅ Tree-shakeable: ESM exports, no side-effect imports
   - ✅ Memoization plan:
     - Memoize field component renders (React.memo on FieldControl components)
     - Stable callbacks (useCallback for onChange, onBlur, onSubmit handlers)
     - Computed field metadata (useMemo for parsed type schema)
   - ✅ Avoid unnecessary re-renders: Isolate form state updates to changed fields only
   - ✅ Lazy expansion: Recursive type fields render expand button, not full nested tree initially
   - ✅ Large forms: Virtual scrolling or pagination if >100 fields (out of scope for MVP, noted for future)

6. **Governance**: 
   - ✅ Release impact: v1.0.0 - first major release of type-driven form generator feature
   - ✅ No deferrals: All gates can be satisfied in initial implementation
   - ✅ TODOs scoped: Any temporary TODO comments will include owner + deadline ≤ 2 weeks

7. **Compliance**: 
   - ✅ No unstable APIs: Using stable TypeScript compiler API, stable React APIs (hooks, forwardRef)
   - ✅ Decorator support: Requires experimentalDecorators in tsconfig.json (documented assumption)
   - ✅ Build-time only: No runtime type introspection (avoids reflect-metadata or runtime decorators)

All gates have explicit evidence above. Ready to proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── generator/           # Build-time type introspection and form schema generation
│   ├── TypeParser.ts    # Parses TypeScript types to extract structure
│   ├── DecoratorProcessor.ts  # Extracts decorator metadata
│   └── SchemaBuilder.ts # Builds Form Schema from type + decorators
├── components/          # Runtime React components
│   ├── FormGenerator.tsx      # Main component accepting type + rendering form
│   ├── fields/                # Field-level components
│   │   ├── TextField.tsx
│   │   ├── NumberField.tsx
│   │   ├── CheckboxField.tsx
│   │   ├── SelectField.tsx
│   │   ├── DateField.tsx
│   │   ├── ArrayField.tsx     # Handles array add/remove/reorder
│   │   ├── ObjectField.tsx    # Handles nested objects
│   │   └── UnionField.tsx     # Handles union type selector
│   └── utils/
│       ├── validation.ts      # Validation engine
│       └── accessibility.ts   # ARIA utilities
├── decorators/          # Decorator definitions
│   ├── FormField.ts
│   ├── Validate.ts
│   ├── Label.ts
│   ├── Placeholder.ts
│   └── CustomControl.ts
├── types/               # TypeScript type definitions
│   ├── FormSchema.ts
│   ├── FieldDefinition.ts
│   ├── FormState.ts
│   └── ValidationRule.ts
└── index.ts             # Public exports

tests/
├── unit/
│   ├── TypeParser.test.ts
│   ├── DecoratorProcessor.test.ts
│   ├── SchemaBuilder.test.ts
│   ├── validation.test.ts
│   └── fields/
│       ├── TextField.test.tsx
│       ├── NumberField.test.tsx
│       ├── ArrayField.test.tsx
│       └── ...
├── integration/
│   ├── form-generation.test.tsx   # End-to-end form generation
│   ├── form-submission.test.tsx   # Submit flow with typed output
│   └── decorator-customization.test.tsx
└── a11y/
    ├── keyboard-navigation.test.tsx
    ├── screen-reader.test.tsx
    └── field-accessibility.test.tsx
```

**Structure Decision**: Single project (Option 1) is appropriate because this is a standalone component library with no separate backend or mobile app. All code (build-time generator + runtime components) lives in one TypeScript package with clear separation between build-time (`generator/`) and runtime (`components/`) concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
