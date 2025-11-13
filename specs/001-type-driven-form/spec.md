# Feature Specification: Type-Driven Form Generator

**Feature Branch**: `001-type-driven-form`  
**Created**: 2025-11-12  
**Status**: Draft  
**Input**: User description: "A react component that given a typescript type or interface, will dynamically at bundle time (or optionally statically) generate a react form akin to react-jsonschema-form"

## Clarifications

### Session 2025-11-12

- Q: Does this support runtime generation or only build-time/pre-build generation? → A: Build-time/pre-build only (no runtime generation)
- Q: Should users be able to drag-and-drop or use buttons to reorder array items, or is add/remove sufficient for MVP? → A: Add/remove plus up/down buttons for reordering
- Q: How should the form generator handle circular type references (e.g., a Node type with a `children: Node[]` field)? → A: Support unlimited depth with lazy expansion
- Q: When a field can be multiple types, how does the user select which type they want to enter? → A: Dropdown or radio buttons to select type first, then appropriate input appears
- Q: When should validation run and display errors to users? → A: Use react-jsonschema-form validation approach
- Q: How will type-level configuration be implemented? → A: Type-level configuration (control selection, custom controls, labels, validation) will use TypeScript decorators at property-level or type/interface level

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simple Form Generation from Type (Priority: P1)

A developer wants to create a data entry form for a user profile without manually coding each field. They define a TypeScript type describing the profile structure and use the component to automatically generate a working form with appropriate input controls.

**Why this priority**: This is the core value proposition - eliminating repetitive form code. It represents the minimum viable product that delivers immediate productivity gains.

**Independent Test**: Can be fully tested by providing a simple TypeScript type (e.g., user profile with string, number, boolean fields) and verifying that a complete, functional form renders with correct input types and validation.

**Acceptance Scenarios**:

1. **Given** a TypeScript type with primitive fields (string, number, boolean), **When** the developer passes the type to the form component, **Then** a form renders with appropriately typed input controls (text, number, checkbox).
2. **Given** a TypeScript type with optional and required fields, **When** the form renders, **Then** required fields show visual indicators and prevent submission when empty.
3. **Given** a valid form with user input, **When** the user submits, **Then** the component provides the data as a strongly-typed object matching the original type.
4. **Given** a TypeScript type with nested objects, **When** the form renders, **Then** nested fields are organized logically (grouped or indented visually).

---

### User Story 2 - Complex Type Support (Priority: P2)

A developer needs forms for complex data structures including arrays, unions, enums, and dates. They want the form generator to handle these TypeScript features intelligently without custom configuration.

**Why this priority**: Extends the utility beyond simple forms to handle real-world data models, significantly broadening applicability.

**Independent Test**: Can be tested independently by providing types with arrays, enums, union types, and Date fields, then verifying appropriate UI controls render (array add/remove buttons, select dropdowns, radio groups, date pickers).

**Acceptance Scenarios**:

1. **Given** a TypeScript type with an array field, **When** the form renders, **Then** users can add and remove array items dynamically with appropriate controls for each item, and use up/down arrow buttons to reorder items.
2. **Given** a TypeScript type with an enum or literal union type, **When** the form renders, **Then** a select dropdown or radio button group appears with all enum values.
3. **Given** a TypeScript type with a union type (e.g., `string | number`), **When** the form renders, **Then** a type selector (dropdown or radio buttons) appears first, and after the user selects a type, the appropriate input control for that type is displayed.
4. **Given** a TypeScript type with a Date field, **When** the form renders, **Then** a date picker or date input control appears.

---

### User Story 3 - Customization and Styling (Priority: P3)

A developer wants forms that match their application's design system. They need to customize field labels, placeholder text, validation messages, and visual styling without losing the automatic generation benefits.

**Why this priority**: Essential for production use but can be addressed after core functionality works. Developers can initially use default styling.

**Independent Test**: Can be tested by applying custom labels, placeholders, error messages, and CSS classes to generated forms and verifying the customizations are respected.

**Acceptance Scenarios**:

1. **Given** custom field labels provided via decorators on type properties, **When** the form renders, **Then** custom labels appear instead of field names.
2. **Given** custom validation messages defined via decorators, **When** validation fails, **Then** custom messages display instead of default messages.
3. **Given** custom CSS classes or style properties specified via decorators, **When** the form renders, **Then** the specified styles are applied to form elements.
4. **Given** custom component overrides specified via decorators for specific field types, **When** the form renders, **Then** custom components are used instead of default inputs.

---

### Edge Cases

