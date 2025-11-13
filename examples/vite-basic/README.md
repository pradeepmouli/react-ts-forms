# Vite Plugin Example

This example demonstrates how to use the `react-ts-forms` Vite plugin for automatic type introspection during build time.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration

The Vite plugin is configured in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { typeFormPlugin } from '@mouli.dev/react-ts-forms/vite';

export default defineConfig({
  plugins: [
    react(),
    typeFormPlugin({
      debug: true,  // Enable debug logging
      cache: true,   // Enable schema caching
    }),
  ],
});
```

## Features

- **Automatic Type Introspection**: The plugin analyzes your TypeScript types during build
- **Performance Metrics**: Debug mode shows cache hit rates and transform times
- **Smart Caching**: Schemas are cached and only regenerated when files change
- **File Filtering**: Automatically excludes test files and node_modules

## How It Works

The Vite plugin:
1. Monitors TypeScript files during the build process
2. Detects usage of `FormGenerator` from `react-ts-forms`
3. Caches parsed schemas for improved performance
4. Provides debug metrics when enabled

Currently, the plugin provides infrastructure for build-time optimization. Full build-time type introspection using TypeScript Compiler API can be added in future versions.
