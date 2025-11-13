# API Contracts - Type-Driven Form Generator

**Branch**: `001-type-driven-form` | **Date**: 2025-11-12

## Overview

This document defines the public API contracts for the Type-Driven Form Generator component library. These contracts represent stable interfaces that consumers depend on and must follow semantic versioning rules.

---

## 1. FormGenerator Component Props

**Contract Type**: React Component Public API  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

```typescript
interface FormGeneratorProps<T extends Record<string, unknown>> {
  /**
   * TypeScript type or interface definition to generate form from.
   * Type must be serializable to FormSchema at build-time.
   */
  schema: FormSchema;
  
  /**
   * Initial values for form fields.
   * Structure must match the input type T.
   */
  initialValues?: Partial<T>;
  
  /**
   * Callback invoked when any field value changes.
   * Receives the complete form values object (strongly typed to T).
   */
  onChange?: (values: T, changedField: string) => void;
  
  /**
   * Callback invoked when form is submitted and passes validation.
   * Receives the complete form values object (strongly typed to T).
   */
  onSubmit: (values: T) => void | Promise<void>;
  
  /**
   * Callback invoked when validation fails.
   * Receives map of field paths to error messages.
   */
  onError?: (errors: Record<string, string[]>) => void;
  
  /**
   * Whether to validate fields live (after first blur) or only on submit.
   * Default: 'blur' (react-jsonschema-form pattern)
   */
  validationMode?: 'blur' | 'change' | 'submit';
  
  /**
   * Custom CSS classes to apply to form container.
   */
  className?: string;
  
  /**
   * Custom inline styles for form container.
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to show submit button.
   * Default: true
   */
  showSubmitButton?: boolean;
  
  /**
   * Custom text for submit button.
   * Default: "Submit"
   */
  submitButtonText?: string;
  
  /**
   * Whether form is disabled (all fields readonly).
   * Default: false
   */
  disabled?: boolean;
  
  /**
   * ARIA label for the form element.
   */
  ariaLabel?: string;
}
```

**Breaking Changes**:
- Removing or renaming any prop → MAJOR
- Changing prop type in incompatible way → MAJOR
- Adding required prop → MAJOR
- Adding optional prop → MINOR

---

## 2. Decorator API

**Contract Type**: TypeScript Decorators  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

### @Label

```typescript
/**
 * Customizes the display label for a field.
 * 
 * @param label - Custom label text
 * 
 * @example
 * class UserProfile {
 *   @Label('Email Address')
 *   email: string;
 * }
 */
function Label(label: string): PropertyDecorator;
```

### @Placeholder

```typescript
/**
 * Sets placeholder text for input controls.
 * 
 * @param placeholder - Placeholder text
 * 
 * @example
 * class UserProfile {
 *   @Placeholder('Enter your email')
 *   email: string;
 * }
 */
function Placeholder(placeholder: string): PropertyDecorator;
```

### @HelpText

```typescript
/**
 * Adds help text displayed below the field.
 * 
 * @param helpText - Help text content
 * 
 * @example
 * class UserProfile {
 *   @HelpText('We will never share your email')
 *   email: string;
 * }
 */
function HelpText(helpText: string): PropertyDecorator;
```

### @Validate

```typescript
/**
 * Adds custom validation rule to a field.
 * 
 * @param validator - Validation function or built-in validator config
 * @param message - Error message when validation fails
 * 
 * @example
 * class UserProfile {
 *   @Validate((value) => value.includes('@'), 'Must be a valid email')
 *   email: string;
 *   
 *   @Validate({ min: 18 }, 'Must be at least 18')
 *   age: number;
 * }
 */
function Validate(
  validator: ValidatorFn | ValidatorConfig,
  message: string
): PropertyDecorator;

type ValidatorFn = (value: unknown, allValues: Record<string, unknown>) => boolean | Promise<boolean>;

type ValidatorConfig = 
  | { min: number }
  | { max: number }
  | { minLength: number }
  | { maxLength: number }
  | { pattern: RegExp }
  | { email: true }
  | { url: true };
```

