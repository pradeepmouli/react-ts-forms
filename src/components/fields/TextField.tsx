/**
 * TextField - Text input field component (T031)
 * Phase 6: Enhanced with field mask support for template literal types
 * Renders a text input with label, error display, and ARIA attributes
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';
import { generateFieldMask, type FieldMask } from '../utils/fieldMask';

export const TextField: React.FC<FieldProps<string>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const fieldId = React.useMemo(() => generateId('text-field'), []);
	const hasErrors = touched && errors.length > 0;
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Phase 6: Generate field mask from template pattern metadata
	const fieldMask = React.useMemo<FieldMask | null>(() => {
		const templatePattern = definition.metadata?.templatePattern as string | undefined;
		if (templatePattern) {
			return generateFieldMask(templatePattern);
		}
		return null;
	}, [definition.metadata?.templatePattern]);

	// Apply auto-generated placeholder from mask if not already set
	const placeholder = definition.placeholder || fieldMask?.placeholder;

	// Phase 6: Apply field mask formatting on input
	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		
		if (fieldMask) {
			// Parse formatted value to get raw value
			const rawValue = fieldMask.parse(inputValue);
			onChange(rawValue);
			
			// Format and update display value
			const formattedValue = fieldMask.format(rawValue);
			if (inputRef.current && inputRef.current.value !== formattedValue) {
				const cursorPosition = e.target.selectionStart || 0;
				inputRef.current.value = formattedValue;
				
				// Maintain cursor position (simplified approach)
				const newPosition = Math.min(cursorPosition, formattedValue.length);
				inputRef.current.setSelectionRange(newPosition, newPosition);
			}
		} else {
			onChange(inputValue);
		}
	}, [fieldMask, onChange]);

	// Format value for display if mask is present
	const displayValue = React.useMemo(() => {
		if (fieldMask && value) {
			return fieldMask.format(value);
		}
		return value || '';
	}, [fieldMask, value]);

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	return (
		<div className={`rtsf-field rtsf-text-field ${definition.className || ''}`}>
			<label htmlFor={fieldId} className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</label>

			<input
				ref={inputRef}
				type="text"
				id={fieldId}
				value={displayValue}
				onChange={handleChange}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={definition.readonly}
				className="rtsf-input"
				{...ariaProps}
			/>

			{definition.helpText && !hasErrors && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			{hasErrors && (
				<div id={getErrorId(definition.name)} className="rtsf-error" role="alert">
					{errors.map((error, idx) => (
						<div key={idx}>{error}</div>
					))}
				</div>
			)}

			{validating && (
				<div className="rtsf-validating" aria-live="polite">
					Validating...
				</div>
			)}
		</div>
	);
};

TextField.displayName = 'TextField';
