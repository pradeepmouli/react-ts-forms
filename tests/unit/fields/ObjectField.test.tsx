import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ObjectField } from '../../../src/components/fields/ObjectField';
import type { FieldProps } from '../../../src/types/FieldProps';

/**
 * T022 [P] [US1] Unit tests for ObjectField component
 * Ensure nested groups render with correct semantics
 */

describe('ObjectField', () => {
	afterEach(() => cleanup());

	const createFieldProps = (overrides?: Partial<FieldProps<Record<string, unknown>>>): FieldProps<Record<string, unknown>> => {
		const {
			definition: definitionOverride,
			...rest
		} = overrides ?? {};

		return {
			definition: {
				name: 'address',
				type: 'object',
				label: 'Address',
				required: false,
				readonly: false,
				controlType: 'custom',
				...definitionOverride,
			},
			value: {},
			onChange: vi.fn(),
			onBlur: vi.fn(),
			touched: false,
			errors: [],
			validating: false,
			formState: {
				values: {},
				errors: {},
				touched: new Set(),
				validating: new Set(),
				submitted: false,
				submitting: false,
				isValid: true,
				isDirty: false,
				expandedArrayItems: {},
				expandedRecursiveFields: new Set(),
				selectedUnionVariants: {},
			},
			...rest,
		};
	};

	it('should render fieldset wrapper with legend label', () => {
		const props = createFieldProps();
		render(
			<ObjectField {...props}>
				<div>Child</div>
			</ObjectField>
		);
		const fieldset = screen.getByRole('group', { name: /address/i });
		expect(fieldset.tagName.toLowerCase()).toBe('fieldset');
		expect(screen.getByText('Address')).toBeInTheDocument();
	});

	it('should render required asterisk when field is required', () => {
		const props = createFieldProps({ definition: { required: true } });
		render(
			<ObjectField {...props}>
				<div>Nested</div>
			</ObjectField>
		);
		expect(screen.getByText('*')).toHaveAttribute('aria-label', 'required');
	});

	it('should render provided help text', () => {
		const props = createFieldProps({ definition: { helpText: 'Enter your shipping info' } });
		render(
			<ObjectField {...props}>
				<div>Nested</div>
			</ObjectField>
		);
		expect(screen.getByText('Enter your shipping info')).toBeInTheDocument();
	});

	it('should render all nested children inside container', () => {
		const props = createFieldProps();
		render(
			<ObjectField {...props}>
				<div data-testid="child-1">Street</div>
				<div data-testid="child-2">City</div>
			</ObjectField>
		);
		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
	});

	it('should merge custom class names onto fieldset', () => {
		const props = createFieldProps({ definition: { className: 'custom-class' } });
		render(
			<ObjectField {...props}>
				<div>Inner</div>
			</ObjectField>
		);
		const fieldset = screen.getByRole('group', { name: /address/i });
		expect(fieldset).toHaveClass('custom-class');
	});
});
