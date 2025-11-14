/**
 * ArrayField - Array field component (T061)
 * Renders array items with add/remove/reorder buttons and ARIA labels
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';
import type { FieldDefinition } from '../../types/FormSchema';
import { getErrorId } from '../utils/accessibility';

export interface ArrayFieldProps extends FieldProps<unknown[]> {
	renderItem: (item: unknown, index: number, onItemChange: (value: unknown) => void, onItemBlur: () => void) => React.ReactNode;
}

const ArrayFieldComponent: React.FC<ArrayFieldProps> = ({
	definition,
	value = [],
	onChange,
	onBlur,
	touched,
	errors,
	validating,
	renderItem,
}) => {
	const hasErrors = touched && errors.length > 0;

	// T068: Add new item to array
	const handleAdd = () => {
		const newItem = getDefaultValue(definition.arrayItemDefinition);
		onChange([...value, newItem]);
	};

	// T069: Remove item at index
	const handleRemove = (index: number) => {
		const newArray = [...value];
		newArray.splice(index, 1);
		onChange(newArray);
	};

	// T070: Reorder items (move up/down)
	const handleMoveUp = (index: number) => {
		if (index === 0) return;
		const newArray = [...value];
		[newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
		onChange(newArray);
	};

	const handleMoveDown = (index: number) => {
		if (index === value.length - 1) return;
		const newArray = [...value];
		[newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
		onChange(newArray);
	};

	const handleItemChange = (index: number, newValue: unknown) => {
		const newArray = [...value];
		newArray[index] = newValue;
		onChange(newArray);
	};

	return (
		<div className={`rtsf-field rtsf-array-field ${definition.className || ''}`}>
			<div className="rtsf-array-header">
				<label className="rtsf-label">
					{definition.label}
					{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
				</label>

				<button
					type="button"
					onClick={handleAdd}
					className="rtsf-array-add-button"
					aria-label={`Add ${definition.label} item`}
				>
					+ Add
				</button>
			</div>

			{definition.helpText && !hasErrors && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			<div className="rtsf-array-items">
				{value.length === 0 && (
					<div className="rtsf-array-empty">No items yet</div>
				)}

				{value.map((item, index) => (
					<div key={index} className="rtsf-array-item">
						<div className="rtsf-array-item-content">
							{renderItem(
								item,
								index,
								(newValue) => handleItemChange(index, newValue),
								onBlur
							)}
						</div>

						<div className="rtsf-array-item-controls">
							<button
								type="button"
								onClick={() => handleMoveUp(index)}
								disabled={index === 0}
								className="rtsf-array-move-button"
								aria-label={`Move ${definition.label} item ${index + 1} up`}
							>
								↑
							</button>

							<button
								type="button"
								onClick={() => handleMoveDown(index)}
								disabled={index === value.length - 1}
								className="rtsf-array-move-button"
								aria-label={`Move ${definition.label} item ${index + 1} down`}
							>
								↓
							</button>

							<button
								type="button"
								onClick={() => handleRemove(index)}
								className="rtsf-array-remove-button"
								aria-label={`Remove ${definition.label} item ${index + 1}`}
							>
								✕
							</button>
						</div>
					</div>
				))}
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
		</div>
	);
};

ArrayFieldComponent.displayName = 'ArrayField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const ArrayField = React.memo(ArrayFieldComponent);

/**
 * Get default value for an array item based on its type
 */
function getDefaultValue(itemDefinition?: FieldDefinition): unknown {
	if (!itemDefinition) return null;

	switch (itemDefinition.type) {
		case 'string':
			return '';
		case 'number':
			return 0;
		case 'boolean':
			return false;
		case 'date':
			return new Date();
		case 'array':
			return [];
		case 'object':
			return {};
		default:
			return null;
	}
}
