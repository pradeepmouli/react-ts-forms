/**
 * Validation utilities (T040-T041)
 * Basic field and form validation engine
 */

import type { FieldDefinition } from '../../types/FormSchema';
import type { ValidationRule } from '../../types/ValidationRule';

/**
 * T040: Validate a single field value against its validators
 * Returns array of error messages (empty if valid)
 */
export function validateField(
	value: unknown,
	definition: FieldDefinition,
	allValues: Record<string, unknown>
): string[] {
	const errors: string[] = [];

	// Check required fields
	if (definition.required && isEmpty(value)) {
		errors.push(`${definition.label} is required`);
		return errors; // Don't run other validators if required check fails
	}

	// Run field-specific validators
	if (definition.validators) {
		for (const rule of definition.validators) {
			const error = validateRule(value, rule, allValues);
			if (error) {
				errors.push(error);
			}
		}
	}

	return errors;
}

/**
 * T041: Validate entire form
 * Returns a map of field paths to error arrays
 */
export function validateForm(
	values: Record<string, unknown>,
	fields: FieldDefinition[]
): Record<string, string[]> {
	const errors: Record<string, string[]> = {};

	function validateFields(fieldDefs: FieldDefinition[], parentPath: string = '') {
		for (const field of fieldDefs) {
			const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
			const fieldValue = getValueByPath(values, fieldPath);

			const fieldErrors = validateField(fieldValue, field, values);
			if (fieldErrors.length > 0) {
				errors[fieldPath] = fieldErrors;
			}

			// Recursively validate nested fields
			if (field.nestedFields) {
				validateFields(field.nestedFields, fieldPath);
			}
		}
	}

	validateFields(fields);
	return errors;
}

/**
 * Validate a single validation rule
 */
function validateRule(
	value: unknown,
	rule: ValidationRule,
	allValues: Record<string, unknown>
): string | null {
	// Skip validation if value is empty and not required
	if (isEmpty(value) && rule.type !== 'required') {
		return null;
	}

	switch (rule.type) {
		case 'required':
			return isEmpty(value) ? rule.message : null;

		case 'min':
			if (typeof value === 'number' && rule.value !== undefined) {
				return value < rule.value ? rule.message : null;
			}
			return null;

		case 'max':
			if (typeof value === 'number' && rule.value !== undefined) {
				return value > rule.value ? rule.message : null;
			}
			return null;

		case 'minLength':
			if (typeof value === 'string' && rule.value !== undefined) {
				return value.length < rule.value ? rule.message : null;
			}
			return null;

		case 'maxLength':
			if (typeof value === 'string' && rule.value !== undefined) {
				return value.length > rule.value ? rule.message : null;
			}
			return null;

		case 'pattern':
			if (typeof value === 'string' && rule.pattern) {
				return !rule.pattern.test(value) ? rule.message : null;
			}
			return null;

		case 'email':
			if (typeof value === 'string') {
				// More robust email pattern that avoids catastrophic backtracking
				// Simplified pattern for basic email validation
				const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
				return !emailPattern.test(value) ? rule.message : null;
			}
			return null;

		case 'url':
			if (typeof value === 'string') {
				try {
					new URL(value);
					return null;
				} catch {
					return rule.message;
				}
			}
			return null;

		case 'custom':
			if (rule.validator) {
				const result = rule.validator(value, allValues);
				// Handle async validators (simplified - would need Promise handling)
				if (typeof result === 'boolean') {
					return result ? null : rule.message;
				}
			}
			return null;

		default:
			return null;
	}
}

/**
 * Check if a value is empty
 */
function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value.trim() === '';
	if (typeof value === 'number') return false; // 0 is not empty for numbers
	if (typeof value === 'boolean') return false; // false is not empty for booleans
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'object') return Object.keys(value).length === 0;
	return false;
}

/**
 * Get a nested value by dot-notation path
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
	const parts = path.split('.');
	let current: any = obj;

	for (const part of parts) {
		if (current === null || current === undefined) {
			return undefined;
		}
		current = current[part];
	}

	return current;
}