### @CustomControl

```typescript
/**
 * Replaces default input control with custom component.
 * 
 * @param component - React component that accepts FieldProps
 * 
 * @example
 * class UserProfile {
 *   @CustomControl(RichTextEditor)
 *   bio: string;
 * }
 */
function CustomControl(component: React.ComponentType<FieldProps>): PropertyDecorator;

interface FieldProps {
  /** Field name */
  name: string;
  
  /** Current field value */
  value: unknown;
  
  /** Change handler */
  onChange: (value: unknown) => void;
  
  /** Blur handler */
  onBlur: () => void;
  
  /** Field definition from schema */
  field: FieldDefinition;
  
  /** Validation errors for this field */
  errors?: string[];
  
  /** Whether field has been touched */
  touched: boolean;
  
  /** Whether field is disabled */
  disabled: boolean;
}
```

### @ControlType

```typescript
/**
 * Specifies which UI control to use for a field.
 * 
 * @param controlType - Control type name
 * 
 * @example
 * class UserProfile {
 *   @ControlType('textarea')
 *   bio: string;
 * }
 */
function ControlType(controlType: ControlTypeName): PropertyDecorator;

type ControlTypeName = 'text' | 'number' | 'checkbox' | 'select' | 'radio' | 'date' | 'textarea';
```

### @UnionControl

```typescript
/**
 * Specifies control type for union type selector.
 * Only applicable to union type fields.
 * 
 * @param controlType - 'radio' or 'select'
 * 
 * @example
 * class UserProfile {
 *   @UnionControl('radio')
 *   contactPreference: 'email' | 'phone' | 'sms';
 * }
 */
function UnionControl(controlType: 'radio' | 'select'): PropertyDecorator;
```

**Breaking Changes**:
- Removing or renaming any decorator → MAJOR
- Changing decorator parameter signature → MAJOR
- Changing decorator behavior in incompatible way → MAJOR
- Adding new decorator → MINOR

---

## 3. Vite Plugin API

**Contract Type**: Bundler Plugin Public API  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

```typescript
/**
 * Vite plugin for type-driven form generation.
 * Analyzes TypeScript types at build-time and generates FormSchema.
 * 
 * @param options - Plugin configuration
 * 
 * @example
 * // vite.config.ts
 * import { typeFormPlugin } from 'react-ts-forms/vite';
 * 
 * export default {
 *   plugins: [
 *     typeFormPlugin({
 *       include: ['src/** /*.tsx'],
 *       exclude: ['** /*.test.tsx']
 *     })
 *   ]
 * };
 */
function typeFormPlugin(options?: TypeFormPluginOptions): Plugin;

interface TypeFormPluginOptions {
  /**
   * Glob patterns for files to process.
   * Default: ['** /*.ts', '** /*.tsx']
   */
  include?: string[];
  
  /**
   * Glob patterns for files to exclude.
   * Default: ['** /*.test.ts', '** /*.test.tsx', 'node_modules/** /*']
   */
  exclude?: string[];
  
  /**
   * Whether to emit build-time performance metrics.
   * Default: false
   */
  debug?: boolean;
  
  /**
   * Path to tsconfig.json.
   * Default: 'tsconfig.json'
   */
  tsConfigPath?: string;
}
```

**Breaking Changes**:
- Removing or renaming options → MAJOR
- Changing option behavior incompatibly → MAJOR
- Adding required option → MAJOR
- Adding optional option → MINOR

---

## 4. FormSchema Type Definition

**Contract Type**: Data Structure Public API  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

