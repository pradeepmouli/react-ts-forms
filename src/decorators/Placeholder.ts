/**
 * @Placeholder decorator (T085)
 * Stores placeholder text in registry for class properties
 * 
 * Usage:
 * class User {
 *   @Placeholder('Enter your name')
 *   name!: string;
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';

/**
 * @Placeholder decorator factory
 * Sets placeholder text for a field
 */
export function Placeholder(placeholder: string): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@Placeholder decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			placeholder,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
