import { describe, it, expect } from 'vitest';
import { SchemaBuilder } from '../../../src/generator/SchemaBuilder';
import { TypeParser } from '../../../src/generator/TypeParser';

/**
 * T018 [P] [US1] Unit tests for SchemaBuilder
 * Test FormSchema generation from type definitions
 */

describe('SchemaBuilder', () => {
	describe('buildSchema', () => {
		it('should create FormSchema from parsed type with default labels', () => {
			const nameField = TypeParser.parseType('name', { kind: 'string', required: true });
			const ageField = TypeParser.parseType('age', { kind: 'number', required: false });
			
			const schema = SchemaBuilder.buildSchema('UserProfile', [nameField, ageField], {
				title: 'User Profile',
			});
			
			expect(schema.id).toBe('UserProfile');
			expect(schema.title).toBe('User Profile');
			expect(schema.fields).toHaveLength(2);
			expect(schema.fields[0].name).toBe('name');
			expect(schema.fields[1].name).toBe('age');
		});

		it('should generate default labels from field names (camelCase to Title Case)', () => {
			const field = TypeParser.parseType('firstName', { kind: 'string', required: true });
			const schema = SchemaBuilder.buildSchema('Test', [field]);
			
			expect(schema.fields[0].label).toBe('First Name');
		});

		it('should set required flag based on type optionality', () => {
			const requiredField = TypeParser.parseType('email', { kind: 'string', required: true });
			const optionalField = TypeParser.parseType('phone', { kind: 'string', required: false });
			
			const schema = SchemaBuilder.buildSchema('Contact', [requiredField, optionalField]);
			
			expect(schema.fields[0].required).toBe(true);
			expect(schema.fields[1].required).toBe(false);
		});

		it('should handle nested object fields recursively', () => {
			const addressField = TypeParser.parseType('address', {
				kind: 'object',
				required: true,
				properties: {
					street: { kind: 'string', required: true },
					city: { kind: 'string', required: true },
				},
			});
			
			const schema = SchemaBuilder.buildSchema('User', [addressField]);
			
			expect(schema.fields[0].type).toBe('object');
			expect(schema.fields[0].nestedFields).toBeDefined();
			expect(schema.fields[0].nestedFields!.length).toBeGreaterThan(0);
		});
	});

	describe('generateDefaultLabel', () => {
		it('should convert camelCase to Title Case', () => {
			const field = TypeParser.parseType('firstName', { kind: 'string', required: true });
			const schema = SchemaBuilder.buildSchema('Test', [field]);
			
			expect(schema.fields[0].label).toBe('First Name');
		});

		it('should handle single word fields', () => {
			const field = TypeParser.parseType('name', { kind: 'string', required: true });
			const schema = SchemaBuilder.buildSchema('Test', [field]);
			
			expect(schema.fields[0].label).toBe('Name');
		});

		it('should handle acronyms correctly', () => {
			const field = TypeParser.parseType('userID', { kind: 'string', required: true });
			const schema = SchemaBuilder.buildSchema('Test', [field]);
			
			// Should preserve ID as uppercase
			expect(schema.fields[0].label).toMatch(/ID/);
		});
	});

	describe('complex schema building', () => {
		it('should build schema with multiple field types', () => {
			const fields = [
				TypeParser.parseType('name', { kind: 'string', required: true }),
				TypeParser.parseType('age', { kind: 'number', required: false }),
				TypeParser.parseType('isActive', { kind: 'boolean', required: true }),
				TypeParser.parseType('birthdate', { kind: 'date', required: false }),
			];
			
			const schema = SchemaBuilder.buildSchema('ComplexForm', fields, {
				title: 'Complex Form',
				description: 'A form with multiple field types',
			});
			
			expect(schema.id).toBe('ComplexForm');
			expect(schema.title).toBe('Complex Form');
			expect(schema.description).toBe('A form with multiple field types');
			expect(schema.fields).toHaveLength(4);
		});

		it('should include metadata when provided', () => {
			const fields = [TypeParser.parseType('name', { kind: 'string', required: true })];
			
			const schema = SchemaBuilder.buildSchema('Test', fields, {
				title: 'Test Form',
				description: 'A test form description',
			});
			
			expect(schema.title).toBe('Test Form');
			expect(schema.description).toBe('A test form description');
		});
	});
});

