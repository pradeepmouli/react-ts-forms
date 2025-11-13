/* Configuration validator for Vite plugin */

import type { TypeFormPluginOptions } from './types';

const DEFAULT_INCLUDE = ['**/*.tsx', '**/*.ts'];
const DEFAULT_EXCLUDE = [
	'**/node_modules/**',
	'**/*.test.ts',
	'**/*.test.tsx',
	'**/*.spec.ts',
	'**/*.spec.tsx',
	'**/*.stories.tsx',
	'**/*.stories.ts',
];

/**
 * Validates and normalizes plugin configuration
 * @param options User-provided plugin options
 * @returns Normalized configuration with defaults applied
 */
export function normalizeConfig(options: TypeFormPluginOptions = {}): Required<TypeFormPluginOptions> {
	return {
		include: options.include ?? DEFAULT_INCLUDE,
		exclude: options.exclude ?? DEFAULT_EXCLUDE,
		debug: options.debug ?? false,
		cache: options.cache ?? true,
		compilerOptions: options.compilerOptions ?? {},
	};
}

/**
 * Validates plugin configuration
 * @param options Plugin options to validate
 * @throws Error if configuration is invalid
 */
export function validateConfig(options: TypeFormPluginOptions): void {
	if (options.include !== undefined) {
		if (typeof options.include !== 'string' && !Array.isArray(options.include)) {
			throw new Error('typeFormPlugin: options.include must be a string or string array');
		}
	}

	if (options.exclude !== undefined) {
		if (typeof options.exclude !== 'string' && !Array.isArray(options.exclude)) {
			throw new Error('typeFormPlugin: options.exclude must be a string or string array');
		}
	}

	if (options.debug !== undefined && typeof options.debug !== 'boolean') {
		throw new Error('typeFormPlugin: options.debug must be a boolean');
	}

	if (options.cache !== undefined && typeof options.cache !== 'boolean') {
		throw new Error('typeFormPlugin: options.cache must be a boolean');
	}
}
