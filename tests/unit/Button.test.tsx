import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../../src/components/Button';

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Press</Button>);
		expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument();
	});

	it('disables when loading', () => {
		render(<Button loading>Load</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});
});
