import React from 'react';
import { FormGenerator, TypeParser, SchemaBuilder } from '@mouli.dev/react-ts-forms';

interface UserProfile {
	name: string;
	email: string;
	age?: number;
	isActive: boolean;
}

export function App() {
	// Generate schema from TypeScript type
	const schema = SchemaBuilder.buildSchema('UserProfile', [
		TypeParser.parseType('name', { kind: 'string', required: true }),
		TypeParser.parseType('email', { kind: 'string', required: true }),
		TypeParser.parseType('age', { kind: 'number', required: false }),
		TypeParser.parseType('isActive', { kind: 'boolean', required: true }),
	], {
		title: 'User Profile',
		description: 'Edit your profile information',
	});

	const handleSubmit = (values: Record<string, unknown>) => {
		console.log('Form submitted with values:', values);
		alert(`Welcome, ${values.name}!`);
	};

	return (
		<div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
			<h1>Vite Plugin Example</h1>
			<p>This form is automatically generated from TypeScript types.</p>
			<FormGenerator
				schema={schema}
				initialValues={{ isActive: true }}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
