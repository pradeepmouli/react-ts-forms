/**
 * SelectField - Dropdown select field component (T062)
 * Renders a select dropdown for enums with option elements
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

const SelectFieldComponent: React.FC<FieldProps<unknown>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const fieldId = React.useMemo(() => generateId('select-field'), []);
	const hasErrors = touched && errors.length > 0;

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const val = e.target.value;
		
		// Try to parse the value if it's a number
		if (!isNaN(Number(val)) && val !== '') {
			onChange(Number(val));
		} else if (val === 'true' || val === 'false') {
			onChange(val === 'true');
		} else {
			onChange(val);
		}
	};

	return (
		<div className={`rtsf-field rtsf-select-field ${definition.className || ''}`}>
			<label htmlFor={fieldId} className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</label>

			<select
				id={fieldId}
				value={value?.toString() || ''}
				onChange={handleChange}
				onBlur={onBlur}
				disabled={definition.readonly}
				className="rtsf-select"
				{...ariaProps}
			>
				{!definition.required && <option value="">-- Select --</option>}
				{definition.enumValues?.map((option, idx) => (
					<option key={idx} value={option.value?.toString()}>
						{option.label}
					</option>
				))}
			</select>

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

SelectFieldComponent.displayName = 'SelectField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const SelectField = React.memo(SelectFieldComponent);
