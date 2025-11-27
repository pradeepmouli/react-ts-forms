import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from '../../../src/components/fields/NumberField';
import type { FieldProps } from '../../../src/types/FieldProps';

/**
 * T020 [P] [US1] Unit tests for NumberField component
 * Test number input behavior
 */

describe('NumberField', () => {
	afterEach(() => {
		cleanup();
	});

	const createFieldProps = (overrides?: Partial<FieldProps<number>>): FieldProps<number> => ({
		definition: {
			name: 'age',
			type: 'number',
			label: 'Age',
			required: true,
			readonly: false,
			controlType: 'number',
		},
		value: 25,
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
		...overrides,
	});

	it('should render number input with type="number"', () => {
		const props = createFieldProps();
		render(<NumberField {...props} />);

		const input = screen.getByRole('spinbutton', { name: /age/i });
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('should call onChange with numeric value when user types', () => {
		const onChange = vi.fn();
		const props = createFieldProps({ onChange, value: 0 });

		render(<NumberField {...props} />);
		const input = screen.getByRole('spinbutton');

		fireEvent.change(input, { target: { value: '42' } });
		expect(onChange).toHaveBeenCalledWith(42);
	});

	it('should call onChange with null when input is cleared', () => {
		const onChange = vi.fn();
		const props = createFieldProps({ onChange });

		render(<NumberField {...props} />);
		const input = screen.getByRole('spinbutton');

		fireEvent.change(input, { target: { value: '' } });
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it('should display error message when errors are present and field is touched', () => {
		const props = createFieldProps({
			errors: ['Age must be at least 18'],
			touched: true,
		});

		render(<NumberField {...props} />);
		expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('should not display error message when errors are present but field is not touched', () => {
		const props = createFieldProps({
			errors: ['Age must be at least 18'],
			touched: false,
		});

		render(<NumberField {...props} />);
		expect(screen.queryByText('Age must be at least 18')).not.toBeInTheDocument();
	});

	it('should apply aria-required when field is required', () => {
		const props = createFieldProps();
		render(<NumberField {...props} />);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('aria-required', 'true');
	});

	it('should be disabled when readonly is true', () => {
		const props = createFieldProps({
			definition: {
				...createFieldProps().definition,
				readonly: true,
			},
		});

		render(<NumberField {...props} />);
		const input = screen.getByRole('spinbutton');
		expect(input).toBeDisabled();
	});

	it('should display placeholder text when provided', () => {
		const props = createFieldProps({
			definition: {
				...createFieldProps().definition,
				placeholder: 'Enter your age',
			},
		});

		render(<NumberField {...props} />);
		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('placeholder', 'Enter your age');
	});

	it('should display help text when provided and no errors', () => {
		const props = createFieldProps({
			definition: {
				...createFieldProps().definition,
				helpText: 'Must be 18 or older',
			},
		});

		render(<NumberField {...props} />);
		expect(screen.getByText('Must be 18 or older')).toBeInTheDocument();
	});

	it('should hide help text when errors are present and field is touched', () => {
		const props = createFieldProps({
			definition: {
				...createFieldProps().definition,
				helpText: 'Must be 18 or older',
			},
			errors: ['Age must be at least 18'],
			touched: true,
		});

		render(<NumberField {...props} />);
		expect(screen.queryByText('Must be 18 or older')).not.toBeInTheDocument();
		expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
	});

	it('should display validating message when validating is true', () => {
		const props = createFieldProps({
			validating: true,
		});

		render(<NumberField {...props} />);
		expect(screen.getByText('Validating...')).toBeInTheDocument();
	});

	it('should call onBlur when input loses focus', async () => {
		const onBlur = vi.fn();
		const props = createFieldProps({ onBlur });
		const user = userEvent.setup();

		render(<NumberField {...props} />);
		const input = screen.getByRole('spinbutton');

		await user.click(input);
		await user.tab();

		expect(onBlur).toHaveBeenCalled();
	});

	it('should display required asterisk when field is required', () => {
		const props = createFieldProps();
		render(<NumberField {...props} />);

		const label = screen.getByText(/age/i);
		expect(label).toBeInTheDocument();
		// Check that asterisk exists within the label's parent container
		expect(screen.getByText('*')).toBeInTheDocument();
		expect(screen.getByText('*')).toHaveAttribute('aria-label', 'required');
	});
});
