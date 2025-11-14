/* Vite plugin configuration types */

export interface TypeFormPluginOptions {
	/**
	 * File patterns to include for type analysis
	 * @default ['**\/*.tsx', '**\/*.ts']
	 */
	include?: string | string[];

	/**
	 * File patterns to exclude from type analysis
	 * @default ['**\/node_modules/**', '**\/*.test.ts', '**\/*.test.tsx', '**\/*.spec.ts', '**\/*.spec.tsx']
	 */
	exclude?: string | string[];

	/**
	 * Enable debug logging with performance metrics
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Cache parsed schemas (recommended for performance)
	 * @default true
	 */
	cache?: boolean;

	/**
	 * Custom TypeScript compiler options
	 */
	compilerOptions?: Record<string, unknown>;
}

export interface CachedSchema {
	/** FormSchema JSON */
	schema: string;
	/** Source file modification time */
	mtime: number;
	/** Dependencies (imported files) */
	dependencies: string[];
}
