# Phase 0: Research - Type-Driven Form Generator

**Branch**: `001-type-driven-form` | **Date**: 2025-11-12

## Research Questions

### 1. TypeScript Decorator Implementation Patterns

**Question**: What are the best practices for implementing TypeScript decorators for property-level and type-level metadata, especially with experimentalDecorators?

**Findings**:
- TypeScript decorators (Stage 2) require `experimentalDecorators: true` in tsconfig.json
- Property decorators receive `(target, propertyKey)` parameters
- Class decorators receive `(constructor)` parameter
- Metadata storage options:
  - Store in WeakMap keyed by class prototype (runtime access)
  - Emit metadata via custom transformer for build-time access
  - Use Symbol properties on target to avoid enumeration
- Decorator factories (functions returning decorators) enable parameterization: `@Label("Custom Label")`
- Composition pattern: Multiple decorators on same property execute bottom-to-top
- Type safety: Use generics to constrain decorator targets (`PropertyDecorator`, `ClassDecorator`)

**Decision**: Use decorator factories for all customization APIs (`@Label()`, `@Validate()`, `@CustomControl()`). Store metadata in a global registry (Map keyed by type name + property key) that the build-time TypeParser can access. Decorators will be purely metadata markers; no runtime behavior.

**Rationale**: Decorator factories provide best DX (clear parameter syntax), and build-time registry access aligns with our build-time-only constraint.

---

### 2. Build-Time Type Introspection Approaches

**Question**: Should we use TypeScript Compiler API directly or build a Vite/webpack plugin for type introspection?

**Findings**:

**Option A: TypeScript Compiler API**
- Pros:
  - Full access to type system, AST, and resolved types
  - Can analyze types across file boundaries
  - Supports complex type operations (union resolution, recursive type expansion)
  - Framework-agnostic (works with any bundler)
- Cons:
  - Manual file discovery and program setup
  - Must handle tsconfig.json resolution
  - No automatic cache invalidation (must track file changes)
  - Higher complexity for consumers (need separate build step or manual integration)

**Option B: Vite Plugin**
- Pros:
  - Automatic HMR and cache invalidation
  - Integrates seamlessly with Vite dev server
  - Can hook into module resolution
  - Better DX for Vite users (add plugin, done)
- Cons:
  - Vite-specific (locks out webpack/Rollup/esbuild users)
  - Must still use TS Compiler API under the hood for type analysis
  - Plugin API complexity

**Option C: Webpack Plugin**
- Similar trade-offs to Vite but for webpack ecosystem
- More complex plugin API than Vite

**Option D: Hybrid Approach**
- Core library uses TS Compiler API
- Provide Vite plugin wrapper + webpack plugin wrapper
- Consumers choose based on their bundler

**Decision**: Start with **Hybrid Approach** - build core TypeParser using TypeScript Compiler API, then create thin Vite plugin wrapper for v1.0.0. Defer webpack plugin to v1.1.0 based on demand.

**Rationale**: Vite is our primary build tool (per constitution), so Vite plugin provides best DX for target users. Core TS Compiler API implementation keeps the door open for other bundlers without rewriting logic.

---

### 3. Form Generation Patterns from react-jsonschema-form

**Question**: What patterns from react-jsonschema-form should we adopt for validation timing, error display, and field rendering?

**Findings from react-jsonschema-form**:
- **Validation timing**: "Live validation" mode validates on every change but only shows errors after first blur for each field (avoids "error spam" while typing)
- **Error display**: Errors appear inline below field + summary at top of form
- **Field widgets**: Pluggable widget system allows custom components per field type
- **Array fields**: Toolbox buttons (add, remove, move up, move down) positioned above/below each item
- **Object fields**: Nested fieldsets with legend for grouping
- **Conditional fields**: Fields can be hidden based on other field values (out of scope for MVP)

