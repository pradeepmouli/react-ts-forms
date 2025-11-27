import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: path.resolve(process.cwd(), 'src/index.ts'),
			name: 'ReactTsForms',
			formats: ['es'],
			fileName: 'index'
		},
		outDir: 'dist',
		sourcemap: true,
		rollupOptions: {
			external: ['react', 'react-dom']
		}
	}
});
