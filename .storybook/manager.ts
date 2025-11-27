import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const liquidGlassTheme = create({
	base: 'dark',

	// Brand
	brandTitle: 'React TS Forms',
	brandUrl: 'https://github.com/pradeepmouli/react-ts-forms',
	brandTarget: '_self',

	// Colors
	colorPrimary: '#a78bfa', // violet-400
	colorSecondary: '#8b5cf6', // violet-500

	// UI
	appBg: '#0f0f1e',
	appContentBg: 'rgba(17, 17, 35, 0.6)',
	appBorderColor: 'rgba(167, 139, 250, 0.2)',
	appBorderRadius: 12,

	// Text colors
	textColor: '#f3f4f6',
	textInverseColor: '#0f0f1e',
	textMutedColor: '#9ca3af',

	// Toolbar
	barTextColor: '#d1d5db',
	barSelectedColor: '#a78bfa',
	barBg: 'rgba(17, 17, 35, 0.8)',
	barHoverColor: '#a78bfa',

	// Form colors
	inputBg: 'rgba(31, 41, 55, 0.5)',
	inputBorder: 'rgba(167, 139, 250, 0.3)',
	inputTextColor: '#f3f4f6',
	inputBorderRadius: 8,

	// Font
	fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	fontCode: '"JetBrains Mono", "Fira Code", monospace',
});

addons.setConfig({
	theme: liquidGlassTheme,
	sidebar: {
		showRoots: true,
		collapsedRoots: [],
	},
});
