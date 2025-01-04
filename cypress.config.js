import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.e2e-test.local' });
dotenv.config({ path: './.env.e2e-test.ci' });

export default defineConfig({
	env: {
		REMOTE_URL: process.env.REMOTE_URL,
		PORT: process.env.PORT,
	},
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on('task', {
				log(message) {
					console.log(message);
					return null;
				},
			});
		},
	},
});
