/**
 * SchemaBuilder - Constructs FormSchema from parsed type definitions
 * Applies default labels, merges external configs, and decorator metadata
 * 
 * T029-T030: Phase 3 implementation (basic schema building)
 * T029a-T029b: External FormConfig integration
 */

import type { FormSchema, FieldDefinition } from '../types/FormSchema';
import type { FormConfig } from '../decorators/formConfig';
import { getFormConfig } from '../decorators/registry';

export class SchemaBuilder {
	/**
	 * T029: Build FormSchema from parsed field definitions
	 * Applies default labels and merges configurations in precedence order
	 */
	static buildSchema<T = unknown>(
		typeId: string,
		fields: FieldDefinition[],
		options?: {
			title?: string;
			description?: string;
			formConfig?: FormConfig<T>;
		}
	): FormSchema {
		// Apply default labels to all fields recursively
		const fieldsWithLabels = fields.map(field => this.applyDefaultLabels(field));

		// T029a: Merge external FormConfig if provided or registered
		const config = options?.formConfig || getFormConfig(typeId);
		const fieldsWithConfig = config
			? this.mergeFormConfig(fieldsWithLabels, config)
			: fieldsWithLabels;

		return {
			id: typeId,
			title: options?.title || this.generateDefaultLabel(typeId),
			description: options?.description,
			fields: fieldsWithConfig,
		};
	}

	/**
	 * T030: Generate default label from field name
	 * Converts camelCase to "Title Case"
	 */
	static generateDefaultLabel(fieldName: string): string {
		if (!fieldName) return '';

		// Handle single word
		if (!/[A-Z]/.test(fieldName)) {
			return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
		}

		// Split camelCase and convert to Title Case
		// Handle acronyms: "userId" -> "User ID", "HTMLElement" -> "HTML Element"
		return fieldName
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Split acronyms: "HTMLElement" -> "HTML Element"
			.replace(/([a-z\d])([A-Z])/g, '$1 $2') // Split camelCase: "userId" -> "user Id"
			.replace(/^./, str => str.toUpperCase()) // Capitalize first letter
			.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
	}

	/**
	 * Apply default labels to field and all nested fields recursively
	 */
	private static applyDefaultLabels(field: FieldDefinition): FieldDefinition {
		const fieldWithLabel: FieldDefinition = {
			...field,
			label: field.label || this.generateDefaultLabel(field.name),
		};

		// Recursively apply to nested fields
		if (fieldWithLabel.nestedFields) {
			fieldWithLabel.nestedFields = fieldWithLabel.nestedFields.map(nested =>
				this.applyDefaultLabels(nested)
			);
		}

		// Apply to array item definition
		if (fieldWithLabel.arrayItemDefinition) {
			fieldWithLabel.arrayItemDefinition = this.applyDefaultLabels(
				fieldWithLabel.arrayItemDefinition
			);
		}

		// Apply to union variants
		if (fieldWithLabel.unionVariants) {
			fieldWithLabel.unionVariants = fieldWithLabel.unionVariants.map(variant =>
				this.applyDefaultLabels(variant)
			);
		}

		return fieldWithLabel;
	}

	/**
	 * T029a: Merge external FormConfig into field definitions
	 * Precedence: defaults → FormConfig → decorators
	 */
	private static mergeFormConfig<T>(
		fields: FieldDefinition[],
		config: FormConfig<T>
	): FieldDefinition[] {
		return fields.map(field => {
			const fieldConfig = config[field.name as keyof T];
			if (!fieldConfig) return field;

			return {
				...field,
				label: fieldConfig.label || field.label,
				placeholder: fieldConfig.placeholder || field.placeholder,
				helpText: fieldConfig.helpText || field.helpText,
				validators: fieldConfig.validators
					? [...(field.validators || []), ...fieldConfig.validators]
					: field.validators,
				controlType: fieldConfig.controlType || field.controlType,
				className: fieldConfig.className || field.className,
				style: fieldConfig.style || field.style,
			};
		});
	}
}
