/* Public entry point. Exports kept minimal until user stories implemented. */

// T042-T043: Phase 3 exports (User Story 1)
// Type exports
export * from './decorators/formConfig';
export * from './types/FieldProps';
export * from './types/FormSchema';
export * from './types/FormState';
export * from './types/ValidationRule';

// Generator exports (build-time)
export { TypeParser } from './generator/TypeParser';
export type { TypeInfo } from './generator/TypeParser';
export { SchemaBuilder } from './generator/SchemaBuilder';
export { DecoratorProcessor } from './generator/DecoratorProcessor';

// Component exports (runtime)
export { FormGenerator } from './components/FormGenerator';
export type { FormGeneratorProps } from './components/FormGenerator';

// T042: Phase 3 field components
export { TextField } from './components/fields/TextField';
export { NumberField } from './components/fields/NumberField';
export { CheckboxField } from './components/fields/CheckboxField';
export { ObjectField } from './components/fields/ObjectField';

// T073: Phase 4 field components (User Story 2)
export { DateField } from './components/fields/DateField';
export { SelectField } from './components/fields/SelectField';
export { RadioField } from './components/fields/RadioField';
export { ArrayField } from './components/fields/ArrayField';
export type { ArrayFieldProps } from './components/fields/ArrayField';
export { UnionField } from './components/fields/UnionField';
export type { UnionFieldProps } from './components/fields/UnionField';
export { TextAreaField } from './components/fields/TextAreaField';

// T102: Phase 5 decorators (User Story 3)
export { Label } from './decorators/Label';
export { Placeholder } from './decorators/Placeholder';
export { HelpText } from './decorators/HelpText';
export { Validate } from './decorators/Validate';
export { CustomControl } from './decorators/CustomControl';
export { ControlType } from './decorators/ControlType';
export { UnionControl } from './decorators/UnionControl';

// Registry exports (for advanced use cases)
export { registerDecoratorOverrides, getDecoratorOverrides } from './decorators/registry';

// Utility exports
export { validateField, validateForm, runAsyncValidators } from './components/utils/validation';
export { generateId, getAriaProps, getErrorId } from './components/utils/accessibility';
