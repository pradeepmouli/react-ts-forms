/**
 * TextField - Text input field component (T031)
 * Renders a text input with label, error display, and ARIA attributes
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

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
				type="text"
				id={fieldId}
				value={value || ''}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={definition.placeholder}
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
