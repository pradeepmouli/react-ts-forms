/**
 * FormGenerator - Main form component (T035-T039)
 * Orchestrates form rendering, state management, and validation
 */

import * as React from 'react';
import type { FormSchema, FieldDefinition } from '../types/FormSchema';
import type { FormState } from '../types/FormState';
import { validateForm, validateField } from './utils/validation';
import { TextField } from './fields/TextField';
import { NumberField } from './fields/NumberField';
import { CheckboxField } from './fields/CheckboxField';
import { ObjectField } from './fields/ObjectField';
import { DateField } from './fields/DateField';
import { SelectField } from './fields/SelectField';
import { RadioField } from './fields/RadioField';
import { ArrayField } from './fields/ArrayField';
import { UnionField } from './fields/UnionField';

export interface FormGeneratorProps<T = Record<string, unknown>> {
	schema: FormSchema;
	initialValues?: Partial<T>;
	onSubmit: (values: T) => void | Promise<void>;
	onChange?: (values: T, isValid: boolean) => void;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * T036: Form state management hook
 * Manages values, errors, touched, submitted state
 */
function useFormState<T = Record<string, unknown>>(
	schema: FormSchema,
	initialValues?: Partial<T>
): {
	state: FormState<T>;
	updateField: (path: string, value: unknown) => void;
	markTouched: (path: string) => void;
	validateAll: () => boolean;
	resetForm: () => void;
} {
	const [state, setState] = React.useState<FormState<T>>(() => ({
		values: (initialValues || {}) as T,
		errors: {},
		touched: new Set(),
		validating: new Set(),
		submitted: false,
		submitting: false,
		isValid: true,
		isDirty: false,
		expandedArrayItems: {},
		expandedRecursiveFields: new Set(),
		selectedUnionVariants: {},
	}));

	// T037: Update field value
	const updateField = React.useCallback((path: string, value: unknown) => {
		setState(prev => {
			const newValues = { ...prev.values } as any;
			setValueByPath(newValues, path, value);

			// Validate field if touched
			const fieldErrors = prev.touched.has(path)
				? validateFieldByPath(schema.fields, path, value, newValues)
				: [];

			const newErrors = { ...prev.errors };
			if (fieldErrors.length > 0) {
				newErrors[path] = fieldErrors;
			} else {
				delete newErrors[path];
			}

			return {
				...prev,
				values: newValues,
				errors: newErrors,
				isDirty: true,
				isValid: Object.keys(newErrors).length === 0,
			};
		});
	}, [schema]);

	// T038: Mark field as touched
	const markTouched = React.useCallback((path: string) => {
		setState(prev => {
			const newTouched = new Set(prev.touched);
			newTouched.add(path);

			// Validate on blur
			const value = getValueByPath(prev.values as Record<string, unknown>, path);
			const fieldErrors = validateFieldByPath(schema.fields, path, value, prev.values as Record<string, unknown>);

			const newErrors = { ...prev.errors };
			if (fieldErrors.length > 0) {
				newErrors[path] = fieldErrors;
			} else {
				delete newErrors[path];
			}

			return {
				...prev,
				touched: newTouched,
				errors: newErrors,
				isValid: Object.keys(newErrors).length === 0,
			};
		});
	}, [schema]);

	// T039: Validate all fields
	const validateAll = React.useCallback((): boolean => {
		const allErrors = validateForm(state.values as Record<string, unknown>, schema.fields);
		
		setState(prev => ({
			...prev,
			errors: allErrors,
			isValid: Object.keys(allErrors).length === 0,
		}));

		return Object.keys(allErrors).length === 0;
	}, [state.values, schema.fields]);

	const resetForm = React.useCallback(() => {
		setState({
			values: (initialValues || {}) as T,
			errors: {},
			touched: new Set(),
			validating: new Set(),
			submitted: false,
			submitting: false,
			isValid: true,
			isDirty: false,
			expandedArrayItems: {},
			expandedRecursiveFields: new Set(),
			selectedUnionVariants: {},
		});
	}, [initialValues]);

	return { state, updateField, markTouched, validateAll, resetForm };
}

/**
 * T035: FormGenerator component
 * Main form orchestration component
 */
export function FormGenerator<T = Record<string, unknown>>({
	schema,
	initialValues,
	onSubmit,
	onChange,
	className,
	style,
}: FormGeneratorProps<T>) {
	const { state, updateField, markTouched, validateAll } = useFormState<T>(schema, initialValues);

	// Notify parent of changes
	React.useEffect(() => {
		if (onChange) {
			onChange(state.values, state.isValid);
		}
	}, [state.values, state.isValid, onChange]);

	// T039: Handle form submission
	const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
		e.preventDefault();

		const isValid = validateAll();

		if (!isValid) {
			// Focus first error field
			const firstErrorPath = Object.keys(state.errors)[0];
			if (firstErrorPath) {
				const element = document.querySelector(`[name="${firstErrorPath}"]`) as HTMLElement;
				element?.focus();
			}
			return;
		}

		await onSubmit(state.values);
	}, [validateAll, state.errors, state.values, onSubmit]);

	return (
		<form
			onSubmit={handleSubmit}
			className={`rtsf-form ${className || ''}`}
			style={style}
			noValidate
		>
			{schema.description && (
				<div className="rtsf-form-description">{schema.description}</div>
			)}

			{schema.fields.map(field => (
				<FieldRenderer
					key={field.name}
					definition={field}
					value={getValueByPath(state.values as Record<string, unknown>, field.name)}
					formState={state}
					onFieldChange={updateField}
					onFieldBlur={markTouched}
					parentPath=""
				/>
			))}

			<button type="submit" className="rtsf-submit-button">
				Submit
			</button>
		</form>
	);
}

