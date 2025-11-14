/**
 * RecursiveField - Expandable field for recursive types (T115)
 * Renders a button to expand/collapse recursive type instances
 * Prevents infinite recursion with lazy expansion
 */

import * as React from 'react';
import type { FieldProps } from '../../types/FieldProps';

export interface RecursiveFieldProps extends FieldProps<Record<string, unknown>> {
	/** Whether this recursive instance is expanded */
	isExpanded: boolean;
	/** Callback when expand/collapse button is clicked */
	onToggle: () => void;
	/** Recursion depth for visual hierarchy */
	depth?: number;
	/** Children to render when expanded */
	children?: React.ReactNode;
}

const RecursiveFieldComponent: React.FC<RecursiveFieldProps> = ({
	definition,
	isExpanded,
	onToggle,
	depth = 0,
	children,
	touched,
	errors,
}) => {
	const hasErrors = touched && errors.length > 0;

	return (
		<div 
			className={`rtsf-field rtsf-recursive-field ${definition.className || ''}`}
			style={{ marginLeft: `${depth * 16}px` }}
		>
			<button
				type="button"
				onClick={onToggle}
				className="rtsf-recursive-toggle"
				aria-expanded={isExpanded}
				aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${definition.label}`}
			>
				<span className="rtsf-recursive-icon" aria-hidden="true">
					{isExpanded ? '▼' : '▶'}
				</span>
				<span className="rtsf-recursive-label">
					{definition.label}
					{definition.required && <span className="rtsf-required" aria-label="required"> *</span>}
				</span>
				{definition.recursiveTypeRef && (
					<span className="rtsf-recursive-type-hint">
						{` (${definition.recursiveTypeRef})`}
					</span>
				)}
			</button>

			{definition.helpText && !hasErrors && (
				<div className="rtsf-help-text">{definition.helpText}</div>
			)}

			{hasErrors && (
				<div className="rtsf-error" role="alert">
					{errors.map((error, idx) => (
						<div key={idx}>{error}</div>
					))}
				</div>
			)}

			{isExpanded && (
				<div className="rtsf-recursive-content" role="group" aria-label={`${definition.label} content`}>
					{children}
				</div>
			)}
		</div>
	);
};

RecursiveFieldComponent.displayName = 'RecursiveField';

// Performance optimization: Memoize component to prevent unnecessary re-renders
export const RecursiveField = React.memo(RecursiveFieldComponent);
