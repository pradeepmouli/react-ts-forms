import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
	framework: {
		name: '@storybook/react-vite',
		options: {}
	},
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
	core: {
		disableTelemetry: true
	},
	docs: {
		defaultName: 'Documentation'
	},
	async viteFinal(config) {
		return mergeConfig(config, {
		});
	}
};

export default config;