/**
 * T035: Field renderer - maps FieldDefinition to appropriate component
 */
interface FieldRendererProps<T = Record<string, unknown>> {
	definition: FieldDefinition;
	value: unknown;
	formState: FormState<T>;
	onFieldChange: (path: string, value: unknown) => void;
	onFieldBlur: (path: string) => void;
	parentPath: string;
}

function FieldRenderer<T = Record<string, unknown>>({
	definition,
	value,
	formState,
	onFieldChange,
	onFieldBlur,
	parentPath,
}: FieldRendererProps<T>) {
	const fieldPath = parentPath ? `${parentPath}.${definition.name}` : definition.name;
	const touched = formState.touched.has(fieldPath);
	const errors = formState.errors[fieldPath] || [];
	const validating = formState.validating.has(fieldPath);

	const commonProps = {
		definition,
		value,
		onChange: (newValue: unknown) => onFieldChange(fieldPath, newValue),
		onBlur: () => onFieldBlur(fieldPath),
		touched,
		errors,
		validating,
		formState: formState as FormState,
	};

	// Use custom component if provided
	if (definition.customComponent) {
		const CustomComponent = definition.customComponent;
		return <CustomComponent {...commonProps} />;
	}

	// Map to built-in field components based on type
	switch (definition.type) {
		case 'string':
			return <TextField {...commonProps} value={value as string} />;

		case 'number':
			return <NumberField {...commonProps} value={value as number} />;

		case 'boolean':
			return <CheckboxField {...commonProps} value={value as boolean} />;

		case 'date':
			return <DateField {...commonProps} value={value as Date | string} />;

		case 'enum':
			// Use radio for small enums (≤4 options), select for larger
			if (definition.enumValues && definition.enumValues.length <= 4) {
				return <RadioField {...commonProps} />;
			}
			return <SelectField {...commonProps} />;

		case 'array':
			return (
				<ArrayField
					{...commonProps}
					value={value as unknown[] || []}
					renderItem={(item, index, onItemChange, onItemBlur) => {
						if (!definition.arrayItemDefinition) return null;

						return (
							<FieldRenderer
								definition={{
									...definition.arrayItemDefinition,
									name: `${index}`,
								}}
								value={item}
								formState={formState}
								onFieldChange={(path, val) => {
									// Update array item at index
									const newArray = [...(value as unknown[] || [])];
									newArray[index] = val;
									onFieldChange(fieldPath, newArray);
								}}
								onFieldBlur={onFieldBlur}
								parentPath={`${fieldPath}[${index}]`}
							/>
						);
					}}
				/>
			);

		case 'union':
			return (
				<UnionField
					{...commonProps}
					renderVariant={(variant, variantValue, variantOnChange, variantOnBlur) => (
						<FieldRenderer
							definition={variant}
							value={variantValue}
							formState={formState}
							onFieldChange={(path, val) => variantOnChange(val)}
							onFieldBlur={onFieldBlur}
							parentPath={fieldPath}
						/>
					)}
				/>
			);

		case 'object':
			return (
				<ObjectField {...commonProps} value={value as Record<string, unknown>}>
					{definition.nestedFields?.map(nested => (
						<FieldRenderer
							key={nested.name}
							definition={nested}
							value={getValueByPath(value as Record<string, unknown> || {}, nested.name)}
							formState={formState}
							onFieldChange={onFieldChange}
							onFieldBlur={onFieldBlur}
							parentPath={fieldPath}
						/>
					))}
				</ObjectField>
			);

		default:
			return <div>Unsupported field type: {definition.type}</div>;
	}
}

// Helper functions

function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
	const parts = path.split('.');
	let current: any = obj;
	for (const part of parts) {
		if (current === null || current === undefined) return undefined;
		current = current[part];
	}
	return current;
}

function setValueByPath(obj: any, path: string, value: unknown): void {
	const parts = path.split('.');
	let current = obj;
	for (let i = 0; i < parts.length - 1; i++) {
		const part = parts[i];
		// Guard against prototype pollution
		if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
			throw new Error('Invalid property name');
		}
		if (!(part in current)) {
			current[part] = {};
		}
		current = current[part];
	}
	const finalPart = parts[parts.length - 1];
	// Guard against prototype pollution
	if (finalPart === '__proto__' || finalPart === 'constructor' || finalPart === 'prototype') {
		throw new Error('Invalid property name');
	}
	current[finalPart] = value;
}

function validateFieldByPath(
	fields: FieldDefinition[],
	path: string,
	value: unknown,
	allValues: Record<string, unknown>
): string[] {
	const parts = path.split('.');
	let currentFields = fields;
	let fieldDef: FieldDefinition | undefined;

	for (let i = 0; i < parts.length; i++) {
		fieldDef = currentFields.find(f => f.name === parts[i]);
		if (!fieldDef) return [];

		if (i < parts.length - 1 && fieldDef.nestedFields) {
			currentFields = fieldDef.nestedFields;
		}
	}

	return fieldDef ? validateField(value, fieldDef, allValues) : [];
}
