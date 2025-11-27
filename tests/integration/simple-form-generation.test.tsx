import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fileURLToPath } from 'node:url';
import { FormGenerator } from '../../src/components/FormGenerator';
import { buildSchemaFromType } from './utils/typeExtractor';

const simpleProfilePath = fileURLToPath(new URL('./fixtures/SimpleProfile.ts', import.meta.url));

function buildSimpleProfileSchema() {
	return buildSchemaFromType({
		typeId: 'SimpleProfile',
		typeName: 'SimpleProfile',
		sourcePath: simpleProfilePath,
		schemaOptions: {
			title: 'Simple Profile',
			description: 'Auto-generated from SimpleProfile TypeScript interface',
		},
	});
}

function renderSimpleForm() {
	const schema = buildSimpleProfileSchema();
	return render(<FormGenerator schema={schema} onSubmit={vi.fn()} />);
}

describe('Simple Form Generation', () => {
	it('should generate form from TypeScript interface with primitive fields', () => {
		renderSimpleForm();
		expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
		expect(screen.getByRole('spinbutton', { name: /age/i })).toBeInTheDocument();
		expect(screen.getByRole('checkbox', { name: /is active/i })).toBeInTheDocument();
	});

	it('should render text input for string field', () => {
		renderSimpleForm();
		const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
		expect(firstNameInput).toHaveAttribute('type', 'text');
	});

	it('should render number input for number field', () => {
		renderSimpleForm();
		const ageInput = screen.getByRole('spinbutton', { name: /age/i });
		expect(ageInput).toHaveAttribute('type', 'number');
	});

	it('should render checkbox for boolean field', () => {
		renderSimpleForm();
		const checkbox = screen.getByRole('checkbox', { name: /is active/i });
		expect(checkbox).toHaveAttribute('type', 'checkbox');
	});

	it('should render fieldset for nested object', () => {
		renderSimpleForm();
		const addressGroup = screen.getByRole('group', { name: /address/i });
		expect(addressGroup.tagName.toLowerCase()).toBe('fieldset');
	});

	it('should display required field indicators', () => {
		renderSimpleForm();
		expect(screen.getAllByLabelText('required').length).toBeGreaterThan(0);
	});

	it('should generate default labels from field names', () => {
		renderSimpleForm();
		expect(screen.getByText('Zip Code')).toBeInTheDocument();
		expect(screen.getByText('Marketing Emails')).toBeInTheDocument();
	});

	it('should handle optional vs required fields correctly', () => {
		renderSimpleForm();
		const ageInput = screen.getByRole('spinbutton', { name: /age/i });
		expect(ageInput).not.toHaveAttribute('aria-required');
		const nameInput = screen.getByRole('textbox', { name: /first name/i });
		expect(nameInput).toHaveAttribute('aria-required', 'true');
	});
});