**Decision**: Adopt the following patterns:
1. **Validation timing**: Live validation after first blur (per FR-011)
2. **Error display**: Inline errors with aria-describedby linking to field
3. **Field widgets**: Decorator-based widget override (`@CustomControl(MyComponent)`)
4. **Array controls**: Add button at bottom, remove/up/down buttons for each item
5. **Object fields**: Use fieldset + legend for nested objects

**Rationale**: These patterns are proven in production and align with our accessibility requirements (ARIA linkage, keyboard navigation).

---

### 4. Lazy Expansion UI Patterns for Recursive Types

**Question**: How should we handle recursive types (e.g., `Node { children: Node[] }`) to prevent infinite rendering?

**Findings**:
- **Lazy rendering**: Only render nested levels when user explicitly expands
- **Expansion controls**: Button or chevron icon to toggle visibility
- **ARIA states**: Use `aria-expanded="true|false"` on expand button
- **Depth tracking**: Pass current depth as prop to prevent accidental infinite loops
- **Visual indicators**: Indent nested levels, use border or background color to show hierarchy
- **Default expansion**: Top level expanded, all nested levels collapsed initially
- **Max depth**: Optional prop to limit total depth (prevent performance issues)

**Decision**: Implement expand/collapse toggle button for recursive fields. Track depth in component state, render children only when expanded. Default: top-level expanded, nested collapsed. No max depth limit for MVP (trust users to manage complexity).

**Rationale**: Matches user expectation from file explorers and JSON viewers. ARIA expanded state ensures accessibility.

---

### 5. Union Type Selector UI Patterns

**Question**: What's the best UX for selecting which variant of a union type (e.g., `string | number | ComplexObject`) the user wants to enter?

**Findings**:
- **Radio buttons**: Best for 2-4 variants, fully keyboard accessible, visually clear
- **Select dropdown**: Best for 5+ variants, conserves space
- **Segmented control**: iOS-style toggle for 2-3 variants (not native HTML, requires custom styling)
- **Type inference**: Some tools try to infer type from input (error-prone, confusing)

**Decision**: 
- Use **radio buttons** for unions with ≤4 variants
- Use **select dropdown** for unions with >4 variants
- Once variant selected, show appropriate input control for that type
- Allow re-selection (changing variant clears current value)
- Decorator override: `@UnionControl('radio' | 'select')` to force specific control

**Rationale**: Radio buttons provide clearest affordance for small sets, dropdown scales better for large sets. Automatic selection based on count optimizes for common case while allowing override.

---

## Research Summary

| Decision | Approach | Deferred |
|----------|----------|----------|
| Decorator implementation | Decorator factories with global registry for build-time access | - |
| Type introspection | Hybrid: TS Compiler API core + Vite plugin wrapper | Webpack plugin (v1.1.0) |
| Validation timing | Live validation after first blur (react-jsonschema-form pattern) | - |
| Error display | Inline with aria-describedby | Error summary (v1.1.0) |
| Array controls | Add at bottom, remove/up/down per item | Drag-and-drop reordering (v1.2.0) |
| Recursive types | Expand/collapse toggle, ARIA expanded, depth tracking | Max depth limit (future) |
| Union type selection | Auto-select radio (≤4) or dropdown (>4), decorator override | Type inference (rejected) |

## Open Questions

None - all research questions resolved for MVP.

## Dependencies Identified

- `typescript` (peer dependency - already required by consumers)
- `@types/react` (peer dependency)
- No additional runtime dependencies (keeps bundle size low)
- Vite plugin dev dependency for plugin wrapper

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| TypeScript version compatibility | Breaking changes in TS Compiler API | Pin to TS 5.6+, document supported versions, test against multiple TS versions in CI |
| Decorator spec changes | Stage 3 decorators differ from experimentalDecorators | Document that we use Stage 2 decorators, plan migration path if Stage 3 stabilizes |
| Build-time performance | Large types could slow bundling | Implement caching of parsed types, provide build-time performance metrics, lazy parse on demand |
| Complex type edge cases | Some TS types may not be representable as forms | Document unsupported types (mapped types, conditional types, template literals), provide escape hatch via `@CustomControl` |
