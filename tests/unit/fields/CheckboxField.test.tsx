import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxField } from '../../../src/components/fields/CheckboxField';
import type { FieldProps } from '../../../src/types/FieldProps';

/**
 * T021 [P] [US1] Unit tests for CheckboxField component
 * Validate checkbox rendering, state, and accessibility
 */

describe('CheckboxField', () => {
	afterEach(() => cleanup());

	const createFieldProps = (overrides?: Partial<FieldProps<boolean>>): FieldProps<boolean> => {
		const {
			definition: definitionOverride,
			...rest
		} = overrides ?? {};

		return {
			definition: {
				name: 'acceptTerms',
				type: 'boolean',
				label: 'Accept Terms',
				required: true,
				readonly: false,
				controlType: 'checkbox',
				...definitionOverride,
			},
			value: false,
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

	it('should render checkbox input with type="checkbox"', () => {
		const props = createFieldProps();
		render(<CheckboxField {...props} />);
		const input = screen.getByRole('checkbox', { name: /accept terms/i });
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'checkbox');
	});

	it('should call onChange with boolean value when toggled', () => {
		const onChange = vi.fn();
		const props = createFieldProps({ onChange });
		render(<CheckboxField {...props} />);
		const input = screen.getByRole('checkbox');
		fireEvent.click(input);
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('should reflect checked state when value is true', () => {
		const props = createFieldProps({ value: true });
		render(<CheckboxField {...props} />);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('should reflect unchecked state when value is false or undefined', () => {
		const props = createFieldProps({ value: undefined });
		render(<CheckboxField {...props} />);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('should associate label with checkbox via htmlFor', () => {
		const props = createFieldProps();
		render(<CheckboxField {...props} />);
		const label = screen.getByText(/accept terms/i);
		const input = screen.getByRole('checkbox');
		expect(label).toHaveAttribute('for', input.getAttribute('id'));
	});

	it('should apply aria-required when field is required', () => {
		const props = createFieldProps({ definition: { required: true } });
		render(<CheckboxField {...props} />);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
	});

	it('should display help text when provided and no errors', () => {
		const props = createFieldProps({ definition: { helpText: 'You must agree before continuing' } });
		render(<CheckboxField {...props} />);
		expect(screen.getByText('You must agree before continuing')).toBeInTheDocument();
	});

	it('should display error message when touched with errors', () => {
		const props = createFieldProps({ errors: ['You must accept'], touched: true });
		render(<CheckboxField {...props} />);
		expect(screen.getByText('You must accept')).toBeInTheDocument();
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('should disable checkbox when readonly', () => {
		const props = createFieldProps({ definition: { readonly: true } });
		render(<CheckboxField {...props} />);
		expect(screen.getByRole('checkbox')).toBeDisabled();
	});

	it('should call onBlur when checkbox loses focus', async () => {
		const onBlur = vi.fn();
		const props = createFieldProps({ onBlur });
		const user = userEvent.setup();
		render(<CheckboxField {...props} />);
		const input = screen.getByRole('checkbox');
		await user.click(input);
		await user.tab();
		expect(onBlur).toHaveBeenCalled();
	});
});
