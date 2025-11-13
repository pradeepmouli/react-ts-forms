/**
 * FormGenerator Stories - Demonstrating Phase 3 & 4 functionality
 * T044, T074-T077: User Story 1 & 2 Storybook examples
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormGenerator } from './FormGenerator';
import { TypeParser, SchemaBuilder } from '../generator';
import type { TypeInfo } from '../generator/TypeParser';

const meta: Meta<typeof FormGenerator> = {
	title: 'Components/FormGenerator',
	component: FormGenerator,
	parameters: {
		layout: 'padded',
	},
};

export default meta;
type Story = StoryObj<typeof FormGenerator>;

/**
 * T044: Simple form example (Phase 3)
 * User profile with primitives and nested objects
 */
export const SimpleUserProfile: Story = {
	args: {
		schema: (() => {
			// Simulate a user profile type
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const ageField = TypeParser.parseType('age', { kind: 'number', required: false });
			const emailField = TypeParser.parseType('email', { kind: 'string', required: true });
			const isActiveField = TypeParser.parseType('isActive', { kind: 'boolean', required: false });

			const fields = [nameField, ageField, emailField, isActiveField];

			return SchemaBuilder.buildSchema('UserProfile', fields, {
				title: 'User Profile',
				description: 'Create or edit a user profile',
			});
		})(),
		initialValues: {
			name: 'Ada Lovelace',
			age: 36,
			email: 'ada@example.com',
			isActive: true,
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T077: Date field example (Phase 4)
 */
export const WithDateField: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const birthdateField = TypeParser.parseType('birthdate', { kind: 'date', required: true });

			const fields = [nameField, birthdateField];

			return SchemaBuilder.buildSchema('Person', fields, {
				title: 'Person Information',
			});
		})(),
		initialValues: {
			name: 'Grace Hopper',
			birthdate: new Date('1906-12-09'),
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T075: Enum select example (Phase 4)
 */
export const WithEnumSelect: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const roleField = TypeParser.parseType('role', {
				kind: 'enum',
				required: true,
				enumValues: [
					{ value: 'admin', label: 'Administrator' },
					{ value: 'editor', label: 'Editor' },
					{ value: 'viewer', label: 'Viewer' },
					{ value: 'guest', label: 'Guest' },
					{ value: 'owner', label: 'Owner' },
				],
			});

			const fields = [nameField, roleField];

			return SchemaBuilder.buildSchema('UserRole', fields, {
				title: 'User Role Assignment',
			});
		})(),
		initialValues: {
			name: 'Margaret Hamilton',
			role: 'admin',
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T075: Enum radio example (Phase 4)
 * Small enums (≤4 options) use radio buttons
 */
export const WithEnumRadio: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const priorityField = TypeParser.parseType('priority', {
				kind: 'enum',
				required: true,
				enumValues: [
					{ value: 1, label: 'Low' },
					{ value: 2, label: 'Medium' },
					{ value: 3, label: 'High' },
					{ value: 4, label: 'Critical' },
				],
			});

			const fields = [nameField, priorityField];

			return SchemaBuilder.buildSchema('Task', fields, {
				title: 'Task Priority',
			});
		})(),
		initialValues: {
			name: 'Fix bug',
			priority: 2,
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T074: Array field example (Phase 4)
 */
export const WithArrayField: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const tagsField = TypeParser.parseType('tags', {
				kind: 'array',
				required: false,
				elementType: { kind: 'string', required: false },
			});

			const fields = [nameField, tagsField];

			return SchemaBuilder.buildSchema('Article', fields, {
				title: 'Article Editor',
				description: 'Edit article details and tags',
			});
		})(),
		initialValues: {
			name: 'React TypeScript Forms',
			tags: ['react', 'typescript', 'forms'],
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * Nested object example (Phase 3)
 */
export const WithNestedObject: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const addressField = TypeParser.parseType('address', {
				kind: 'object',
				required: true,
				properties: {
					street: { kind: 'string', required: true },
					city: { kind: 'string', required: true },
					zipCode: { kind: 'string', required: true },
				},
			});

			const fields = [nameField, addressField];

			return SchemaBuilder.buildSchema('Contact', fields, {
				title: 'Contact Information',
			});
		})(),
		initialValues: {
			name: 'Katherine Johnson',
			address: {
				street: '123 Space Lane',
				city: 'Hampton',
				zipCode: '23669',
			},
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * Complex form with all field types (Phase 3 & 4 combined)
 */
export const ComplexForm: Story = {
	args: {
		schema: (() => {
			const fields = [
				TypeParser.parseType('title', { kind: 'string', required: true }),
				TypeParser.parseType('publishDate', { kind: 'date', required: true }),
				TypeParser.parseType('published', { kind: 'boolean', required: false }),
				TypeParser.parseType('category', {
					kind: 'enum',
					required: true,
					enumValues: [
						{ value: 'tech', label: 'Technology' },
						{ value: 'science', label: 'Science' },
						{ value: 'arts', label: 'Arts' },
					],
				}),
				TypeParser.parseType('tags', {
					kind: 'array',
					required: false,
					elementType: { kind: 'string', required: false },
				}),
				TypeParser.parseType('author', {
					kind: 'object',
					required: true,
					properties: {
						name: { kind: 'string', required: true },
						email: { kind: 'string', required: true },
					},
				}),
			];

			return SchemaBuilder.buildSchema('BlogPost', fields, {
				title: 'Blog Post Editor',
				description: 'Create or edit a blog post with all field types',
			});
		})(),
		initialValues: {
			title: 'The Future of Type-Driven Forms',
			publishDate: new Date(),
			published: false,
			category: 'tech',
			tags: ['forms', 'react', 'typescript'],
			author: {
				name: 'Jean Bartik',
				email: 'jean@example.com',
			},
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};