```typescript
/**
 * Complete form structure generated at build-time from TypeScript type.
 * This is the primary data structure passed to FormGenerator.
 */
interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FieldDefinition[];
  globalValidators?: ValidationRule[];
  metadata?: Record<string, unknown>;
}

interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  readonly: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  helpText?: string;
  validators?: ValidationRule[];
  controlType?: ControlType;
  customComponent?: React.ComponentType<FieldProps>;
  nestedFields?: FieldDefinition[];
  arrayItemDefinition?: FieldDefinition;
  enumValues?: Array<{ value: unknown; label: string }>;
  unionVariants?: FieldDefinition[];
  recursiveTypeRef?: string;
  className?: string;
  style?: React.CSSProperties;
  metadata?: Record<string, unknown>;
}

type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'object' | 'union' | 'recursive';
type ControlType = 'text' | 'number' | 'checkbox' | 'select' | 'radio' | 'date' | 'textarea' | 'custom';

interface ValidationRule {
  type: ValidationType;
  message: string;
  value?: number;
  pattern?: RegExp;
  validator?: (value: unknown, allValues: Record<string, unknown>) => boolean | Promise<boolean>;
  async?: boolean;
  timing?: 'change' | 'blur' | 'submit';
}

type ValidationType = 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
```

**Breaking Changes**:
- Removing or renaming any property → MAJOR
- Changing property type incompatibly → MAJOR
- Adding required property → MAJOR
- Adding optional property → MINOR
- Removing enum value from FieldType or ControlType → MAJOR
- Adding enum value → MINOR

---

## 5. CSS Custom Properties (Design Tokens)

**Contract Type**: Styling Public API  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

```css
/**
 * Form container
 */
--rtsf-form-padding: 1rem;
--rtsf-form-background: transparent;
--rtsf-form-border: none;

/**
 * Field spacing
 */
--rtsf-field-margin-bottom: 1rem;
--rtsf-field-gap: 0.5rem;

/**
 * Labels
 */
--rtsf-label-font-size: 0.875rem;
--rtsf-label-font-weight: 500;
--rtsf-label-color: inherit;
--rtsf-label-required-color: #dc2626;

/**
 * Input controls
 */
--rtsf-input-padding: 0.5rem 0.75rem;
--rtsf-input-font-size: 1rem;
--rtsf-input-border: 1px solid #d1d5db;
--rtsf-input-border-radius: 0.375rem;
--rtsf-input-background: #ffffff;
--rtsf-input-color: inherit;

/**
 * Focus state
 */
--rtsf-input-focus-border: 2px solid #3b82f6;
--rtsf-input-focus-outline: 2px solid #3b82f680;
--rtsf-input-focus-outline-offset: 2px;

/**
 * Error state
 */
--rtsf-input-error-border: 1px solid #dc2626;
--rtsf-error-text-color: #dc2626;
--rtsf-error-text-size: 0.875rem;

/**
 * Disabled state
 */
--rtsf-input-disabled-background: #f3f4f6;
--rtsf-input-disabled-color: #9ca3af;
--rtsf-input-disabled-cursor: not-allowed;

/**
 * Buttons
 */
--rtsf-button-padding: 0.5rem 1rem;
--rtsf-button-font-size: 1rem;
--rtsf-button-border-radius: 0.375rem;
--rtsf-button-background: #3b82f6;
--rtsf-button-color: #ffffff;
--rtsf-button-hover-background: #2563eb;
```

**Breaking Changes**:
- Removing or renaming CSS variable → MAJOR
- Changing default value significantly → MAJOR (subjective, use judgment)
- Adding CSS variable → MINOR

---

## 6. Peer Dependencies

**Contract Type**: Dependency Requirements  
**Stability**: MAJOR version changes only  
**Introduced**: v1.0.0

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.6.0"
  }
}
```

**Breaking Changes**:
- Bumping minimum peer dependency version → MAJOR
- Adding new peer dependency → MAJOR
- Removing peer dependency → MAJOR

---

## Migration Policy

When breaking changes are necessary:

1. **Deprecation Notice**: In MINOR release preceding MAJOR change:
   - Add console.warn() for deprecated usage
   - Document deprecation in changelog and JSDoc
   - Provide migration path in documentation

2. **Migration Guide**: In MAJOR release:
   - Publish migration guide with before/after examples
   - Provide codemod script if feasible
   - Include breaking changes summary in changelog

3. **Support Timeline**:
   - Previous MAJOR version receives critical bug fixes for 6 months after new MAJOR release
   - No new features backported to previous MAJOR
