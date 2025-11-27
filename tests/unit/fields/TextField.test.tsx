import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '../../../src/components/fields/TextField';
import type { FieldProps } from '../../../src/types/FieldProps';

/**
 * T019 [P] [US1] Unit tests for TextField component
 * Test rendering, onChange, onBlur, error display, and masking behavior
 */

describe('TextField', () => {
	afterEach(() => cleanup());

	const createFieldProps = (overrides?: Partial<FieldProps<string>>): FieldProps<string> => {
		const {
			definition: definitionOverride,
			...rest
		} = overrides ?? {};

		return {
			definition: {
				name: 'firstName',
				type: 'string',
				label: 'First Name',
				required: true,
				readonly: false,
				controlType: 'text',
				...definitionOverride,
			},
			value: '',
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

	it('should render text input with label', () => {
		const props = createFieldProps();
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox', { name: /first name/i });
		expect(input).toBeInTheDocument();
	});

	it('should call onChange when input value changes', () => {
		const onChange = vi.fn();
		const props = createFieldProps({ onChange });
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'Jane' } });
		expect(onChange).toHaveBeenCalledWith('Jane');
	});

	it('should call onBlur when input loses focus', async () => {
		const onBlur = vi.fn();
		const props = createFieldProps({ onBlur });
		const user = userEvent.setup();
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox');
		await user.click(input);
		await user.tab();
		expect(onBlur).toHaveBeenCalled();
	});

	it('should display error message and aria attributes when touched with errors', () => {
		const props = createFieldProps({
			errors: ['Required'],
			touched: true,
		});
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox');
		expect(screen.getByText('Required')).toBeInTheDocument();
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby');
	});

	it('should not display errors when field has not been touched', () => {
		const props = createFieldProps({ errors: ['Required'], touched: false });
		render(<TextField {...props} />);
		expect(screen.queryByText('Required')).not.toBeInTheDocument();
	});

	it('should apply aria-required when field is required', () => {
		const props = createFieldProps({ definition: { required: true } });
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-required', 'true');
	});

	it('should associate label with input via htmlFor/id', () => {
		const props = createFieldProps();
		render(<TextField {...props} />);
		const label = screen.getByText(/first name/i);
		const input = screen.getByRole('textbox');
		expect(label).toHaveAttribute('for', input.getAttribute('id'));
	});

	it('should render provided placeholder text', () => {
		const props = createFieldProps({
			definition: { placeholder: 'Enter name' },
		});
		render(<TextField {...props} />);
		expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
	});

	it('should render help text when provided and no errors', () => {
		const props = createFieldProps({
			definition: { helpText: 'We use this to greet you' },
		});
		render(<TextField {...props} />);
		expect(screen.getByText('We use this to greet you')).toBeInTheDocument();
	});

	it('should use mask placeholder when template pattern is provided', () => {
		const props = createFieldProps({
			definition: {
				metadata: { templatePattern: 'user-${number}' },
				placeholder: undefined,
			},
		});
		render(<TextField {...props} />);
		expect(screen.getByPlaceholderText('user-123')).toBeInTheDocument();
	});

	it('should call onChange with raw value when mask is applied', () => {
		const onChange = vi.fn();
		const props = createFieldProps({
			onChange,
			definition: {
				metadata: { templatePattern: 'acct-${number}' },
			},
		});
		render(<TextField {...props} />);
		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'acct-987' } });
		expect(onChange).toHaveBeenCalledWith('987');
	});
});
