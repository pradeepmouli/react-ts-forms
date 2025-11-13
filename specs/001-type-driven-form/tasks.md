# Tasks: Type-Driven Form Generator

**Input**: Design documents from `/specs/001-type-driven-form/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are REQUIRED per constitution. Write tests FIRST and ensure they FAIL before implementation. Include unit, interaction, and a11y checks where applicable (Vitest + React Testing Library + axe).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths use TypeScript React component library structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per plan.md: src/generator/, src/components/, src/decorators/, src/types/, tests/unit/, tests/integration/, tests/a11y/
- [ ] T002 Initialize package.json with peerDependencies (react ^18.0.0, react-dom ^18.0.0, typescript ^5.6.0)
- [ ] T003 [P] Configure tsconfig.json with experimentalDecorators: true, target: ES2022, jsx: react-jsx
- [ ] T004 [P] Setup Vitest config in vitest.config.ts with jsdom environment and React Testing Library
- [ ] T005 [P] Create vitest.setup.ts with axe-core matchers for a11y testing
- [ ] T006 [P] Setup Storybook v8 with react-vite framework in .storybook/
- [ ] T007 [P] Configure build tooling in vite.config.ts for library mode with ESM output
- [ ] T008 [P] Setup size-limit in package.json with 15KB gzipped budget
- [ ] T009 Create src/index.ts as main entry point (will be populated in later phases)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create TypeScript type definitions in src/types/FormSchema.ts (FormSchema, FieldDefinition, FieldType, ControlType interfaces from data-model.md)
- [ ] T011 [P] Create TypeScript type definitions in src/types/FormState.ts (FormState interface with values, errors, touched, validating, submitted, etc.)
- [ ] T012 [P] Create TypeScript type definitions in src/types/ValidationRule.ts (ValidationRule, ValidationType, ValidationTiming interfaces)
- [ ] T013 [P] Create TypeScript type definitions in src/types/FieldProps.ts (FieldProps interface for custom components)
- [ ] T014 Create base ARIA utilities in src/components/utils/accessibility.ts (generateId, getAriaProps, getErrorId functions)
- [ ] T015 [P] Create CSS variables file in src/styles/tokens.css with --rtsf-* prefixed design tokens per contracts/api-contracts.md
- [ ] T016 [P] Setup decorator metadata registry in src/decorators/registry.ts (global Map for storing decorator metadata at build-time)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Simple Form Generation from Type (Priority: P1) 🎯 MVP

**Goal**: Enable developers to generate a working form from a TypeScript type with primitive fields (string, number, boolean) and nested objects. Form should render appropriate input controls, distinguish required vs optional fields, submit with strongly-typed data, and organize nested fields logically.

**Independent Test**: Provide a simple TypeScript type (user profile with string, number, boolean, nested object fields) and verify a complete, functional form renders with correct input types, required field indicators, and successful submission with typed output.

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T017 [P] [US1] Create unit tests for TypeParser in tests/unit/generator/TypeParser.test.ts (test primitive type parsing: string→text, number→number, boolean→checkbox)
- [ ] T018 [P] [US1] Create unit tests for SchemaBuilder in tests/unit/generator/SchemaBuilder.test.ts (test FormSchema generation from type definitions)
- [ ] T019 [P] [US1] Create unit tests for TextField component in tests/unit/fields/TextField.test.tsx (test rendering, onChange, onBlur, error display)
- [ ] T020 [P] [US1] Create unit tests for NumberField component in tests/unit/fields/NumberField.test.tsx (test number input behavior)
- [ ] T021 [P] [US1] Create unit tests for CheckboxField component in tests/unit/fields/CheckboxField.test.tsx (test checkbox behavior)
- [ ] T022 [P] [US1] Create unit tests for ObjectField component in tests/unit/fields/ObjectField.test.tsx (test nested field grouping with fieldset)
- [ ] T023 [P] [US1] Create integration test for simple form generation in tests/integration/simple-form-generation.test.tsx (end-to-end: type → schema → rendered form)
- [ ] T024 [P] [US1] Create integration test for form submission in tests/integration/form-submission.test.tsx (test typed data output on submit)
- [ ] T025 [P] [US1] Create a11y test for TextField in tests/a11y/field-accessibility.test.tsx (axe-core scan, ARIA labels, keyboard nav)
- [ ] T026 [P] [US1] Create a11y test for form structure in tests/a11y/form-structure.test.tsx (test fieldset/legend for nested objects, label association)

### Implementation for User Story 1

**Build-time Generator Components**

- [ ] T027 [P] [US1] Implement TypeParser.parseType() in src/generator/TypeParser.ts (parse primitives, detect required vs optional, extract nested objects)
- [ ] T028 [US1] Implement TypeParser.resolvePrimitiveType() in src/generator/TypeParser.ts (map TS types to FieldType: string, number, boolean)
- [ ] T029 [US1] Implement SchemaBuilder.buildSchema() in src/generator/SchemaBuilder.ts (create FormSchema from parsed type with default labels from field names)
- [ ] T030 [US1] Implement SchemaBuilder.generateDefaultLabel() in src/generator/SchemaBuilder.ts (convert camelCase to "Title Case" for labels)

**Runtime Field Components**

- [ ] T031 [P] [US1] Create TextField component in src/components/fields/TextField.tsx (text input with label, error display, ARIA attributes)
- [ ] T032 [P] [US1] Create NumberField component in src/components/fields/NumberField.tsx (number input with step, min, max support)
- [ ] T033 [P] [US1] Create CheckboxField component in src/components/fields/CheckboxField.tsx (checkbox with label, checked state)
- [ ] T034 [P] [US1] Create ObjectField component in src/components/fields/ObjectField.tsx (fieldset wrapper with legend for nested fields)
- [ ] T035 [US1] Implement field rendering logic in src/components/FormGenerator.tsx (map FieldDefinition to appropriate field component)

**Form State Management**

- [ ] T036 [US1] Implement useFormState hook in src/components/FormGenerator.tsx (manage values, errors, touched, submitted state)
- [ ] T037 [US1] Implement handleFieldChange in src/components/FormGenerator.tsx (update field value in form state, trigger onChange callback)
- [ ] T038 [US1] Implement handleFieldBlur in src/components/FormGenerator.tsx (mark field as touched)
- [ ] T039 [US1] Implement handleSubmit in src/components/FormGenerator.tsx (validate all fields, call onSubmit if valid, focus first error if invalid)

**Validation Engine (Basic)**

- [ ] T040 [US1] Implement validation.validateField() in src/components/utils/validation.ts (check required fields, return error messages)
- [ ] T041 [US1] Implement validation.validateForm() in src/components/utils/validation.ts (run all field validations, return errors map)

**Public Exports & Documentation**

- [ ] T042 [US1] Export FormGenerator, TextField, NumberField, CheckboxField, ObjectField from src/index.ts
- [ ] T043 [US1] Export FormSchema, FieldDefinition, FormState types from src/index.ts
- [ ] T044 [US1] Create Storybook story for simple form in src/components/FormGenerator.stories.tsx (user profile example from quickstart.md)
- [ ] T045 [US1] Update README.md with quick start example (basic usage: type → form)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Developers can generate forms from simple TypeScript types with primitives and nested objects.

---

## Phase 4: User Story 2 - Complex Type Support (Priority: P2)

**Goal**: Extend form generator to handle complex TypeScript features: arrays (with add/remove/reorder), enums, union types, and Date fields. Forms should render appropriate controls automatically without custom configuration.

**Independent Test**: Provide types with arrays, enums, union types, and Date fields. Verify array controls (add/remove/reorder buttons), enum select dropdowns, union type selectors, and date pickers render correctly.

### Tests for User Story 2 (MANDATORY) ⚠️

- [ ] T046 [P] [US2] Create unit tests for array type parsing in tests/unit/generator/TypeParser.test.ts (test array detection, item type extraction)
- [ ] T047 [P] [US2] Create unit tests for enum/union type parsing in tests/unit/generator/TypeParser.test.ts (test enum value extraction, union variant detection)
- [ ] T048 [P] [US2] Create unit tests for ArrayField component in tests/unit/fields/ArrayField.test.tsx (test add/remove/reorder behavior)
- [ ] T049 [P] [US2] Create unit tests for SelectField component in tests/unit/fields/SelectField.test.tsx (test enum options rendering)
- [ ] T050 [P] [US2] Create unit tests for UnionField component in tests/unit/fields/UnionField.test.tsx (test type selector, conditional input display)
- [ ] T051 [P] [US2] Create unit tests for DateField component in tests/unit/fields/DateField.test.tsx (test date input behavior)
- [ ] T052 [P] [US2] Create integration test for array handling in tests/integration/array-fields.test.tsx (test dynamic add/remove/reorder)
- [ ] T053 [P] [US2] Create integration test for union types in tests/integration/union-types.test.tsx (test type selection → appropriate input)
- [ ] T054 [P] [US2] Create a11y test for ArrayField in tests/a11y/array-accessibility.test.tsx (test ARIA labels on add/remove/reorder buttons, keyboard nav)
- [ ] T055 [P] [US2] Create interaction test for array reordering in tests/integration/array-reorder.test.tsx (test up/down button behavior, state updates)

### Implementation for User Story 2

**Build-time Generator Enhancements**

- [ ] T056 [P] [US2] Extend TypeParser.parseType() to detect array types in src/generator/TypeParser.ts (extract array item type, create arrayItemDefinition)
- [ ] T057 [P] [US2] Extend TypeParser.parseType() to detect enum types in src/generator/TypeParser.ts (extract enum values with labels)
- [ ] T058 [P] [US2] Extend TypeParser.parseType() to detect union types in src/generator/TypeParser.ts (create unionVariants array, determine selector control type)
- [ ] T059 [P] [US2] Extend TypeParser.parseType() to detect Date types in src/generator/TypeParser.ts (map to date FieldType)
- [ ] T060 [US2] Implement TypeParser.resolveUnionSelectorType() in src/generator/TypeParser.ts (radio for ≤4 variants, select for >4 per research.md)

**Runtime Field Components**

- [ ] T061 [P] [US2] Create ArrayField component in src/components/fields/ArrayField.tsx (render array items, add/remove/reorder buttons with ARIA labels)
- [ ] T062 [P] [US2] Create SelectField component in src/components/fields/SelectField.tsx (dropdown for enums with option elements)
- [ ] T063 [P] [US2] Create RadioField component in src/components/fields/RadioField.tsx (radio button group for small enums/unions)
- [ ] T064 [P] [US2] Create UnionField component in src/components/fields/UnionField.tsx (type selector + conditional input rendering)
- [ ] T065 [P] [US2] Create DateField component in src/components/fields/DateField.tsx (date input with proper ARIA semantics)
- [ ] T066 [US2] Update FormGenerator field mapping in src/components/FormGenerator.tsx (add cases for array, enum, union, date FieldTypes)

**Array State Management**

- [ ] T067 [US2] Extend useFormState to track array items in src/components/FormGenerator.tsx (handle dynamic add/remove/reorder in values state)
- [ ] T068 [US2] Implement handleArrayAdd in src/components/FormGenerator.tsx (append new item with default value to array)
- [ ] T069 [US2] Implement handleArrayRemove in src/components/FormGenerator.tsx (remove item at index, update state)
- [ ] T070 [US2] Implement handleArrayReorder in src/components/FormGenerator.tsx (swap items at indices, update state)

**Union State Management**

- [ ] T071 [US2] Extend useFormState to track selectedUnionVariants in src/components/FormGenerator.tsx (store selected type per union field)
- [ ] T072 [US2] Implement handleUnionTypeChange in src/components/FormGenerator.tsx (update selected variant, clear field value)

**Public Exports & Documentation**

- [ ] T073 [US2] Export ArrayField, SelectField, RadioField, UnionField, DateField from src/index.ts
- [ ] T074 [US2] Create Storybook story for arrays in src/components/FormGenerator.stories.tsx (array add/remove/reorder demo)
- [ ] T075 [US2] Create Storybook story for enums in src/components/FormGenerator.stories.tsx (enum select dropdown demo)
- [ ] T076 [US2] Create Storybook story for unions in src/components/FormGenerator.stories.tsx (union type selector demo)
- [ ] T077 [US2] Create Storybook story for dates in src/components/FormGenerator.stories.tsx (date picker demo)
- [ ] T078 [US2] Update README.md with complex type examples (arrays, enums, unions, dates from quickstart.md)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Forms support arrays, enums, union types, and Date fields.

---

## Phase 5: User Story 3 - Customization and Styling (Priority: P3)

**Goal**: Enable developers to customize generated forms with custom labels, placeholders, validation messages, and styling using TypeScript decorators. Allow custom component overrides while maintaining automatic generation benefits.

**Independent Test**: Apply @Label, @Placeholder, @Validate, @CustomControl, @ControlType decorators to type properties. Verify customizations appear in rendered form (custom labels, placeholders, error messages, styles, custom components).

### Tests for User Story 3 (MANDATORY) ⚠️

- [ ] T079 [P] [US3] Create unit tests for DecoratorProcessor in tests/unit/generator/DecoratorProcessor.test.ts (test decorator metadata extraction)
- [ ] T080 [P] [US3] Create unit tests for decorator functions in tests/unit/decorators/decorators.test.ts (test @Label, @Placeholder, @Validate decorator factories)
- [ ] T081 [P] [US3] Create integration test for decorator customization in tests/integration/decorator-customization.test.tsx (test decorators → rendered customizations)
- [ ] T082 [P] [US3] Create unit tests for custom validation in tests/unit/validation.test.ts (test custom validator functions, async validation)
- [ ] T083 [P] [US3] Create integration test for custom components in tests/integration/custom-components.test.tsx (test @CustomControl decorator → custom component rendered)

### Implementation for User Story 3

**Decorator Definitions**

- [ ] T084 [P] [US3] Implement @Label decorator factory in src/decorators/Label.ts (store custom label in registry)
- [ ] T085 [P] [US3] Implement @Placeholder decorator factory in src/decorators/Placeholder.ts (store placeholder in registry)
- [ ] T086 [P] [US3] Implement @HelpText decorator factory in src/decorators/HelpText.ts (store help text in registry)
- [ ] T087 [P] [US3] Implement @Validate decorator factory in src/decorators/Validate.ts (store validation rules in registry)
- [ ] T088 [P] [US3] Implement @CustomControl decorator factory in src/decorators/CustomControl.ts (store custom component in registry)
- [ ] T089 [P] [US3] Implement @ControlType decorator factory in src/decorators/ControlType.ts (store control type override in registry)
- [ ] T090 [P] [US3] Implement @UnionControl decorator factory in src/decorators/UnionControl.ts (store union selector type in registry)

**Decorator Processing**

- [ ] T091 [US3] Implement DecoratorProcessor.extractMetadata() in src/generator/DecoratorProcessor.ts (read decorator metadata from registry for given type)
- [ ] T092 [US3] Implement DecoratorProcessor.applyFieldOverrides() in src/generator/DecoratorProcessor.ts (merge decorator metadata into FieldDefinition)
- [ ] T093 [US3] Update SchemaBuilder.buildSchema() in src/generator/SchemaBuilder.ts (integrate DecoratorProcessor to apply overrides)

**Validation Engine Enhancements**

- [ ] T094 [US3] Extend validation.validateField() to support custom validators in src/components/utils/validation.ts (execute ValidationRule.validator functions)
- [ ] T095 [US3] Implement validation.runAsyncValidators() in src/components/utils/validation.ts (handle async validation with loading state)
- [ ] T096 [US3] Extend useFormState to track validating set in src/components/FormGenerator.tsx (track fields with in-progress async validation)
- [ ] T097 [US3] Implement built-in validators in src/components/utils/validation.ts (min, max, minLength, maxLength, pattern, email, url)

**Custom Component Support**

- [ ] T098 [US3] Update field rendering in FormGenerator.tsx to check for customComponent in FieldDefinition (render custom component if present)
- [ ] T099 [US3] Implement FieldProps adapter in src/components/FormGenerator.tsx (pass correct props to custom components per FieldProps interface)

**Styling Support**

- [ ] T100 [US3] Apply className and style from FieldDefinition to field wrappers in all field components (TextField, NumberField, etc.)
- [ ] T101 [US3] Update FormGenerator to accept className and style props in src/components/FormGenerator.tsx (apply to form container)

**Public Exports & Documentation**

- [ ] T102 [US3] Export all decorators from src/index.ts (@Label, @Placeholder, @HelpText, @Validate, @CustomControl, @ControlType, @UnionControl)
- [ ] T103 [US3] Export FieldProps interface from src/index.ts (for custom component authors)
- [ ] T104 [US3] Create Storybook story for custom labels in src/components/FormGenerator.stories.tsx (decorator examples)
- [ ] T105 [US3] Create Storybook story for custom validation in src/components/FormGenerator.stories.tsx (custom validators, error messages)
- [ ] T106 [US3] Create Storybook story for custom components in src/components/FormGenerator.stories.tsx (RichTextEditor example from quickstart.md)
- [ ] T107 [US3] Create Storybook story for custom styling in src/components/FormGenerator.stories.tsx (CSS variables demo, className demo)
- [ ] T108 [US3] Update README.md with decorator API reference and customization examples

**Checkpoint**: All three user stories are now independently functional. Forms support full customization via decorators.

---

## Phase 6: Advanced Features & Edge Cases

**Goal**: Handle edge cases and advanced scenarios identified in spec.md (recursive types, readonly fields, deep nesting, special characters in field names)

### Tests for Advanced Features (MANDATORY) ⚠️

- [ ] T109 [P] Create unit tests for recursive type detection in tests/unit/generator/TypeParser.test.ts (test circular reference detection)
- [ ] T110 [P] Create unit tests for RecursiveField component in tests/unit/fields/RecursiveField.test.tsx (test expand/collapse behavior)
- [ ] T111 [P] Create integration test for recursive types in tests/integration/recursive-types.test.tsx (test lazy expansion UI)
- [ ] T112 [P] Create a11y test for RecursiveField in tests/a11y/recursive-accessibility.test.tsx (test aria-expanded, keyboard nav)
- [ ] T113 [P] Create unit tests for readonly field handling in tests/unit/fields/readonly-fields.test.tsx (test disabled state rendering)

### Implementation of Advanced Features

**Recursive Type Support**

- [ ] T114 [P] Extend TypeParser.parseType() to detect recursive references in src/generator/TypeParser.ts (track visited types, create recursiveTypeRef)
- [ ] T115 [P] Create RecursiveField component in src/components/fields/RecursiveField.tsx (expand/collapse button with ARIA expanded state)
- [ ] T116 Extend useFormState to track expandedRecursiveFields in src/components/FormGenerator.tsx (store expanded state per field path)
- [ ] T117 Implement handleRecursiveToggle in src/components/FormGenerator.tsx (toggle expanded state for recursive field)
- [ ] T118 Update FormGenerator field mapping to handle recursive FieldType in src/components/FormGenerator.tsx (render RecursiveField)

**Readonly Field Support**

- [ ] T119 [P] Extend TypeParser.parseType() to detect readonly modifiers in src/generator/TypeParser.ts (set readonly flag in FieldDefinition)
- [ ] T120 Update all field components to respect readonly prop (render as disabled input or read-only text per field type)

**Deep Nesting & Special Characters**

- [ ] T121 [P] Implement field path sanitization in src/components/utils/accessibility.ts (sanitize special characters for HTML attributes)
- [ ] T122 Update ObjectField to add visual hierarchy for deep nesting in src/components/fields/ObjectField.tsx (indentation, borders, collapsible sections)

**Generic Type Resolution**

- [ ] T123 Implement TypeParser.resolveGenerics() in src/generator/TypeParser.ts (resolve type parameters to concrete types at build-time)

**Public Exports & Documentation**

- [ ] T124 Export RecursiveField from src/index.ts
- [ ] T125 Create Storybook story for recursive types in src/components/FormGenerator.stories.tsx (TreeNode example from quickstart.md)
- [ ] T126 Create Storybook story for readonly fields in src/components/FormGenerator.stories.tsx (disabled input demo)
- [ ] T127 Update README.md with edge case handling examples

**Checkpoint**: All edge cases and advanced features from spec.md are now supported.

---

## Phase 7: Vite Plugin (Build-time Integration)

**Goal**: Create Vite plugin for automatic type introspection during bundling, enabling seamless developer experience.

### Tests for Vite Plugin (MANDATORY) ⚠️

- [ ] T128 [P] Create unit tests for plugin module resolution in tests/unit/vite-plugin.test.ts (test file matching, exclusion)
- [ ] T129 [P] Create integration test for plugin in tests/integration/vite-plugin-integration.test.ts (test schema generation in mock Vite build)

### Implementation of Vite Plugin

- [ ] T130 [P] Create plugin entry point in src/vite-plugin/index.ts (export typeFormPlugin function per contracts/api-contracts.md)
- [ ] T131 Create plugin implementation in src/vite-plugin/plugin.ts (implement Vite Plugin interface, hook into transform)
- [ ] T132 Integrate TypeParser in plugin.ts to analyze imported types (parse TypeScript AST during transform hook)
- [ ] T133 Implement schema caching in plugin.ts (cache parsed schemas, invalidate on file changes)
- [ ] T134 Implement debug mode logging in plugin.ts (emit performance metrics when debug: true)
- [ ] T135 Create plugin configuration validator in src/vite-plugin/config.ts (validate TypeFormPluginOptions)
- [ ] T136 Export plugin from package.json (add "exports": { "./vite": "./dist/vite-plugin/index.js" })
- [ ] T137 Create Vite plugin example in examples/vite-basic/ (demonstrate plugin setup in vite.config.ts)
- [ ] T138 Update README.md with Vite plugin installation and configuration instructions

**Checkpoint**: Build-time generation is now fully automated via Vite plugin.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, final documentation, and production readiness

**Documentation & Examples**

- [ ] T139 [P] Create comprehensive README.md in repository root (installation, features, quick start, API reference, contributing)
- [ ] T140 [P] Create CONTRIBUTING.md with development setup, testing guidelines, PR process
- [ ] T141 [P] Validate all quickstart.md examples in tests/integration/quickstart-validation.test.tsx (ensure examples work as documented)
- [ ] T142 [P] Create API documentation site scaffold in docs/ (optional: use Storybook docs addon)
- [ ] T143 [P] Update CHANGELOG.md with v1.0.0 feature list and breaking changes (none for v1.0.0)

**Accessibility Verification**

- [ ] T144 Create comprehensive a11y test suite in tests/a11y/comprehensive-a11y.test.tsx (scan all field types with axe-core)
- [ ] T145 Create keyboard navigation integration test in tests/a11y/keyboard-navigation.test.tsx (test Tab, Enter, Space, Arrow keys)
- [ ] T146 Create screen reader test in tests/a11y/screen-reader.test.tsx (verify ARIA live regions, announcements)
- [ ] T147 Audit all components for WCAG 2.1 AA compliance (focus indicators, color contrast, semantic HTML)

**Performance Optimization**

- [ ] T148 [P] Add React.memo to all field components (TextField, NumberField, CheckboxField, etc.)
- [ ] T149 [P] Optimize FormGenerator re-renders with useCallback for all handlers (onChange, onBlur, onSubmit)
- [ ] T150 [P] Optimize schema computation with useMemo in FormGenerator.tsx
- [ ] T151 Run bundle size analysis with size-limit (verify <15KB gzipped)
- [ ] T152 Add performance benchmarks in tests/performance/ (measure validation <100ms, rendering 50+ fields)

**Code Quality & Refactoring**

- [ ] T153 [P] Add comprehensive JSDoc comments to all public APIs (FormGenerator props, decorator functions, exported types)
- [ ] T154 [P] Run oxlint on all source files and fix violations
- [ ] T155 [P] Run oxfmt to format all source files
- [ ] T156 Refactor shared logic into utility functions (DRY principle)
- [ ] T157 Add error boundaries for graceful degradation in FormGenerator.tsx

**Type Safety Verification**

- [ ] T158 [P] Verify type inference works correctly in all examples (test TypeScript compiler output)
- [ ] T159 [P] Add strict type checks to CI pipeline (tsc --noEmit)
- [ ] T160 Create type-safety test cases in tests/unit/type-safety.test.ts (compile-time type checking)

**Build & Packaging**

- [ ] T161 Configure package.json exports for ESM (main, module, types fields)
- [ ] T162 Generate TypeScript declaration files (.d.ts) during build
- [ ] T163 Verify tree-shaking works (test with bundlephobia or webpack-bundle-analyzer)
- [ ] T164 Test package installation in clean project (pnpm pack, install tarball, verify imports)

**Final Validation**

- [ ] T165 Run full test suite (unit + integration + a11y) and ensure 90%+ coverage
- [ ] T166 Run Storybook build and verify all stories render correctly
- [ ] T167 Perform manual QA of all user stories end-to-end
- [ ] T168 Review all TODOs and ensure none remain (or have owner + deadline ≤ 2 weeks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - MVP complete after this
- **User Story 2 (Phase 4)**: Depends on Foundational phase - Can run in parallel with US1 but typically sequential
- **User Story 3 (Phase 5)**: Depends on Foundational phase - Can run in parallel with US1/US2 but typically sequential
- **Advanced Features (Phase 6)**: Depends on US1/US2 completion (uses field components)
- **Vite Plugin (Phase 7)**: Depends on generator components (TypeParser, SchemaBuilder, DecoratorProcessor)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - Pure foundation for form generation
- **User Story 2 (P2)**: Extends US1 field components - Can integrate but independently testable
- **User Story 3 (P3)**: Decorates any field from US1/US2 - Can integrate but independently testable

### Within Each User Story

1. Tests MUST be written and FAIL before implementation
2. Type definitions before implementations
3. Generator components (TypeParser, SchemaBuilder) before runtime components
4. Individual field components before FormGenerator integration
5. Core form state management before advanced features (validation, customization)
6. Story complete and tested before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T003, T004, T005, T006, T007, T008 can all run in parallel

**Foundational Phase (Phase 2)**:
- T011, T012, T013, T015, T016 can all run in parallel after T010

**User Story 1 - Tests**:
- T017-T026 can all run in parallel (all create new test files)

**User Story 1 - Implementation**:
- T027, T031, T032, T033, T034 can run in parallel (different files)

**User Story 2 - Tests**:
- T046-T055 can all run in parallel

**User Story 2 - Implementation**:
- T056, T057, T058, T059 can run in parallel (all extend TypeParser)
- T061, T062, T063, T064, T065 can run in parallel (different field components)

**User Story 3 - Tests**:
- T079-T083 can all run in parallel

**User Story 3 - Implementation**:
- T084-T090 can all run in parallel (different decorator files)

**Advanced Features - Tests**:
- T109, T110, T111, T112, T113 can all run in parallel

**Advanced Features - Implementation**:
- T114, T115, T119, T121 can run in parallel (different files)

**Vite Plugin - Tests**:
- T128, T129 can run in parallel

**Vite Plugin - Implementation**:
- T130, T135 can run in parallel

**Polish Phase**:
- All documentation tasks (T139-T143) can run in parallel
- All performance tasks (T148-T150) can run in parallel
- All code quality tasks (T153-T155) can run in parallel
- All type safety tasks (T158-T160) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Terminal 1: Tests (T017-T026 in parallel)
pnpm test tests/unit/generator/TypeParser.test.ts --watch &
pnpm test tests/unit/fields/ --watch &

# Terminal 2: Generator implementation (T027-T030)
# Implement TypeParser and SchemaBuilder

# Terminal 3: Field components (T031-T034 in parallel)
# Implement TextField, NumberField, CheckboxField, ObjectField

# Terminal 4: FormGenerator (T035-T039)
# Implement FormGenerator with state management

# Terminal 5: Integration (T042-T045)
# Wire up exports, stories, docs
```

