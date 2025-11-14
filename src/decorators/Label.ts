/**
 * @Label decorator (T084)
 * Stores custom label in registry for class properties
 * 
 * Usage:
 * class User {
 *   @Label('Full Name')
 *   name!: string;
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';

/**
 * @Label decorator factory
 * Sets a custom label for a field
 */
export function Label(label: string): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@Label decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			label,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
