/**
 * TypeParser - Build-time type introspection utility
 * Parses TypeScript types and converts them to FieldDefinition structures
 * 
 * T027-T030: Phase 3 implementation (primitives, objects)
 * T056-T060: Phase 4 implementation (arrays, enums, unions, dates)
 */

import type { FieldDefinition, FieldType, ControlType } from '../types/FormSchema';

/**
 * Simplified type representation for parsing
 * In a real implementation, this would integrate with TypeScript Compiler API
 */
export interface TypeInfo {
	kind: string; // 'string' | 'number' | 'boolean' | 'date' | 'array' | 'enum' | 'union' | 'object'
	name?: string;
	properties?: Record<string, TypeInfo>;
	elementType?: TypeInfo; // for arrays
	enumValues?: Array<{ value: unknown; label: string }>;
	unionVariants?: TypeInfo[];
	required?: boolean;
	readonly?: boolean;
}

export class TypeParser {
	/**
	 * T027: Parse a type and convert it to a FieldDefinition
	 * Detects primitives, objects, arrays, enums, unions, and dates
	 */
	static parseType(
		fieldName: string,
		typeInfo: TypeInfo,
		parentPath: string = ''
	): FieldDefinition {
		const fieldType = this.resolveFieldType(typeInfo);
		const controlType = this.resolveControlType(typeInfo);

		const baseDefinition: FieldDefinition = {
			name: fieldName,
			type: fieldType,
			label: '', // Will be set by SchemaBuilder
			required: typeInfo.required ?? true,
			readonly: typeInfo.readonly ?? false,
			controlType,
		};

		// Handle nested object fields
		if (typeInfo.kind === 'object' && typeInfo.properties) {
			baseDefinition.nestedFields = Object.entries(typeInfo.properties).map(
				([propName, propType]) => 
					this.parseType(propName, propType, `${parentPath}${fieldName}.`)
			);
		}

		// T056: Handle array types (Phase 4)
		if (typeInfo.kind === 'array' && typeInfo.elementType) {
			baseDefinition.arrayItemDefinition = this.parseType(
				'item',
				typeInfo.elementType,
				`${parentPath}${fieldName}[]`
			);
		}

		// T057: Handle enum types (Phase 4)
		if (typeInfo.kind === 'enum' && typeInfo.enumValues) {
			baseDefinition.enumValues = typeInfo.enumValues;
		}

		// T058: Handle union types (Phase 4)
		if (typeInfo.kind === 'union' && typeInfo.unionVariants) {
			baseDefinition.unionVariants = typeInfo.unionVariants.map((variant, idx) =>
				this.parseType(`variant${idx}`, variant, `${parentPath}${fieldName}.<union>`)
			);
			// T060: Determine union selector type (radio for ≤4 variants, select for >4)
			if (typeInfo.unionVariants.length <= 4) {
				baseDefinition.controlType = 'radio';
			} else {
				baseDefinition.controlType = 'select';
			}
		}

		return baseDefinition;
	}

	/**
	 * T028: Map TypeScript types to FieldType enum
	 * Handles primitives (string, number, boolean) and complex types
	 */
	private static resolveFieldType(typeInfo: TypeInfo): FieldType {
		switch (typeInfo.kind) {
			case 'string':
				return 'string';
			case 'number':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'date':
				return 'date';
			case 'array':
				return 'array';
			case 'enum':
				return 'enum';
			case 'union':
				return 'union';
			case 'object':
				return 'object';
			default:
				return 'string'; // fallback
		}
	}

	/**
	 * T028: Resolve primitive types to appropriate ControlType
	 * Maps string→text, number→number, boolean→checkbox, etc.
	 */
	private static resolveControlType(typeInfo: TypeInfo): ControlType {
		switch (typeInfo.kind) {
			case 'string':
				return 'text';
			case 'number':
				return 'number';
			case 'boolean':
				return 'checkbox';
			case 'date':
				return 'date';
			case 'enum':
				return 'select';
			case 'union':
				// T060: Will be overridden based on variant count
				return 'select';
			default:
				return 'text';
		}
	}

	/**
	 * T060: Determine union selector control type
	 * Radio for ≤4 variants, select for >4 per research.md
	 */
	static resolveUnionSelectorType(variantCount: number): 'radio' | 'select' {
		return variantCount <= 4 ? 'radio' : 'select';
	}
}
