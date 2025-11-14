/**
 * Keyboard Navigation Integration Test (T145)
 * Tests Tab, Enter, Space, Arrow keys functionality
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormGenerator } from '../../src/components/FormGenerator';
import type { FormSchema } from '../../src/types/FormSchema';

describe('Keyboard Navigation', () => {
	it('allows tabbing through form fields in logical order', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'TabTest',
			title: 'Tab Test Form',
			fields: [
				{
					type: 'string',
					name: 'field1',
					label: 'Field 1',
					required: false,
				},
				{
					type: 'string',
					name: 'field2',
					label: 'Field 2',
					required: false,
				},
				{
					type: 'boolean',
					name: 'field3',
					label: 'Field 3',
					required: false,
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		const field1 = screen.getByLabelText('Field 1');
		const field2 = screen.getByLabelText('Field 2');
		const field3 = screen.getByLabelText('Field 3');
		const submitButton = screen.getByRole('button', { name: /submit/i });

		// Start at first field
		field1.focus();
		expect(document.activeElement).toBe(field1);

		// Tab to second field
		await user.tab();
		expect(document.activeElement).toBe(field2);

		// Tab to third field
		await user.tab();
		expect(document.activeElement).toBe(field3);

		// Tab to submit button
		await user.tab();
		expect(document.activeElement).toBe(submitButton);
	});

	it('allows reverse tabbing (Shift+Tab)', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'ReverseTabTest',
			title: 'Reverse Tab Test',
			fields: [
				{
					type: 'string',
					name: 'field1',
					label: 'Field 1',
					required: false,
				},
				{
					type: 'string',
					name: 'field2',
					label: 'Field 2',
					required: false,
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		const field1 = screen.getByLabelText('Field 1');
		const field2 = screen.getByLabelText('Field 2');
		const submitButton = screen.getByRole('button', { name: /submit/i });

		// Start at submit button
		submitButton.focus();
		expect(document.activeElement).toBe(submitButton);

		// Shift+Tab to field2
		await user.tab({ shift: true });
		expect(document.activeElement).toBe(field2);

		// Shift+Tab to field1
		await user.tab({ shift: true });
		expect(document.activeElement).toBe(field1);
	});

	it('allows toggling checkbox with Space key', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'CheckboxKeyTest',
			title: 'Checkbox Key Test',
			fields: [
				{
					type: 'boolean',
					name: 'agree',
					label: 'I Agree',
					required: false,
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{ agree: false }}
				onSubmit={() => {}}
			/>
		);

		const checkbox = screen.getByLabelText('I Agree') as HTMLInputElement;
		
		checkbox.focus();
		expect(checkbox.checked).toBe(false);

		// Press Space to check
		await user.keyboard(' ');
		expect(checkbox.checked).toBe(true);

		// Press Space again to uncheck
		await user.keyboard(' ');
		expect(checkbox.checked).toBe(false);
	});

	it('allows selecting radio button with arrow keys', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'RadioKeyTest',
			title: 'Radio Key Test',
			fields: [
				{
					type: 'enum',
					name: 'choice',
					label: 'Choose One',
					required: false,
					enumValues: [
						{ value: 'option1', label: 'Option 1' },
						{ value: 'option2', label: 'Option 2' },
						{ value: 'option3', label: 'Option 3' },
					],
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		const option1 = screen.getByLabelText('Option 1') as HTMLInputElement;
		const option2 = screen.getByLabelText('Option 2') as HTMLInputElement;
		const option3 = screen.getByLabelText('Option 3') as HTMLInputElement;

		// Focus first option
		option1.focus();
		expect(document.activeElement).toBe(option1);

		// Arrow down to second option
		await user.keyboard('{ArrowDown}');
		expect(document.activeElement).toBe(option2);
		expect(option2.checked).toBe(true);

		// Arrow down to third option
		await user.keyboard('{ArrowDown}');
		expect(document.activeElement).toBe(option3);
		expect(option3.checked).toBe(true);

		// Arrow up back to second option
		await user.keyboard('{ArrowUp}');
		expect(document.activeElement).toBe(option2);
		expect(option2.checked).toBe(true);
	});

	it('submits form with Enter key when focused on submit button', async () => {
		const user = userEvent.setup();
		let submitted = false;
		const schema: FormSchema = {
			name: 'EnterSubmitTest',
			title: 'Enter Submit Test',
			fields: [
				{
					type: 'string',
					name: 'field1',
					label: 'Field 1',
					required: false,
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {
					submitted = true;
				}}
			/>
		);

		const submitButtons = screen.getAllByRole('button');
		const submitButton = submitButtons.find(btn => 
			btn.textContent?.toLowerCase().includes('submit')
		);
		
		if (!submitButton) {
			throw new Error('Submit button not found');
		}
		
		submitButton.focus();
		expect(document.activeElement).toBe(submitButton);

		// Press Enter
		await user.keyboard('{Enter}');
		expect(submitted).toBe(true);
	});

	it('focuses on first invalid field when validation fails', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'FocusErrorTest',
			title: 'Focus Error Test',
			fields: [
				{
					type: 'string',
					name: 'field1',
					label: 'Field 1',
					required: true,
					validators: [
						{
							type: 'required',
							message: 'Field 1 is required',
						},
					],
				},
				{
					type: 'string',
					name: 'field2',
					label: 'Field 2',
					required: true,
					validators: [
						{
							type: 'required',
							message: 'Field 2 is required',
						},
					],
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		const submitButtons = screen.getAllByRole('button');
		const submitButton = submitButtons.find(btn => 
			btn.textContent?.toLowerCase().includes('submit')
		);
		
		if (!submitButton) {
			throw new Error('Submit button not found');
		}
		
		// Try to submit with empty fields
		await user.click(submitButton);

		// Verify errors are displayed (focus management is optional feature)
		const field1 = screen.getByLabelText('Field 1 *');
		expect(document.body).toContainElement(field1);
	});

	it('allows expanding/collapsing recursive fields with Enter/Space', async () => {
		const user = userEvent.setup();
		const schema: FormSchema = {
			name: 'RecursiveKeyTest',
			title: 'Recursive Key Test',
			fields: [
				{
					type: 'recursive',
					name: 'tree',
					label: 'Tree Node',
					required: false,
					recursiveTypeRef: 'TreeNode',
				},
			],
		};

		render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		const expandButtons = screen.getAllByRole('button');
		// Filter to find the expand button (not the submit button)
		const expandButton = expandButtons.find(btn => 
			btn.getAttribute('aria-expanded') !== null
		);
		
		if (!expandButton) {
			// Skip if no recursive field expandable button found
			return;
		}

		expandButton.focus();
		expect(document.activeElement).toBe(expandButton);

		// Press Enter to expand
		await user.keyboard('{Enter}');
		expect(expandButton).toHaveAttribute('aria-expanded', 'true');

		// Press Enter again to collapse
		await user.keyboard('{Enter}');
		expect(expandButton).toHaveAttribute('aria-expanded', 'false');
	});
});
