# Phase 1: Data Model - Type-Driven Form Generator

**Branch**: `001-type-driven-form` | **Date**: 2025-11-12

## Entity Definitions

### 1. Form Schema

**Purpose**: Represents the complete structure of a form derived from a TypeScript type definition. This is the output of the build-time type introspection process and the input to the runtime FormGenerator component.

**Structure**:
```typescript
interface FormSchema {
  /** Unique identifier for the schema (typically the type name) */
  id: string;
  
  /** Human-readable title for the form (defaults to type name) */
  title: string;
  
  /** Optional description for the form */
  description?: string;
  
  /** Root fields in the form */
  fields: FieldDefinition[];
  
  /** Global validation rules that apply to the entire form */
  globalValidators?: ValidationRule[];
  
  /** Metadata from type-level decorators */
  metadata?: Record<string, unknown>;
}
```

**Relationships**:
- Contains many `FieldDefinition` entities (one per property in the TypeScript type)
- May contain global `ValidationRule` entities

**Constraints**:
- `id` must be unique within the application
- `fields` array must not be empty (a form with no fields is invalid)
- `title` defaults to `id` if not provided

**Lifecycle**: Created at build-time by TypeParser → passed to FormGenerator at runtime → immutable during form lifetime

---

### 2. Field Definition

**Purpose**: Describes a single form field including its type, label, validation rules, and UI control configuration. This is the core unit of form structure.

**Structure**:
```typescript
interface FieldDefinition {
  /** Field name (matches TypeScript property name) */
  name: string;
  
  /** Field type (primitive, array, object, enum, union, etc.) */
  type: FieldType;
  
  /** Display label (defaults to formatted name) */
  label: string;
  
  /** Whether the field is required (from TypeScript type annotation) */
  required: boolean;
  
  /** Whether the field is readonly */
  readonly: boolean;
  
  /** Default value for the field */
  defaultValue?: unknown;
  
  /** Placeholder text for input controls */
  placeholder?: string;
  
  /** Help text displayed below the field */
  helpText?: string;
  
  /** Validation rules for this field */
  validators?: ValidationRule[];
  
  /** UI control type (text, number, select, etc.) */
  controlType?: ControlType;
  
  /** Custom component to render instead of default control */
  customComponent?: React.ComponentType<FieldProps>;
  
  /** For object types: nested field definitions */
  nestedFields?: FieldDefinition[];
  
  /** For array types: definition of array item fields */
  arrayItemDefinition?: FieldDefinition;
  
  /** For enum/union types: possible values */
  enumValues?: Array<{ value: unknown; label: string }>;
  
  /** For union types: definitions for each variant */
  unionVariants?: FieldDefinition[];
  
  /** For recursive types: reference to parent type to enable lazy expansion */
  recursiveTypeRef?: string;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
  
  /** Additional metadata from decorators */
  metadata?: Record<string, unknown>;
}

type FieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'enum' 
  | 'array' 
  | 'object' 
  | 'union'
  | 'recursive';

type ControlType = 
  | 'text' 
  | 'number' 
  | 'checkbox' 
  | 'select' 
  | 'radio' 
  | 'date' 
  | 'textarea'
  | 'custom';
```

**Relationships**:
- Belongs to one `FormSchema` (or one parent `FieldDefinition` if nested)
- Contains many `ValidationRule` entities
- For object types: contains many nested `FieldDefinition` entities
- For array types: contains one `FieldDefinition` for array items
- For union types: contains many `FieldDefinition` entities (one per variant)

**Constraints**:
- `name` must be unique within parent scope (form or nested object)
- `type` must be a valid FieldType
- If `type === 'array'`, `arrayItemDefinition` must be present
- If `type === 'object'`, `nestedFields` must be present and non-empty
- If `type === 'enum'`, `enumValues` must be present and non-empty
- If `type === 'union'`, `unionVariants` must be present with ≥2 variants
- If `type === 'recursive'`, `recursiveTypeRef` must be present
- If `customComponent` is present, it must accept `FieldProps` interface
- `defaultValue` type must match `type` (enforced by TypeScript)

**Lifecycle**: Created at build-time from TypeScript type + decorators → remains immutable at runtime

---

### 3. Form State

**Purpose**: Tracks the current runtime state of the form including field values, validation errors, and submission status. This is the mutable runtime state managed by FormGenerator.

**Structure**:
```typescript
interface FormState<T = Record<string, unknown>> {
  /** Current field values (strongly typed to match input type) */
  values: T;
  
  /** Validation errors keyed by field name (dot notation for nested fields) */
  errors: Record<string, string[]>;
  
  /** Fields that have been touched (blurred at least once) */
  touched: Set<string>;
  
  /** Fields currently being validated asynchronously */
  validating: Set<string>;
  
  /** Whether the form has been submitted at least once */
  submitted: boolean;
  
  /** Whether the form is currently submitting */
  submitting: boolean;
  
  /** Whether the entire form is valid (derived from errors) */
  isValid: boolean;
  
  /** Whether the form has been modified from initial values */
  isDirty: boolean;
  
  /** For array fields: expanded state (which items are showing nested fields) */
  expandedArrayItems: Record<string, Set<number>>;
  
  /** For recursive fields: expanded state (which nested levels are visible) */
  expandedRecursiveFields: Set<string>;
  
  /** For union fields: selected variant type keyed by field name */
  selectedUnionVariants: Record<string, string>;
}
```

**Relationships**:
- Belongs to one `FormSchema` (state is specific to a form instance)
- `values` structure mirrors the TypeScript type structure
- `errors` keys correspond to `FieldDefinition.name` (with dot notation for nested paths)