- Recursive or circular type references MUST be supported with lazy expansion UI (e.g., expand/collapse controls to prevent infinite initial rendering).
- Very deeply nested object structures (10+ levels) are rendered with collapsible sections to manage visual complexity.
- Optional fields with no default values render as empty inputs that can be left blank.
- Readonly fields are rendered as disabled inputs or read-only text displays.
- Union types including null or undefined are treated as optional fields with appropriate nullable handling.
- Generic types or type parameters MUST be resolved to concrete types at build-time before form generation.
- Field names containing special characters or spaces are sanitized for HTML attributes while preserving display labels.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Component MUST accept a TypeScript type or interface definition as input and generate a complete form structure.
- **FR-002**: Component MUST render appropriate input controls for primitive types (string → text input, number → number input, boolean → checkbox).
- **FR-003**: Component MUST support nested object types by rendering grouped or hierarchically organized fields.
- **FR-004**: Component MUST support array fields with controls to add, remove, and reorder items using up/down arrow buttons.
- **FR-005**: Component MUST support enum types and literal unions by rendering select dropdowns or radio button groups.
- **FR-006**: Component MUST distinguish between required and optional fields based on TypeScript type annotations.
- **FR-007**: Component MUST provide form data as a strongly-typed object matching the input type definition.
- **FR-008**: Component MUST validate form data against the TypeScript type constraints before submission.
- **FR-009**: Component MUST generate form structure at build-time using bundler integration (pre-generation during bundling).
- **FR-010**: Component MUST display validation errors inline near the relevant form fields.
- **FR-011**: Component MUST validate fields using the same timing strategy as react-jsonschema-form (live validation as user interacts, with errors shown after first interaction with each field).
- **FR-012**: Component MUST support Date types with appropriate date/time input controls.
- **FR-013**: Component MUST allow customization of field labels, placeholders, and help text via TypeScript decorators.
- **FR-014**: Component MUST support custom validation rules beyond type constraints via TypeScript decorators.
- **FR-015**: Component MUST be accessible with proper ARIA labels, keyboard navigation, and screen reader support.
- **FR-016**: Component MUST allow custom styling through CSS classes or style properties specified via TypeScript decorators.
- **FR-017**: Component MUST support control type selection (dropdown vs radio buttons, etc.) via TypeScript decorators at property or type level.
- **FR-018**: Component MUST support recursive and circular type references with lazy expansion controls to prevent infinite UI rendering.
- **FR-017**: Component MUST handle readonly type properties by rendering them as disabled inputs or read-only displays.
- **FR-018**: Component MUST handle union types by presenting a type selector (dropdown or radio buttons) before showing the appropriate input control for the selected type.

### Key Entities

- **Form Schema**: Represents the structure derived from a TypeScript type, including field names, types, validation rules, and nesting relationships.
- **Field Definition**: Describes a single form field with its type, label, validation constraints, default value, and UI control type.
- **Form State**: Current values of all form fields, validation status, error messages, and submission state.
- **Validation Rule**: Constraint on field values (required, min/max length, pattern matching, custom validators).
- **Field Override**: Custom configuration for specific fields (label, placeholder, custom component, validators) specified via TypeScript decorators at property or type/interface level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can generate a working form from a TypeScript type in under 5 minutes including setup and customization.
- **SC-002**: Generated forms reduce form code by at least 70% compared to manually coded forms for equivalent functionality.
- **SC-003**: Forms handle at least 20 different field types automatically (string, number, boolean, Date, arrays, nested objects, enums, unions, etc.).
- **SC-004**: Generated forms meet WCAG 2.1 AA accessibility standards for all automatically generated controls.
- **SC-005**: 90% of developers can successfully create and customize a form without consulting documentation beyond basic examples.
- **SC-006**: Form validation errors appear within 100ms of user interaction (using react-jsonschema-form's live validation pattern: errors shown after first interaction with each field).
- **SC-007**: Bundle size overhead for the core library is under 15KB gzipped.

## Assumptions

- Developers using this component have TypeScript enabled in their projects with decorator support (experimentalDecorators enabled in tsconfig.json).
- The component operates within a standard React application environment.
- Form generation occurs exclusively at build-time using bundler plugins or TypeScript transformers.
- Default styling is minimal and semantic, expecting developers to apply their own design system.
- Form submission handling (HTTP requests, state management) is the developer's responsibility; this component focuses on UI generation and data collection.
- Type definitions are analyzed at build-time via TypeScript compiler API or bundler integration.
- Decorators are used for all type-level configuration including control type selection, custom components, labels, placeholders, validation rules, and styling.

