/**
 * CheckboxField - Checkbox field component (T033)
 * Renders a checkbox with label and checked state
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

export const CheckboxField: React.FC<FieldProps<boolean>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const fieldId = React.useMemo(() => generateId('checkbox-field'), []);
	const hasErrors = touched && errors.length > 0;

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	return (
		<div className={`rtsf-field rtsf-checkbox-field ${definition.className || ''}`}>
			<div className="rtsf-checkbox-wrapper">
				<input
					type="checkbox"
					id={fieldId}
					checked={value || false}
					onChange={(e) => onChange(e.target.checked)}
					onBlur={onBlur}
					disabled={definition.readonly}
					className="rtsf-checkbox-input"
					{...ariaProps}
				/>

				<label htmlFor={fieldId} className="rtsf-label">
					{definition.label}
					{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
				</label>
			</div>

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

CheckboxField.displayName = 'CheckboxField';
