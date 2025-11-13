/**
 * ObjectField - Fieldset wrapper for nested object fields (T034)
 * Groups nested fields with semantic fieldset/legend elements
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';

export interface ObjectFieldProps extends FieldProps<Record<string, unknown>> {
	children?: React.ReactNode;
}

export const ObjectField: React.FC<ObjectFieldProps> = ({
	definition,
	children,
}) => {
	return (
		<fieldset className={`rtsf-field rtsf-object-field ${definition.className || ''}`}>
			<legend className="rtsf-legend">
				{definition.label}
				{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
			</legend>

			{definition.helpText && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			<div className="rtsf-object-fields">
				{children}
			</div>
		</fieldset>
	);
};

ObjectField.displayName = 'ObjectField';
