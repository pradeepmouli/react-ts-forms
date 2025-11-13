/**
 * DateField - Date input field component (T065)
 * Renders a date input with proper ARIA semantics
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

export const DateField: React.FC<FieldProps<Date | string>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const fieldId = React.useMemo(() => generateId('date-field'), []);
	const hasErrors = touched && errors.length > 0;

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	// Convert Date to string format for input
	const dateValue = React.useMemo(() => {
		if (!value) return '';
		if (value instanceof Date) {
			return value.toISOString().split('T')[0];
		}
		if (typeof value === 'string') {
			return value.split('T')[0];
		}
		return '';
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (val) {
			onChange(new Date(val));
		} else {
			onChange(null as any);
		}
	};

	return (
		<div className={`rtsf-field rtsf-date-field ${definition.className || ''}`}>
			<label htmlFor={fieldId} className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</label>

			<input
				type="date"
				id={fieldId}
				value={dateValue}
				onChange={handleChange}
				onBlur={onBlur}
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

DateField.displayName = 'DateField';
