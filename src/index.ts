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
export { SchemaBuilder } from './generator/SchemaBuilder';

// Component exports (runtime)
export { FormGenerator } from './components/FormGenerator';
export { TextField } from './components/fields/TextField';
export { NumberField } from './components/fields/NumberField';
export { CheckboxField } from './components/fields/CheckboxField';
export { ObjectField } from './components/fields/ObjectField';

// Utility exports
export { validateField, validateForm } from './components/utils/validation';
export { generateId, getAriaProps, getErrorId } from './components/utils/accessibility';
