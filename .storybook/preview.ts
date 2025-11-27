import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/tokens.css';
import './liquid-glass.css';
import { AppProviders } from '../src/components/providers/AppProviders';

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		},
		backgrounds: {
			default: 'dark',
			values: [
				{
					name: 'dark',
					value: '#0f0f1e',
				},
				{
					name: 'light',
					value: '#f3f4f6',
				},
			],
		},
		layout: 'centered',
	},
	decorators: [
		(Story) => React.createElement(AppProviders, null, React.createElement(Story))
	]
};

export default preview;
