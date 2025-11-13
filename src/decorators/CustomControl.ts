/**
 * @CustomControl decorator (T088)
 * Stores custom component in registry for class properties
 * 
 * Usage:
 * class Article {
 *   @CustomControl(RichTextEditor)
 *   content!: string;
 * }
 */

import * as React from 'react';
import { registerDecoratorOverrides } from './registry';
import type { FieldOverride } from '../types/FormSchema';
import type { FieldProps } from '../types/FieldProps';

/**
 * @CustomControl decorator factory
 * Replaces the default field component with a custom one
 */
export function CustomControl(component: React.ComponentType<FieldProps>): PropertyDecorator {
	return function (target: Object, propertyKey: string | symbol) {
		if (typeof propertyKey === 'symbol') {
			throw new Error('@CustomControl decorator cannot be applied to symbol properties');
		}

		const typeName = target.constructor.name;
		const override: FieldOverride = {
			fieldPath: propertyKey,
			customComponent: component,
		};

		registerDecoratorOverrides(typeName, [override]);
	};
}
