import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { typeFormPlugin } from '@mouli.dev/react-ts-forms/vite';

export default defineConfig({
	plugins: [
		react(),
		typeFormPlugin({
			debug: true,
			cache: true,
			include: ['**/*.tsx', '**/*.ts'],
			exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**'],
		}),
	],
});