**Constraints**:
- `values` must be type-safe (TypeScript enforces structure matches input type `T`)
- `errors` keys must reference existing fields in the form schema
- `touched`, `validating` sets must contain valid field paths
- `isValid` is always `Object.keys(errors).length === 0`
- `isDirty` is always `values !== initialValues` (deep equality check)

**Lifecycle**: 
- Initialized when FormGenerator mounts (values from `defaultValue` or type defaults)
- Updated on every user interaction (onChange, onBlur)
- Validated after first blur per field (touched) or on submit
- Reset via form reset action

---

### 4. Validation Rule

**Purpose**: Defines a constraint on field values that must be satisfied for the form to be valid. Supports both built-in validators (required, min, max, pattern) and custom validation functions.

**Structure**:
```typescript
interface ValidationRule {
  /** Validation rule type */
  type: ValidationType;
  
  /** Error message to display when validation fails */
  message: string;
  
  /** For min/max validators: threshold value */
  value?: number;
  
  /** For pattern validator: regex pattern */
  pattern?: RegExp;
  
  /** For custom validators: validation function */
  validator?: (value: unknown, allValues: Record<string, unknown>) => boolean | Promise<boolean>;
  
  /** Whether this validator runs asynchronously */
  async?: boolean;
  
  /** Validation timing: 'change' | 'blur' | 'submit' */
  timing?: ValidationTiming;
}

type ValidationType = 
  | 'required' 
  | 'min' 
  | 'max' 
  | 'minLength' 
  | 'maxLength' 
  | 'pattern' 
  | 'email' 
  | 'url'
  | 'custom';

type ValidationTiming = 'change' | 'blur' | 'submit';
```

**Relationships**:
- Belongs to one `FieldDefinition` (field-level validators) or one `FormSchema` (global validators)
- May reference other fields in `validator` function (via `allValues` parameter)

**Constraints**:
- If `type === 'min' | 'max' | 'minLength' | 'maxLength'`, `value` must be present
- If `type === 'pattern'`, `pattern` must be present
- If `type === 'custom'`, `validator` function must be present
- `message` must not be empty
- `timing` defaults to `'blur'` (react-jsonschema-form pattern)
- `async` defaults to `false`

**Lifecycle**: 
- Created at build-time from TypeScript type constraints + decorators
- Executed at runtime during validation phase (onChange, onBlur, onSubmit)
- Immutable after creation

---

### 5. Field Override

**Purpose**: Custom configuration for specific fields specified via TypeScript decorators. This allows developers to customize labels, placeholders, validation, and UI controls without modifying the TypeScript type structure.

**Structure**:
```typescript
interface FieldOverride {
  /** Target field path (dot notation for nested fields) */
  fieldPath: string;
  
  /** Custom label */
  label?: string;
  
  /** Custom placeholder */
  placeholder?: string;
  
  /** Custom help text */
  helpText?: string;
  
  /** Additional validation rules */
  validators?: ValidationRule[];
  
  /** Custom control type */
  controlType?: ControlType;
  
  /** Custom component */
  customComponent?: React.ComponentType<FieldProps>;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
  
  /** For union fields: force specific selector control */
  unionControlType?: 'radio' | 'select';
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}
```

**Relationships**:
- Belongs to one `FormSchema` (overrides are scoped to a form)
- References one `FieldDefinition` via `fieldPath`
- May contain multiple `ValidationRule` entities

**Constraints**:
- `fieldPath` must reference an existing field in the form schema
- At least one override property (label, placeholder, etc.) must be present
- `customComponent` must accept `FieldProps` interface
- `unionControlType` only valid for union type fields

**Lifecycle**: 
- Created at build-time by DecoratorProcessor from decorator metadata
- Applied to `FieldDefinition` during schema building
- Overrides take precedence over inferred values from TypeScript types

---

## Entity Relationships Diagram

```
FormSchema
├── fields: FieldDefinition[]
│   ├── validators: ValidationRule[]
│   ├── nestedFields: FieldDefinition[] (for object types)
│   ├── arrayItemDefinition: FieldDefinition (for array types)
│   └── unionVariants: FieldDefinition[] (for union types)
├── globalValidators: ValidationRule[]
└── (runtime) FormState<T>
    ├── values: T
    ├── errors: Record<string, string[]>
    ├── touched: Set<string>
    └── expandedRecursiveFields: Set<string>

DecoratorProcessor
└── produces FieldOverride[]
    └── merged into FieldDefinition during schema build
```

## Data Flow

1. **Build-time**:
   - TypeParser analyzes TypeScript type → produces base FieldDefinition tree
   - DecoratorProcessor extracts decorator metadata → produces FieldOverride list
   - SchemaBuilder merges FieldDefinition + FieldOverride → produces FormSchema
   - FormSchema serialized/embedded for runtime use

2. **Runtime**:
   - FormGenerator receives FormSchema → initializes FormState
   - User interacts with field → FormState.values updated → validation runs
   - Validation produces errors → FormState.errors updated → UI re-renders with error messages
   - User submits → final validation → if valid, onSubmit callback with strongly-typed values

## Storage Considerations

- **Build-time**: FormSchema can be serialized to JSON and embedded in bundle (for static generation)
- **Runtime**: FormState stored in React state (useState) within FormGenerator component
- **No persistence**: Form state is ephemeral (lost on unmount) unless developer implements persistence via onSubmit or custom storage

## Type Safety

All entities are strongly typed using TypeScript interfaces. Key type safety guarantees:
- FormState.values generic parameter `T` matches the input TypeScript type
- FieldDefinition.defaultValue type checked against FieldDefinition.type
- ValidationRule.validator receives correctly typed value and allValues
- FieldOverride.fieldPath validated against FormSchema fields at build-time (via compiler plugin)
