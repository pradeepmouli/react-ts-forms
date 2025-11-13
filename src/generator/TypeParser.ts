/**
 * TypeParser - Build-time type introspection utility
 * Parses TypeScript types and converts them to FieldDefinition structures
 * 
 * T027-T030: Phase 3 implementation (primitives, objects)
 * T056-T060: Phase 4 implementation (arrays, enums, unions, dates)
 * T114, T119, T123: Phase 6 implementation (recursive, readonly, generics)
 */

import type { FieldDefinition, FieldType, ControlType } from '../types/FormSchema';

/**
 * Simplified type representation for parsing
 * In a real implementation, this would integrate with TypeScript Compiler API
 */
export interface TypeInfo {
	kind: string; // 'string' | 'number' | 'boolean' | 'date' | 'array' | 'enum' | 'union' | 'object' | 'recursive' | 'template-literal'
	name?: string;
	properties?: Record<string, TypeInfo>;
	elementType?: TypeInfo; // for arrays
	enumValues?: Array<{ value: unknown; label: string }>;
	unionVariants?: TypeInfo[];
	required?: boolean;
	readonly?: boolean;
	recursiveRef?: string; // T114: Reference to parent type for recursive types
	genericParams?: Record<string, TypeInfo>; // T123: Generic type parameters
	templatePattern?: string; // Phase 6: Template literal pattern (e.g., 'user-${number}', '${string}@${string}')
}

/**
 * Context for tracking visited types during parsing to detect recursion
 */
interface ParseContext {
	visitedTypes: Set<string>;
	depth: number;
}

export class TypeParser {
	/**
	 * T027: Parse a type and convert it to a FieldDefinition
	 * T114: Enhanced with recursive type detection
	 * Detects primitives, objects, arrays, enums, unions, dates, and recursive types
	 */
	static parseType(
		fieldName: string,
		typeInfo: TypeInfo,
		parentPath: string = '',
		context: ParseContext = { visitedTypes: new Set(), depth: 0 }
	): FieldDefinition {
		// T114: Check for recursive reference
		const typeName = typeInfo.name || fieldName;
		const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
		
		// Detect recursion
		if (typeInfo.kind === 'object' && typeInfo.name && context.visitedTypes.has(typeInfo.name)) {
			// Recursive reference detected
			return {
				name: fieldName,
				type: 'recursive',
				label: '',
				required: typeInfo.required ?? true,
				readonly: typeInfo.readonly ?? false,
				recursiveTypeRef: typeInfo.name,
			};
		}

		const fieldType = this.resolveFieldType(typeInfo);
		const controlType = this.resolveControlType(typeInfo);

		const baseDefinition: FieldDefinition = {
			name: fieldName,
			type: fieldType,
			label: '', // Will be set by SchemaBuilder
			required: typeInfo.required ?? true,
			readonly: typeInfo.readonly ?? false, // T119: Readonly support
			controlType,
		};

		// T114: Track this type to detect recursion in nested fields
		const newContext: ParseContext = {
			visitedTypes: new Set(context.visitedTypes),
			depth: context.depth + 1,
		};
		if (typeInfo.name) {
			newContext.visitedTypes.add(typeInfo.name);
		}

		// Handle nested object fields
		if (typeInfo.kind === 'object' && typeInfo.properties) {
			baseDefinition.nestedFields = Object.entries(typeInfo.properties).map(
				([propName, propType]) => 
					this.parseType(propName, propType, `${parentPath}${fieldName}.`, newContext)
			);
		}

		// T056: Handle array types (Phase 4)
		if (typeInfo.kind === 'array' && typeInfo.elementType) {
			baseDefinition.arrayItemDefinition = this.parseType(
				'item',
				typeInfo.elementType,
				`${parentPath}${fieldName}[]`,
				newContext
			);
		}

		// T057: Handle enum types (Phase 4)
		if (typeInfo.kind === 'enum' && typeInfo.enumValues) {
			baseDefinition.enumValues = typeInfo.enumValues;
		}

		// Phase 6: Handle template literal types
		if (typeInfo.kind === 'template-literal' && typeInfo.templatePattern) {
			// Store the template pattern for validation and field mask generation
			baseDefinition.metadata = {
				...baseDefinition.metadata,
				templatePattern: typeInfo.templatePattern,
			};
			
			// Generate pattern validation from template literal
			const patternValidator = this.generatePatternFromTemplate(typeInfo.templatePattern);
			if (patternValidator) {
				baseDefinition.validators = [
					...(baseDefinition.validators || []),
					{
						type: 'pattern',
						pattern: new RegExp(patternValidator.pattern),
						message: patternValidator.message,
					},
				];
			}
		}

		// T058: Handle union types (Phase 4)
		if (typeInfo.kind === 'union' && typeInfo.unionVariants) {
			baseDefinition.unionVariants = typeInfo.unionVariants.map((variant, idx) =>
				this.parseType(`variant${idx}`, variant, `${parentPath}${fieldName}.<union>`, newContext)
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
	 * Phase 6: Generate regex pattern from template literal type
	 * Converts TypeScript template literal patterns to regex for validation
	 */
	private static generatePatternFromTemplate(template: string): { pattern: string; message: string } | null {
		// Common template patterns and their regex equivalents
		const patterns: Record<string, string> = {
			'${string}': '.*',
			'${number}': '\\d+',
			'${bigint}': '\\d+',
			'${boolean}': '(true|false)',
		};

		let regex = template;
		let hasPattern = false;

		// Replace template placeholders with regex patterns
		for (const [placeholder, pattern] of Object.entries(patterns)) {
			if (regex.includes(placeholder)) {
				hasPattern = true;
				regex = regex.replace(new RegExp(this.escapeRegex(placeholder), 'g'), pattern);
			}
		}

		if (!hasPattern) {
			// No template placeholders, just a literal string
			return {
				pattern: `^${this.escapeRegex(template)}$`,
				message: `Value must be exactly "${template}"`,
			};
		}

		// Escape literal parts of the template
		// This is a simplified implementation - real one would need more sophisticated parsing
		return {
			pattern: `^${regex}$`,
			message: `Value must match pattern: ${template}`,
		};
	}

	/**
	 * Escape special regex characters
	 */
	private static escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * T123: Resolve generic type parameters to concrete types
	 * In a real implementation, this would use TypeScript Compiler API
	 */
	static resolveGenerics(
		typeInfo: TypeInfo,
		genericParams?: Record<string, TypeInfo>
	): TypeInfo {
		if (!genericParams || !typeInfo.genericParams) {
			return typeInfo;
		}

		// Replace generic type parameters with concrete types
		const resolved = { ...typeInfo };
		
		// This is a simplified implementation
		// Real implementation would recursively resolve generics in all nested types
		if (typeInfo.elementType && typeInfo.elementType.kind === 'generic') {
			const paramName = typeInfo.elementType.name;
			if (paramName && genericParams[paramName]) {
				resolved.elementType = genericParams[paramName];
			}
		}

		return resolved;
	}

	/**
	 * T028: Map TypeScript types to FieldType enum
	 * T114: Added 'recursive' type support
	 * Handles primitives (string, number, boolean) and complex types
	 */
	private static resolveFieldType(typeInfo: TypeInfo): FieldType {
		switch (typeInfo.kind) {
			case 'string':
				return 'string';
			case 'template-literal':
				// Template literals are treated as strings with pattern validation
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
			case 'template-literal':
				// Template literals use text input with pattern validation
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
