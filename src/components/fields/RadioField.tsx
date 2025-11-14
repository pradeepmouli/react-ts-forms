/**
 * RadioField - Radio button group component (T063)
 * Renders radio button group for small enums/unions (≤4 options)
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getErrorId } from '../utils/accessibility';

const RadioFieldComponent: React.FC<FieldProps<unknown>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const groupId = React.useMemo(() => generateId('radio-group'), []);
	const hasErrors = touched && errors.length > 0;

	// Don't apply ARIA props directly to fieldset (not all are valid for fieldset)
	return (
		<fieldset
			className={`rtsf-field rtsf-radio-field ${definition.className || ''}`}
			aria-describedby={hasErrors ? getErrorId(definition.name) : undefined}
		>
			<legend className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</legend>

			{definition.helpText && !hasErrors && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			<div className="rtsf-radio-group" role="radiogroup" aria-required={definition.required}>
				{definition.enumValues?.map((option, idx) => {
					const radioId = `${groupId}-${idx}`;
					const isChecked = value === option.value;

					return (
						<div key={idx} className="rtsf-radio-option">
							<input
								type="radio"
								id={radioId}
								name={definition.name}
								value={option.value?.toString()}
								checked={isChecked}
								onChange={() => onChange(option.value)}
								onBlur={onBlur}
								disabled={definition.readonly}
								className="rtsf-radio-input"
								aria-invalid={hasErrors}
							/>
							<label htmlFor={radioId} className="rtsf-radio-label">
								{option.label}
							</label>
						</div>
					);
				})}
			</div>

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
		</fieldset>
	);
};

RadioFieldComponent.displayName = 'RadioField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const RadioField = React.memo(RadioFieldComponent);
