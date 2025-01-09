/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				action: '#0ea5e9',
				'action-darkened': '#0369a1',
			},
		},
	},
	plugins: [],
};
