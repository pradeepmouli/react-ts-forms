/*
 * External configuration object pattern for non-class types (FR-021).
 * Allows specifying field-level overrides without decorators.
 */
import type { FieldOverride } from '../types/FormSchema';

/** Shape of field-level overrides keyed by property name of T. */
export type FormConfig<T> = {
	[K in keyof T]?: Omit<FieldOverride, 'fieldPath'>;
};

/** Helper to define a FormConfig with strong key inference. */
export function defineFormConfig<T>(config: FormConfig<T>): FormConfig<T> {
	return config;
}

/** Internal normalized override entry with resolved path. */
export interface NormalizedConfigOverride extends FieldOverride {
	_source: 'formConfig';
}

/** Normalize a FormConfig<T> into FieldOverride entries with dot paths (root only here). */
export function normalizeFormConfig<T>(config: FormConfig<T>, rootPath = ''): NormalizedConfigOverride[] {
	const entries: NormalizedConfigOverride[] = [];
	for (const key of Object.keys(config) as Array<keyof T & string>) {
		const base = config[key];
		if (!base) continue;
		entries.push({
			fieldPath: rootPath ? `${rootPath}.${key}` : key,
			...base,
			_source: 'formConfig'
		});
	}
	return entries;
}
