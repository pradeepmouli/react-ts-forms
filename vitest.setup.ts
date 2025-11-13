import '@testing-library/jest-dom';
import { expect } from 'vitest';

// a11y helper (lazy import axe for performance)
export async function testA11y(container: HTMLElement) {
	const axe = (await import('axe-core')).default ?? (await import('axe-core'));
	const results: any = await new Promise((resolve, reject) => {
		(axe as any).run(
			container,
			{},
			(err: Error | null, r: any) => (err ? reject(err) : resolve(r))
		);
	});
	const violations = (results.violations ?? []) as any[];
	if (violations.length) {
		const message = violations
			.map((v: any) => `${v.id}: ${v.help} (nodes: ${(v.nodes ?? []).map((n: any) => n.target).join(', ')})`)
			.join('\n');
		throw new Error(`Accessibility violations:\n${message}`);
	}
	expect(violations.length).toBe(0);
}
