import { defineConfig } from 'vitest/config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

export default defineConfig({
	build: {
		sourcemap: process.env.NODE_ENV !== 'production',
	},
	test: {
		environment: 'jsdom',
	},
});
