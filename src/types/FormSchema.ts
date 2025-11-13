/*
 * Core form schema types derived from build-time type introspection.
 * Generated according to data-model.md definitions.
 */

import type * as React from 'react';
import type { FieldProps } from './FieldProps';
import type { ValidationRule } from './ValidationRule';

export type FieldType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'date'
	| 'enum'
	| 'array'
	| 'object'
	| 'union'
	| 'recursive';

export type ControlType =
	| 'text'
	| 'number'
	| 'checkbox'
	| 'select'
	| 'radio'
	| 'date'
	| 'textarea'
	| 'custom';

/** Field definition describing a single unit of form rendering configuration. */
export interface FieldDefinition {
	/** Field name (matches TypeScript property name) */
	name: string;
	/** Field type (primitive, array, object, enum, union, recursive) */
	type: FieldType;
	/** Display label (defaults to formatted name) */
	label: string;
	/** Whether the field is required */
	required: boolean;
	/** Whether the field is readonly */
	readonly: boolean;
	/** Default value for the field */
	defaultValue?: unknown;
	/** Placeholder text for input controls */
	placeholder?: string;
	/** Help text displayed below the field */
	helpText?: string;
	/** Validation rules for this field */
	validators?: ValidationRule[];
	/** UI control type (text, number, select, etc.) */
	controlType?: ControlType;
	/** Custom component override */
	customComponent?: React.ComponentType<FieldProps>;
	/** Nested fields (object) */
	nestedFields?: FieldDefinition[];
	/** Array item definition (array) */
	arrayItemDefinition?: FieldDefinition;
	/** Enum values with labels */
	enumValues?: Array<{ value: unknown; label: string }>;
	/** Union variant definitions */
	unionVariants?: FieldDefinition[];
	/** Recursive type parent reference */
	recursiveTypeRef?: string;
	/** Custom CSS classes */
	className?: string;
	/** Custom inline styles */
	style?: React.CSSProperties;
	/** Arbitrary metadata (decorators / config) */
	metadata?: Record<string, unknown>;
}

/** Top-level immutable schema describing the entire form. */
export interface FormSchema {
	/** Unique identifier (typically the source type name) */
	id: string;
	/** Human readable title */
	title: string;
	/** Optional description */
	description?: string;
	/** Root fields in the form */
	fields: FieldDefinition[];
	/** Global validators applying to entire form */
	globalValidators?: ValidationRule[];
	/** Metadata from type-level decorators */
	metadata?: Record<string, unknown>;
}

/** Field override produced by decorators or external config (FormConfig<T>). */
export interface FieldOverride {
	fieldPath: string; // dot notation path
	label?: string;
	placeholder?: string;
	helpText?: string;
	validators?: ValidationRule[];
	controlType?: ControlType;
	customComponent?: React.ComponentType<FieldProps>;
	className?: string;
	style?: React.CSSProperties;
	unionControlType?: 'radio' | 'select';
	metadata?: Record<string, unknown>;
}

/** Precedence ordering for merging: defaults -> FormConfig -> decorators -> runtime overrides. */
export const FIELD_OVERRIDE_PRECEDENCE = [
	'defaults',
	'formConfig',
	'decorators',
	'runtime'
] as const;

export type FieldOverrideSource = typeof FIELD_OVERRIDE_PRECEDENCE[number];

/** Result of merging individual override sources for a single field. */
export interface MergedFieldOverrides {
	label?: string;
	placeholder?: string;
	helpText?: string;
	validators?: ValidationRule[];
	controlType?: ControlType;
	customComponent?: React.ComponentType<FieldProps>;
	className?: string;
	style?: React.CSSProperties;
	unionControlType?: 'radio' | 'select';
	metadata?: Record<string, unknown>;
	/** Tracking which sources contributed final values for debugging */
	_sources?: Partial<Record<keyof FieldOverride, FieldOverrideSource>> & {
		label?: FieldOverrideSource;
	};
}

/** Helper for deep path joining (used by config & decorators). */
export function joinFieldPath(parent: string, child: string): string {
	return parent ? `${parent}.${child}` : child;
}

/** Narrow utility to detect whether a field definition represents a container (object/array/union/recursive). */
export function isContainerField(def: FieldDefinition): boolean {
	return (
		def.type === 'object' ||
		def.type === 'array' ||
		def.type === 'union' ||
		def.type === 'recursive'
	);
}

/** Convenience guard for enum field definitions. */
export function isEnumField(def: FieldDefinition): boolean {
	return def.type === 'enum';
}

/** Convenience guard for union field definitions. */
export function isUnionField(def: FieldDefinition): boolean {
	return def.type === 'union';
}

/** Extract all field paths (dot notation) for a given schema. Useful for validation & override resolution. */
export function collectFieldPaths(schema: FormSchema): string[] {
	const paths: string[] = [];
	const walk = (fields: FieldDefinition[], parent: string) => {
		for (const f of fields) {
			const path = joinFieldPath(parent, f.name);
			paths.push(path);
			if (f.nestedFields) walk(f.nestedFields, path);
			if (f.arrayItemDefinition) walk([f.arrayItemDefinition], path + '[]');
			if (f.unionVariants) walk(f.unionVariants, path + '<union>');
		}
	};
	walk(schema.fields, '');
	return paths;
}

/** FormState generic re-export for convenience (align with public API). */
