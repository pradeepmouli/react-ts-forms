/**
 * DecoratorProcessor (T091-T092)
 * Extracts decorator metadata from registry and applies to FieldDefinitions
 */

import type { FieldDefinition, FieldOverride, MergedFieldOverrides } from '../types/FormSchema';
import { getDecoratorOverrides } from '../decorators/registry';

export class DecoratorProcessor {
	/**
	 * T091: Extract decorator metadata from registry for a given type
	 */
	static extractMetadata(typeName: string): FieldOverride[] {
		return getDecoratorOverrides(typeName);
	}

	/**
	 * T092: Apply field overrides from decorators to FieldDefinition
	 * Merges decorator metadata with precedence: defaults → FormConfig → decorators
	 */
	static applyFieldOverrides(
		field: FieldDefinition,
		overrides: FieldOverride[],
		parentPath: string = ''
	): FieldDefinition {
		const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
		
		// Find all overrides that match this field path
		const matchingOverrides = overrides.filter(o => o.fieldPath === fieldPath);

		if (matchingOverrides.length === 0) {
			// No overrides for this field, but recursively process nested fields
			return {
				...field,
				nestedFields: field.nestedFields?.map(nested =>
					this.applyFieldOverrides(nested, overrides, fieldPath)
				),
				arrayItemDefinition: field.arrayItemDefinition
					? this.applyFieldOverrides(field.arrayItemDefinition, overrides, `${fieldPath}[]`)
					: undefined,
				unionVariants: field.unionVariants?.map(variant =>
					this.applyFieldOverrides(variant, overrides, `${fieldPath}.<union>`)
				),
			};
		}

		// Merge all matching overrides
		const merged: MergedFieldOverrides = {};
		for (const override of matchingOverrides) {
			if (override.label !== undefined) merged.label = override.label;
			if (override.placeholder !== undefined) merged.placeholder = override.placeholder;
			if (override.helpText !== undefined) merged.helpText = override.helpText;
			if (override.controlType !== undefined) merged.controlType = override.controlType;
			if (override.customComponent !== undefined) merged.customComponent = override.customComponent;
			if (override.className !== undefined) merged.className = override.className;
			if (override.style !== undefined) merged.style = { ...merged.style, ...override.style };
			if (override.unionControlType !== undefined) merged.unionControlType = override.unionControlType;
			if (override.metadata !== undefined) merged.metadata = { ...merged.metadata, ...override.metadata };
			
			// Merge validators (accumulate instead of replace)
			if (override.validators) {
				merged.validators = [...(merged.validators || []), ...override.validators];
			}
		}

		// Apply merged overrides to field
		const updatedField: FieldDefinition = {
			...field,
			label: merged.label !== undefined ? merged.label : field.label,
			placeholder: merged.placeholder !== undefined ? merged.placeholder : field.placeholder,
			helpText: merged.helpText !== undefined ? merged.helpText : field.helpText,
			controlType: merged.controlType !== undefined ? merged.controlType : field.controlType,
			customComponent: merged.customComponent !== undefined ? merged.customComponent : field.customComponent,
			className: merged.className !== undefined ? merged.className : field.className,
			style: merged.style !== undefined ? { ...field.style, ...merged.style } : field.style,
			metadata: merged.metadata !== undefined ? { ...field.metadata, ...merged.metadata } : field.metadata,
			validators: merged.validators ? [...(field.validators || []), ...merged.validators] : field.validators,
		};

		// Recursively process nested fields
		return {
			...updatedField,
			nestedFields: updatedField.nestedFields?.map(nested =>
				this.applyFieldOverrides(nested, overrides, fieldPath)
			),
			arrayItemDefinition: updatedField.arrayItemDefinition
				? this.applyFieldOverrides(updatedField.arrayItemDefinition, overrides, `${fieldPath}[]`)
				: undefined,
			unionVariants: updatedField.unionVariants?.map(variant =>
				this.applyFieldOverrides(variant, overrides, `${fieldPath}.<union>`)
			),
		};
	}
}
