/**
 * Comprehensive Accessibility Test Suite (T144)
 * Tests all field types with axe-core for WCAG 2.1 AA compliance
 */

import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { testA11y } from '../../vitest.setup';
import { FormGenerator } from '../../src/components/FormGenerator';
import type { FormSchema } from '../../src/types/FormSchema';

describe('Comprehensive Accessibility Suite', () => {
	it('validates form with all primitive field types', async () => {
		const schema: FormSchema = {
			name: 'ComprehensiveForm',
			title: 'Comprehensive Form',
			fields: [
				{
					type: 'string',
					name: 'textField',
					label: 'Text Field',
					required: true,
				},
				{
					type: 'number',
					name: 'numberField',
					label: 'Number Field',
					required: false,
				},
				{
					type: 'boolean',
					name: 'checkboxField',
					label: 'Checkbox Field',
					required: false,
				},
				{
					type: 'date',
					name: 'dateField',
					label: 'Date Field',
					required: false,
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with complex field types', async () => {
		const schema: FormSchema = {
			name: 'ComplexForm',
			title: 'Complex Form',
			fields: [
				{
					type: 'enum',
					name: 'selectField',
					label: 'Select Field',
					required: true,
					enumValues: [
						{ value: 'option1', label: 'Option 1' },
						{ value: 'option2', label: 'Option 2' },
						{ value: 'option3', label: 'Option 3' },
					],
				},
				{
					type: 'array',
					name: 'arrayField',
					label: 'Array Field',
					required: false,
					elementType: { type: 'string' },
				},
				{
					type: 'object',
					name: 'objectField',
					label: 'Object Field',
					required: false,
					properties: [
						{
							type: 'string',
							name: 'nested',
							label: 'Nested String',
							required: false,
						},
					],
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with radio buttons (small enum)', async () => {
		const schema: FormSchema = {
			name: 'RadioForm',
			title: 'Radio Form',
			fields: [
				{
					type: 'enum',
					name: 'radioField',
					label: 'Radio Field',
					required: true,
					enumValues: [
						{ value: 'yes', label: 'Yes' },
						{ value: 'no', label: 'No' },
					],
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with union types', async () => {
		const schema: FormSchema = {
			name: 'UnionForm',
			title: 'Union Form',
			fields: [
				{
					type: 'union',
					name: 'unionField',
					label: 'Union Field',
					required: false,
					variants: [
						{
							type: 'string',
							name: 'stringVariant',
							label: 'String Variant',
							required: false,
						},
						{
							type: 'number',
							name: 'numberVariant',
							label: 'Number Variant',
							required: false,
						},
					],
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with errors displayed', async () => {
		const schema: FormSchema = {
			name: 'ErrorForm',
			title: 'Error Form',
			fields: [
				{
					type: 'string',
					name: 'requiredField',
					label: 'Required Field',
					required: true,
					validators: [
						{
							type: 'required',
							message: 'This field is required',
						},
					],
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{ requiredField: '' }}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with help text', async () => {
		const schema: FormSchema = {
			name: 'HelpTextForm',
			title: 'Help Text Form',
			fields: [
				{
					type: 'string',
					name: 'fieldWithHelp',
					label: 'Field With Help',
					required: false,
					helpText: 'This is helpful information about the field',
				},
			],
		};

		const { container} = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with readonly fields', async () => {
		const schema: FormSchema = {
			name: 'ReadonlyForm',
			title: 'Readonly Form',
			fields: [
				{
					type: 'string',
					name: 'readonlyField',
					label: 'Readonly Field',
					required: false,
					readonly: true,
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{ readonlyField: 'Cannot edit this' }}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});

	it('validates form with recursive fields (collapsed)', async () => {
		const schema: FormSchema = {
			name: 'RecursiveForm',
			title: 'Recursive Form',
			fields: [
				{
					type: 'recursive',
					name: 'recursiveField',
					label: 'Recursive Field',
					required: false,
					recursiveTypeRef: 'TreeNode',
				},
			],
		};

		const { container } = render(
			<FormGenerator
				schema={schema}
				initialValues={{}}
				onSubmit={() => {}}
			/>
		);

		await testA11y(container);
	});
});