---

## Implementation Strategy

### MVP Scope (v1.0.0)

**MUST HAVE**:
- User Story 1 (P1): Simple form generation - Core value proposition
- User Story 2 (P2): Complex type support - Real-world applicability
- User Story 3 (P3): Customization - Production readiness
- Advanced Features (Phase 6): Edge case handling - Robustness
- Vite Plugin (Phase 7): Developer experience - Seamless integration

**Incremental Delivery**:
1. **Alpha (US1 only)**: Developers can generate simple forms - Validate core concept
2. **Beta (US1 + US2)**: Handle complex types - Real-world testing
3. **RC (US1 + US2 + US3)**: Full customization - Production feedback
4. **v1.0.0 (All phases)**: Complete feature set - Public release

### Task Count Summary

- **Phase 1 (Setup)**: 9 tasks
- **Phase 2 (Foundational)**: 7 tasks
- **Phase 3 (User Story 1)**: 29 tasks (10 tests + 19 implementation)
- **Phase 4 (User Story 2)**: 33 tasks (10 tests + 23 implementation)
- **Phase 5 (User Story 3)**: 30 tasks (5 tests + 25 implementation)
- **Phase 6 (Advanced Features)**: 19 tasks (5 tests + 14 implementation)
- **Phase 7 (Vite Plugin)**: 11 tasks (2 tests + 9 implementation)
- **Phase 8 (Polish)**: 30 tasks

**Total**: 168 tasks

### Parallel Execution Summary

- Setup phase: 6 tasks can run in parallel
- Foundational phase: 5 tasks can run in parallel
- User Story 1: ~15 tasks can run in parallel (tests + field components)
- User Story 2: ~15 tasks can run in parallel (tests + field components)
- User Story 3: ~12 tasks can run in parallel (tests + decorators)
- Advanced Features: ~6 tasks can run in parallel
- Vite Plugin: 2 tasks can run in parallel
- Polish: ~12 tasks can run in parallel

**Estimated parallelization**: With 3-4 developers, phases 3-5 can overlap significantly after foundational phase completes.

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description`
✅ All user story tasks labeled (US1, US2, US3)
✅ All parallelizable tasks marked [P]
✅ All tasks include specific file paths
✅ Tests written BEFORE implementation (FAIL-first approach)
✅ Tasks organized by user story for independent delivery
✅ Clear checkpoints after each phase
✅ Dependencies documented
✅ Parallel opportunities identified
