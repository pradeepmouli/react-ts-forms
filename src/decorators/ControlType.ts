/**
 * @ControlType decorator (T089)
 * Stores control type override in registry for class properties
 * 
 * Usage:
 * class User {
 *   @ControlType('textarea')
 *   bio!: string;  // Will render as textarea instead of text input
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride, ControlType } from '../types/FormSchema';

/**
 * @ControlType decorator factory
 * Overrides the default control type for a field
 */
export function ControlType(controlType: ControlType): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@ControlType decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			controlType,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
