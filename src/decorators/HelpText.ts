/**
 * @HelpText decorator (T086)
 * Stores help text in registry for class properties
 * 
 * Usage:
 * class User {
 *   @HelpText('Enter your full legal name')
 *   name!: string;
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';

/**
 * @HelpText decorator factory
 * Sets help text displayed below a field
 */
export function HelpText(helpText: string): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@HelpText decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			helpText,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
