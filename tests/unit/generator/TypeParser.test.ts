import { describe, it, expect } from 'vitest';
import { TypeParser } from '../../../src/generator/TypeParser';

/**
 * T017 [P] [US1] Unit tests for TypeParser
 * Test primitive type parsing: string→text, number→number, boolean→checkbox
 */

describe('TypeParser', () => {
	describe('parseType - primitive types', () => {
		it('should parse string type as text field', () => {
			const result = TypeParser.parseType('username', { kind: 'string', required: true });
			
			expect(result.name).toBe('username');
			expect(result.type).toBe('string');
			expect(result.controlType).toBe('text');
			expect(result.required).toBe(true);
		});

		it('should parse number type as number field', () => {
			const result = TypeParser.parseType('age', { kind: 'number', required: false });
			
			expect(result.name).toBe('age');
			expect(result.type).toBe('number');
			expect(result.controlType).toBe('number');
			expect(result.required).toBe(false);
		});

		it('should parse boolean type as checkbox field', () => {
			const result = TypeParser.parseType('isActive', { kind: 'boolean', required: true });
			
			expect(result.name).toBe('isActive');
			expect(result.type).toBe('boolean');
			expect(result.controlType).toBe('checkbox');
			expect(result.required).toBe(true);
		});

		it('should detect required vs optional fields', () => {
			const requiredField = TypeParser.parseType('email', { kind: 'string', required: true });
			const optionalField = TypeParser.parseType('phone', { kind: 'string', required: false });
			
			expect(requiredField.required).toBe(true);
			expect(optionalField.required).toBe(false);
		});

		it('should extract nested object fields', () => {
			const result = TypeParser.parseType('address', {
				kind: 'object',
				required: true,
				properties: {
					street: { kind: 'string', required: true },
					city: { kind: 'string', required: true },
					zipCode: { kind: 'string', required: false },
				},
			});
			
			expect(result.name).toBe('address');
			expect(result.type).toBe('object');
			expect(result.nestedFields).toBeDefined();
			expect(result.nestedFields).toHaveLength(3);
			const streetField = result.nestedFields!.find(f => f.name === 'street');
			expect(streetField?.type).toBe('string');
		});
	});

	describe('parseType - complex types', () => {
		it('should parse array types', () => {
			const result = TypeParser.parseType('tags', {
				kind: 'array',
				required: false,
				elementType: { kind: 'string', required: false },
			});
			
			expect(result.type).toBe('array');
			expect(result.arrayItemDefinition).toBeDefined();
			expect(result.arrayItemDefinition?.type).toBe('string');
		});

		it('should parse enum types with values', () => {
			const result = TypeParser.parseType('role', {
				kind: 'enum',
				required: true,
				enumValues: [
					{ value: 'admin', label: 'Administrator' },
					{ value: 'user', label: 'User' },
				],
			});
			
			expect(result.type).toBe('enum');
			expect(result.enumValues).toHaveLength(2);
			expect(result.enumValues![0].value).toBe('admin');
		});

		it('should parse date types', () => {
			const result = TypeParser.parseType('birthdate', { kind: 'date', required: true });
			
			expect(result.type).toBe('date');
			expect(result.controlType).toBe('date');
		});

		it('should handle template literal types', () => {
			const result = TypeParser.parseType('userId', {
				kind: 'template-literal',
				templatePattern: 'user-${number}',
				required: true,
			});
			
			expect(result.type).toBe('string'); // Template literals are represented as string type
			expect(result.metadata?.templatePattern).toBe('user-${number}');
		});

		it('should detect readonly fields', () => {
			const result = TypeParser.parseType('id', {
				kind: 'string',
				required: true,
				readonly: true,
			});
			
			expect(result.readonly).toBe(true);
		});
	});
});

