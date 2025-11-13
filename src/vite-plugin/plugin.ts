/* Vite plugin implementation for automatic type introspection */

import type { Plugin } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import { stat } from 'fs/promises';
import type { TypeFormPluginOptions, CachedSchema } from './types';
import { validateConfig, normalizeConfig } from './config';

/**
 * Creates a Vite plugin for automatic form schema generation from TypeScript types
 * 
 * @param options Plugin configuration options
 * @returns Vite plugin instance
 * 
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { typeFormPlugin } from '@mouli.dev/react-ts-forms/vite';
 * 
 * export default defineConfig({
 *   plugins: [
 *     typeFormPlugin({
 *       debug: true,
 *       cache: true,
 *     }),
 *   ],
 * });
 * ```
 */
export function typeFormPlugin(options: TypeFormPluginOptions = {}): Plugin {
	// Validate and normalize configuration
	validateConfig(options);
	const config = normalizeConfig(options);

	// Create file filter
	const filter = createFilter(config.include, config.exclude);

	// Schema cache
	const schemaCache = new Map<string, CachedSchema>();

	// Performance metrics
	let totalTransforms = 0;
	let cacheHits = 0;
	let cacheMisses = 0;

	return {
		name: 'react-ts-forms:transform',
		enforce: 'pre',

		/**
		 * Check if file should be transformed
		 */
		async resolveId(id: string) {
			// Only process files that match the filter
			if (!filter(id)) {
				return null;
			}
			return null; // Let Vite handle resolution
		},

		/**
		 * Transform TypeScript files to inject form schemas
		 */
		async transform(code: string, id: string) {
			// Skip files that don't match the filter
			if (!filter(id)) {
				return null;
			}

			// Skip if code doesn't contain FormGenerator or useFormSchema
			if (!code.includes('FormGenerator') && !code.includes('useFormSchema') && !code.includes('@mouli.dev/react-ts-forms')) {
				return null;
			}

			totalTransforms++;

			try {
				// Check cache if enabled
				if (config.cache && schemaCache.has(id)) {
					const cached = schemaCache.get(id)!;
					const stats = await stat(id);
					
					// Use cached version if file hasn't changed
					if (stats.mtimeMs === cached.mtime) {
						cacheHits++;
						if (config.debug) {
							console.log(`[react-ts-forms] Cache hit: ${id}`);
						}
						return null; // No transformation needed if using runtime generation
					}
				}

				cacheMisses++;

				if (config.debug) {
					const startTime = performance.now();
					console.log(`[react-ts-forms] Processing: ${id}`);
					
					// Note: In a full implementation, we would use TypeScript Compiler API here
					// to analyze the code and generate schemas. For now, we rely on runtime generation.
					
					const endTime = performance.now();
					console.log(`[react-ts-forms] Processed in ${(endTime - startTime).toFixed(2)}ms`);
				}

				// Update cache
				if (config.cache) {
					const stats = await stat(id);
					schemaCache.set(id, {
						schema: '', // Placeholder - would contain generated schema in full implementation
						mtime: stats.mtimeMs,
						dependencies: [],
					});
				}

				// Return null to use runtime schema generation
				// In a full implementation, this would inject build-time generated schemas
				return null;

			} catch (error) {
				if (config.debug) {
					console.error(`[react-ts-forms] Error processing ${id}:`, error);
				}
				// Don't fail the build, fall back to runtime generation
				return null;
			}
		},

		/**
		 * Output performance metrics in debug mode
		 */
		buildEnd() {
			if (config.debug) {
				console.log('\n[react-ts-forms] Performance Metrics:');
				console.log(`  Total transforms: ${totalTransforms}`);
				console.log(`  Cache hits: ${cacheHits}`);
				console.log(`  Cache misses: ${cacheMisses}`);
				if (totalTransforms > 0) {
					const hitRate = ((cacheHits / totalTransforms) * 100).toFixed(1);
					console.log(`  Cache hit rate: ${hitRate}%`);
				}
			}
		},
	};
}
