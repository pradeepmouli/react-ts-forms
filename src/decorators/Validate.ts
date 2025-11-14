/**
 * @Validate decorator (T087)
 * Stores validation rules in registry for class properties
 * 
 * Usage:
 * class User {
 *   @Validate({ type: 'email', message: 'Invalid email' })
 *   email!: string;
 * 
 *   @Validate({ type: 'min', value: 18, message: 'Must be 18+' })
 *   age!: number;
 * 
 *   @Validate({ type: 'custom', validator: (val) => val.length > 5, message: 'Too short' })
 *   password!: string;
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';
import type { ValidationRule } from '../types/ValidationRule';

/**
 * @Validate decorator factory
 * Adds validation rules to a field
 * Can be applied multiple times to add multiple validators
 */
export function Validate(rule: ValidationRule): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@Validate decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			validators: [rule],
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
