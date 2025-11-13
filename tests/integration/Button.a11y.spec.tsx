import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Button } from '../../src/components/Button';
import { testA11y } from '../../vitest.setup';

describe('Button a11y', () => {
	it('has no accessibility violations', async () => {
		const { container } = render(<Button>Submit</Button>);
		await testA11y(container);
	});
});
