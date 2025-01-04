import { defineConfig } from 'cypress';
import dotenvPlugin from 'cypress-dotenv';

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on('task', {
				log(message) {
					console.log(message);
					return null;
				},
			});
			// Update config
			const updatedConfig = dotenvPlugin(
				config,
				{ path: './.env.e2e-test.ci' },
				true,
			);
			return updatedConfig;
		},
	},
});
