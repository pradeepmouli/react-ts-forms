import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fileURLToPath } from 'node:url';
import { FormGenerator } from '../../src/components/FormGenerator';
import { buildSchemaFromType } from './utils/typeExtractor';
import type { SimpleProfile } from './fixtures/SimpleProfile';

const simpleProfilePath = fileURLToPath(new URL('./fixtures/SimpleProfile.ts', import.meta.url));

function buildSimpleProfileSchema() {
	return buildSchemaFromType({
		typeId: 'SimpleProfile',
		typeName: 'SimpleProfile',
		sourcePath: simpleProfilePath,
		schemaOptions: {
			title: 'Simple Profile',
			description: 'Auto-generated from SimpleProfile TypeScript declarations',
		},
	});
}

const baseInitialValues: SimpleProfile = {
	id: 1001,
	firstName: '',
	email: '',
	age: undefined,
	isActive: false,
	address: {
		street: '',
		city: '',
		zipCode: 0,
	},
	preferences: {
		marketingEmails: false,
		smsAlerts: undefined,
	},
};

function getInitialValues(): SimpleProfile {
	return {
		...baseInitialValues,
		address: { ...baseInitialValues.address },
		preferences: { ...baseInitialValues.preferences },
	};
}

function renderForm(options?: {
	onSubmit?: ReturnType<typeof vi.fn>;
	onChange?: (values: SimpleProfile, isValid: boolean) => void;
	initialValues?: SimpleProfile;
}) {
	const schema = buildSimpleProfileSchema();
	const onSubmit = options?.onSubmit ?? vi.fn();
	const initialValues = options?.initialValues ?? getInitialValues();
	const utils = render(
		<FormGenerator<SimpleProfile>
			schema={schema}
			initialValues={initialValues}
			onSubmit={onSubmit}
			onChange={options?.onChange}
		/>
	);
	return { ...utils, onSubmit, schema };
}

type User = ReturnType<typeof userEvent.setup>;

async function fillValidProfile(user: User) {
	const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const ageInput = screen.getByRole('spinbutton', { name: /age/i });
	const streetInput = screen.getByRole('textbox', { name: /street/i });
	const cityInput = screen.getByRole('textbox', { name: /city/i });
	const zipInput = screen.getByRole('spinbutton', { name: /zip code/i });

	await user.clear(firstNameInput);
	await user.type(firstNameInput, 'Ada');
	await user.clear(emailInput);
	await user.type(emailInput, 'ada@example.com');
	await user.type(ageInput, '32');
	await user.clear(streetInput);
	await user.type(streetInput, '123 Main St');
	await user.clear(cityInput);
	await user.type(cityInput, 'Springfield');
	await user.clear(zipInput);
	await user.type(zipInput, '94107');
	await user.click(screen.getByRole('checkbox', { name: /marketing emails/i }));
}

describe('Form Submission', () => {
	it('should call onSubmit with typed data when form is valid', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderForm({ onSubmit });

		await fillValidProfile(user);
		await user.click(screen.getByRole('button', { name: /submit/i }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
		const payload = onSubmit.mock.calls[0][0] as SimpleProfile;
		expect(payload).toMatchObject({
			firstName: 'Ada',
			email: 'ada@example.com',
			age: 32,
			address: {
				street: '123 Main St',
				city: 'Springfield',
				zipCode: 94107,
			},
			preferences: {
				marketingEmails: true,
			},
		});
	});

	it('should prevent submission when required fields are empty', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderForm({ onSubmit });

		await user.click(screen.getByRole('button', { name: /submit/i }));
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('should display validation error after field blur', async () => {
		const user = userEvent.setup();
		renderForm();
		const firstNameInput = screen.getByRole('textbox', { name: /first name/i });

		await user.click(firstNameInput);
		await user.tab();

		expect(await screen.findByText('First Name is required')).toBeInTheDocument();
		expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
	});

	it('should submit nested object data correctly', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		renderForm({ onSubmit });

		await fillValidProfile(user);
		await user.click(screen.getByRole('button', { name: /submit/i }));

		const payload = onSubmit.mock.calls[0][0] as SimpleProfile;
		expect(payload.address).toEqual({
			street: '123 Main St',
			city: 'Springfield',
			zipCode: 94107,
		});
		expect(payload.preferences).toEqual(
			expect.objectContaining({ marketingEmails: true })
		);
	});

	it('should treat readonly fields as disabled inputs', () => {
		renderForm();
		const idInput = screen.getByLabelText(/id/i) as HTMLInputElement;
		expect(idInput).toBeDisabled();
		expect(idInput.value).toBe('1001');
	});

	it('should render class-based preference fields from TypeScript fixtures', () => {
		renderForm();
		expect(
			screen.getByRole('checkbox', { name: /marketing emails/i })
		).toBeInTheDocument();
	});
});
