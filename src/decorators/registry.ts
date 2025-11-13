/*
 * Central registry for decorator + FormConfig metadata.
 * Build-time only population; read during schema construction.
 */
import type { FieldOverride } from '../types/FormSchema';
import type { FormConfig } from './formConfig';

// Decorator overrides keyed by target type name.
const decoratorRegistry: Map<string, FieldOverride[]> = new Map();
// External FormConfig objects keyed by target type name.
const formConfigRegistry: Map<string, FormConfig<unknown>> = new Map();

/** Register overrides produced by decorators for a given type. */
export function registerDecoratorOverrides(typeName: string, overrides: FieldOverride[]): void {
	const existing = decoratorRegistry.get(typeName) || [];
	decoratorRegistry.set(typeName, existing.concat(overrides));
}

/** Fetch decorator overrides for a given type. */
export function getDecoratorOverrides(typeName: string): FieldOverride[] {
	return decoratorRegistry.get(typeName) || [];
}

/** Register an external FormConfig for a type (interfaces / type aliases). */
export function registerFormConfig<T>(typeName: string, config: FormConfig<T>): void {
	formConfigRegistry.set(typeName, config as FormConfig<unknown>);
}

/** Fetch external FormConfig for a type name (if any). */
export function getFormConfig<T = unknown>(typeName: string): FormConfig<T> | undefined {
	return formConfigRegistry.get(typeName) as FormConfig<T> | undefined;
}

/** Debug introspection (not for production runtime). */
export function _debugDumpRegistry() {
	return {
		decorators: [...decoratorRegistry.entries()],
		formConfigs: [...formConfigRegistry.entries()]
	};
}
