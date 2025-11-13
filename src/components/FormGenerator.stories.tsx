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

/**
 * T104: Decorator example (Phase 5)
 * Demonstrates @ControlType decorator to use textarea instead of text input
 */
export const WithControlTypeDecorator: Story = {
	args: {
		schema: (() => {
			// Manually create a schema that simulates decorator application
			const titleField = TypeParser.parseType('title', { kind: 'string', required: true });
			// Simulate @ControlType('textarea') decorator
			titleField.controlType = 'textarea';
			
			const descriptionField = TypeParser.parseType('description', { kind: 'string', required: false });
			descriptionField.controlType = 'textarea';
			descriptionField.placeholder = 'Enter a detailed description...';
			descriptionField.helpText = 'Provide a comprehensive description of your content';

			const fields = [titleField, descriptionField];

			return SchemaBuilder.buildSchema('Article', fields, {
				title: 'Article Editor (with @ControlType)',
				description: 'Demonstrating controlType override for textarea fields',
			});
		})(),
		initialValues: {
			title: 'Understanding React Forms',
			description: 'This article explores the various approaches to building forms in React applications.',
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T105: Custom validation example (Phase 5)
 * Demonstrates custom validator functions with error messages
 */
export const WithCustomValidation: Story = {
	args: {
		schema: (() => {
			const usernameField = TypeParser.parseType('username', { kind: 'string', required: true });
			usernameField.validators = [
				{
					type: 'minLength',
					value: 3,
					message: 'Username must be at least 3 characters',
				},
				{
					type: 'custom',
					message: 'Username can only contain letters, numbers, and underscores',
					validator: (value) => {
						if (typeof value !== 'string') return false;
						return /^[a-zA-Z0-9_]+$/.test(value);
					},
				},
			];

			const passwordField = TypeParser.parseType('password', { kind: 'string', required: true });
			passwordField.validators = [
				{
					type: 'minLength',
					value: 8,
					message: 'Password must be at least 8 characters',
				},
				{
					type: 'custom',
					message: 'Password must contain at least one uppercase, one lowercase, and one number',
					validator: (value) => {
						if (typeof value !== 'string') return false;
						return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
					},
				},
			];

			const emailField = TypeParser.parseType('email', { kind: 'string', required: true });
			emailField.validators = [
				{
					type: 'email',
					message: 'Please enter a valid email address',
				},
			];

			const fields = [usernameField, passwordField, emailField];

			return SchemaBuilder.buildSchema('UserRegistration', fields, {
				title: 'User Registration (with Custom Validation)',
				description: 'Try submitting with invalid data to see custom validation messages',
			});
		})(),
		initialValues: {
			username: '',
			password: '',
			email: '',
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Registration successful!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T107: Custom styling example (Phase 5)
 * Demonstrates className and style props on fields
 */
export const WithCustomStyling: Story = {
	args: {
		schema: (() => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			nameField.className = 'custom-name-field';
			nameField.style = { backgroundColor: '#f0f8ff', padding: '12px' };

			const emailField = TypeParser.parseType('email', { kind: 'string', required: true });
			emailField.className = 'custom-email-field';
			emailField.style = { border: '2px solid #4CAF50', borderRadius: '8px' };

			const bioField = TypeParser.parseType('bio', { kind: 'string', required: false });
			bioField.controlType = 'textarea';
			bioField.className = 'custom-bio-field';
			bioField.style = { 
				backgroundColor: '#fffacd',
				fontFamily: 'Georgia, serif',
				fontSize: '16px',
			};

			const fields = [nameField, emailField, bioField];

			return SchemaBuilder.buildSchema('StyledProfile', fields, {
				title: 'Styled Profile Form',
				description: 'Fields with custom className and style props',
			});
		})(),
		initialValues: {
			name: 'Grace Hopper',
			email: 'grace@example.com',
			bio: 'Computer scientist and United States Navy rear admiral.',
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T125: Recursive type example (Phase 6)
 * Demonstrates recursive types with expand/collapse UI (TreeNode example)
 */
export const WithRecursiveTypes: Story = {
	args: {
		schema: (() => {
			// Create a TreeNode type with recursive children
			const treeNodeType: TypeInfo = {
				kind: 'object',
				name: 'TreeNode',
				properties: {
					label: { kind: 'string', required: true },
					value: { kind: 'string', required: true },
					// Recursive reference - children is an array of TreeNode
					children: { 
						kind: 'array',
						elementType: {
							kind: 'object',
							name: 'TreeNode', // Same type name triggers recursion detection
							properties: {
								label: { kind: 'string', required: true },
								value: { kind: 'string', required: true },
							},
						},
					},
				},
			};

			const rootField = TypeParser.parseType('root', treeNodeType);

			return SchemaBuilder.buildSchema('TreeStructure', [rootField], {
				title: 'Tree Structure (Recursive Type)',
				description: 'Click the expand buttons to reveal nested tree nodes',
			});
		})(),
		initialValues: {
			root: {
				label: 'Root',
				value: 'root',
				children: [
					{
						label: 'Child 1',
						value: 'child1',
						children: [],
					},
					{
						label: 'Child 2',
						value: 'child2',
						children: [],
					},
				],
			},
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * T126: Readonly field example (Phase 6)
 * Demonstrates readonly/disabled fields
 */
export const WithReadonlyFields: Story = {
	args: {
		schema: (() => {
			const idField = TypeParser.parseType('id', { kind: 'string', required: true, readonly: true });
			idField.helpText = 'This field is read-only';

			const usernameField = TypeParser.parseType('username', { kind: 'string', required: true });
			
			const emailField = TypeParser.parseType('email', { kind: 'string', required: true, readonly: true });
			emailField.helpText = 'Email cannot be changed';

			const rolesField = TypeParser.parseType('roles', {
				kind: 'array',
				elementType: { kind: 'string' },
				readonly: true,
			});
			rolesField.helpText = 'Roles are managed by administrators';

			const fields = [idField, usernameField, emailField, rolesField];

			return SchemaBuilder.buildSchema('UserProfile', fields, {
				title: 'User Profile (with Readonly Fields)',
				description: 'Some fields are read-only and cannot be edited',
			});
		})(),
		initialValues: {
			id: 'user-12345',
			username: 'ada_lovelace',
			email: 'ada@example.com',
			roles: ['developer', 'admin'],
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};

/**
 * Phase 6: Template literal types example
 * Demonstrates template literal type patterns for validation and field masks
 */
export const WithTemplateLiteralTypes: Story = {
	args: {
		schema: (() => {
			// User ID must match pattern: user-{number}
			const userIdField = TypeParser.parseType('userId', {
				kind: 'template-literal',
				templatePattern: 'user-${number}',
				required: true,
			});
			userIdField.placeholder = 'e.g., user-123';
			userIdField.helpText = 'Must match pattern: user-{number}';

			// SKU must match pattern: SKU-{uppercase}-{number}
			const skuField = TypeParser.parseType('productSku', {
				kind: 'template-literal',
				templatePattern: 'SKU-${string}-${number}',
				required: true,
			});
			skuField.placeholder = 'e.g., SKU-LAPTOP-4567';
			skuField.helpText = 'Must match pattern: SKU-{text}-{number}';

			// Version must match semantic versioning
			const versionField = TypeParser.parseType('version', {
				kind: 'template-literal',
				templatePattern: '${number}.${number}.${number}',
				required: true,
			});
			versionField.placeholder = 'e.g., 1.2.3';
			versionField.helpText = 'Semantic version: major.minor.patch';

			// Status flag
			const statusField = TypeParser.parseType('active', {
				kind: 'template-literal',
				templatePattern: '${boolean}',
				required: false,
			});
			statusField.helpText = 'Must be "true" or "false"';

			const fields = [userIdField, skuField, versionField, statusField];

			return SchemaBuilder.buildSchema('TemplatePatterns', fields, {
				title: 'Template Literal Type Patterns',
				description: 'Fields with template literal type validation (try invalid patterns to see validation)',
			});
		})(),
		initialValues: {
			userId: 'user-42',
			productSku: 'SKU-MOUSE-789',
			version: '2.1.0',
			active: 'true',
		},
		onSubmit: (values) => {
			console.log('Form submitted:', values);
			alert(`Form submitted!\n${JSON.stringify(values, null, 2)}`);
		},
	},
};
