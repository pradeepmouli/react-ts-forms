import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { ButtonProps } from './types';

/**
 * Accessible Button component with sensible defaults.
 * - Keyboard accessible and focus-visible styles should be provided by consumer CSS.
 * - Supports loading and disabled states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant = 'primary',
		size = 'md',
		loading = false,
		children,
		...rest
	}: ButtonProps,
	ref
) {
	const ariaProps: ButtonHTMLAttributes<HTMLButtonElement> = {
		'aria-busy': loading || undefined
	};
	return (
		<button
			ref={ref}
			data-variant={variant}
			data-size={size}
			disabled={rest.disabled || loading}
			{...ariaProps}
			{...rest}
		>
			{children}
		</button>
	);
});
