# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-13

### Added

**Core Form Generation (Phase 3 - User Story 1)**
- `TypeParser` - Type introspection for primitives, objects, arrays, enums, unions, dates, recursive types, template literals
- `SchemaBuilder` - FormSchema generation with auto-labels (camelCase → Title Case)
- `FormGenerator` - Main orchestration component with state management and validation
- Field components: TextField, NumberField, CheckboxField, ObjectField
- Basic validation engine (required, min, max, minLength, maxLength, pattern, email, url)
- Form state management with values, errors, touched, submitted tracking

**Complex Type Support (Phase 4 - User Story 2)**
- DateField - Date input with ISO date handling
- SelectField - Dropdown for enums with >4 options
- RadioField - Radio button group for enums with ≤4 options
- ArrayField - Dynamic arrays with add/remove/reorder controls
- UnionField - Type selector with conditional rendering
- Enhanced form routing for all field types

**Decorator Customization (Phase 5 - User Story 3)**
- 7 TypeScript decorators: @Label, @Placeholder, @HelpText, @Validate, @ControlType, @CustomControl, @UnionControl
- DecoratorProcessor with precedence: defaults → FormConfig → decorators
- Async validation support with `runAsyncValidators()`
- TextAreaField component for @ControlType('textarea')
- Custom validator functions support

**Advanced Features (Phase 6)**
- Recursive type detection with expand/collapse UI (RecursiveField)
- Readonly field support with disabled state rendering
- Generic type resolution via `TypeParser.resolveGenerics()`
- Template literal type support with pattern validation
- **Field mask auto-formatting** with real-time input transformation
- Depth-based visual hierarchy for nested structures
- Lazy rendering for performance optimization

**Vite Plugin (Phase 7)**
- Build-time integration with automatic TypeScript file processing
- Configurable include/exclude file patterns
- Schema caching with file change invalidation
- Debug mode with performance metrics
- Package export at `@mouli.dev/react-ts-forms/vite`
- Example project demonstrating plugin usage

**Polish & Production Readiness (Phase 8)**
- React.memo optimization for all field components
- Comprehensive accessibility test suite
- Keyboard navigation integration tests
- CONTRIBUTING.md with development guidelines
- Performance optimizations (memoization, callbacks)
- WCAG 2.1 AA compliance verification
- Bundle size optimization (<15KB target)

### Features

- **Type-safe form generation** from TypeScript types
- **Accessible by default** with WCAG 2.1 AA compliance
- **Real-time field masks** for template literal patterns (user-${number}, ${number}.${number}.${number}, etc.)
- **Flexible validation** (sync/async, built-in/custom)
- **Decorator-based customization** for class-based models
- **Recursive type support** with lazy expansion
- **Build-time integration** via Vite plugin
- **Tree-shakeable** with ESM exports
- **Zero dependencies** (React peer dependency only)

### Security

- Prototype pollution guards in setValueByPath (__proto__, constructor, prototype checks)
- Replaced catastrophic backtracking regexes (email validation, label generation)
- CodeQL analysis: 0 security alerts

### Performance

- Bundle size under 15KB gzipped
- Memoized components and callbacks
- Lazy rendering for recursive fields
- Schema caching in Vite plugin

### Documentation

- Comprehensive README with API reference
- 13 Storybook examples demonstrating all features
- CONTRIBUTING.md with development setup
- Example Vite project
- Complete API documentation with JSDoc comments

### Notes

This is the initial stable release of react-ts-forms, a type-driven form generator for React and TypeScript.

**What's Included:**
- Complete form generation pipeline (type parsing → schema building → rendering)
- 11 field components (TextField, NumberField, CheckboxField, DateField, SelectField, RadioField, ArrayField, UnionField, ObjectField, RecursiveField, TextAreaField)
- 7 decorators for customization
- Vite plugin for build-time integration
- Comprehensive test suite (76 passing tests)
- Full WCAG 2.1 AA accessibility compliance

**Next Steps:**
- Production deployment and npm publishing
- Community feedback integration
- Performance benchmarking
- Additional decorators and validators
- Extended TypeScript Compiler API integration for Vite plugin

[1.0.0]: https://github.com/pradeepmouli/react-ts-forms/releases/tag/v1.0.0
