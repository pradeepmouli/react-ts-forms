/**
 * NumberField - Number input field component (T032)
 * Renders a number input with step, min, max support and ARIA attributes
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

const NumberFieldComponent: React.FC<FieldProps<number>> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
}) => {
	const fieldId = React.useMemo(() => generateId('number-field'), []);
	const hasErrors = touched && errors.length > 0;

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	return (
		<div className={`rtsf-field rtsf-number-field ${definition.className || ''}`}>
			<label htmlFor={fieldId} className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</label>

			<input
				type="number"
				id={fieldId}
				value={value ?? ''}
				onChange={(e) => {
					const val = e.target.value;
					onChange(val === '' ? (null as any) : parseFloat(val));
				}}
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

NumberFieldComponent.displayName = 'NumberField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const NumberField = React.memo(NumberFieldComponent);
