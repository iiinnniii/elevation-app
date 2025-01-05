import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
		},
		proxy: {
			'/api': {
				target: 'https://api.opentopodata.org',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	build: { sourcemap: process.env.NODE_ENV === 'development' },
});
