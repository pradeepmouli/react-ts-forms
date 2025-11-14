/**
 * UnionField - Union type field component (T064)
 * Type selector + conditional input rendering based on selected variant
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import type { FieldDefinition } from '../../types/FormSchema';
import { generateId, getAriaProps, getErrorId } from '../utils/accessibility';

export interface UnionFieldProps extends FieldProps<unknown> {
	onVariantChange?: (variantIndex: number) => void;
	renderVariant: (variant: FieldDefinition, value: unknown, onChange: (value: unknown) => void, onBlur: () => void) => React.ReactNode;
}

const UnionFieldComponent: React.FC<UnionFieldProps> = ({
	definition,
	value,
	onChange,
	onBlur,
	touched,
	errors,
	validating,
	onVariantChange,
	renderVariant,
}) => {
	const fieldId = React.useMemo(() => generateId('union-field'), []);
	const hasErrors = touched && errors.length > 0;

	const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);

	const ariaProps = getAriaProps({
		fieldPath: definition.name,
		describedByErrors: true,
		hasErrors,
		required: definition.required,
	});

	const handleVariantChange = (newIndex: number) => {
		setSelectedVariantIndex(newIndex);
		
		// Clear value when switching variants
		onChange(undefined);
		
		if (onVariantChange) {
			onVariantChange(newIndex);
		}
	};

	const selectedVariant = definition.unionVariants?.[selectedVariantIndex];

	return (
		<div className={`rtsf-field rtsf-union-field ${definition.className || ''}`}>
			<label className="rtsf-label">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</label>

			{definition.helpText && !hasErrors && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			{/* Type selector */}
			<div className="rtsf-union-selector">
				<label htmlFor={fieldId} className="rtsf-union-selector-label">
					Type:
				</label>

				{definition.controlType === 'radio' && definition.unionVariants && definition.unionVariants.length <= 4 ? (
					<div className="rtsf-radio-group" role="radiogroup">
						{definition.unionVariants.map((variant, idx) => (
							<div key={idx} className="rtsf-radio-option">
								<input
									type="radio"
									id={`${fieldId}-variant-${idx}`}
									name={`${definition.name}-variant`}
									checked={selectedVariantIndex === idx}
									onChange={() => handleVariantChange(idx)}
									className="rtsf-radio-input"
								/>
								<label htmlFor={`${fieldId}-variant-${idx}`} className="rtsf-radio-label">
									{variant.label || variant.name}
								</label>
							</div>
						))}
					</div>
				) : (
					<select
						id={fieldId}
						value={selectedVariantIndex}
						onChange={(e) => handleVariantChange(Number(e.target.value))}
						className="rtsf-select"
						{...ariaProps}
					>
						{definition.unionVariants?.map((variant, idx) => (
							<option key={idx} value={idx}>
								{variant.label || variant.name}
							</option>
						))}
					</select>
				)}
			</div>

			{/* Conditional input based on selected variant */}
			{selectedVariant && (
				<div className="rtsf-union-variant-input">
					{renderVariant(selectedVariant, value, onChange, onBlur)}
				</div>
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

UnionFieldComponent.displayName = 'UnionField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const UnionField = React.memo(UnionFieldComponent);
