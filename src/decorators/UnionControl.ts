/**
 * @UnionControl decorator (T090)
 * Stores union selector type in registry for class properties
 * 
 * Usage:
 * class Task {
 *   @UnionControl('radio')  // Force radio buttons even if >4 variants
 *   priority!: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
 * }
 */

import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';

/**
 * @UnionControl decorator factory
 * Overrides the union selector control type (radio vs select)
 */
export function UnionControl(unionControlType: 'radio' | 'select'): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@UnionControl decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			unionControlType,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
