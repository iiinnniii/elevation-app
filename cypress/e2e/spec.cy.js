// import dotenv from 'dotenv';

// dotenv.config({ path: './.env.e2e-test.local' });
// dotenv.config({ path: './.env.e2e-test.ci' });

const remoteURL = `http://${Cypress.env('REMOTE_URL')}:${Cypress.env('PORT')}/`; // "localhost" | "host.docker.internal" | "elevation-app-server"

describe('Map Click Elevation Test', function () {
	beforeEach(function () {
		cy.task('log', `Cypress.env('REMOTE_URL'): ${Cypress.env('REMOTE_URL')}`);
		cy.task('log', `Cypress.env('PORT'): ${Cypress.env('PORT')}`);
		cy.task('log', `remoteURL: ${remoteURL}`);
		cy.visit(remoteURL);
	});

	it('should update elevation when clicking on the map', function () {
		// Wait for the elevation data to be fetched and displayed
		cy.intercept('/api/v1/test-dataset*').as('fetchElevation');
		// cy.wait('@fetchElevation');

		// Click on the map at specific coordinates
		cy.get('.leaflet-container').click(300, 200); // Adjust coordinates as needed

		cy.log('Waiting for fetchElevation request');
		cy.wait('@fetchElevation', { timeout: 10000 }).then((interception) => {
			cy.log('Request intercepted: ', interception);
		});

		// Assert that the elevation text is displayed and not loading
		cy.contains('Elevation:')
			.should('not.contain', 'Loading...')
			.and('contain', 'meters');

		// Log: Final check
		cy.get('p').then((p) => {
			cy.log('Paragraph text after fetch:', p.text());
		});
	});

	it('should fill inputs, press button, and match screenshot', function () {
		cy.intercept('GET', '/api/v1/test-dataset*', (req) => {
			req.reply({
				statusCode: 200,
				body: { results: [{ elevation: 300 }] },
			});
		}).as('fetchElevation');

		// Enter values into the inputs
		cy.get('input[name="latitude"]').type('40'); // Replace with your input selector
		cy.get('input[name="longitude"]').type('4'); // Replace with your input selector

		// Press the button
		cy.get('button[type="submit"]').click(); // Replace with your button selector

		// Wait for the UI to update, because of the aninmation (animation might be slow in cypress)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(20000); // Adjust the wait time if needed

		// Take a screenshot and compare with the expected screenshot
		cy.get('#root').matchImageSnapshot();
	});
});
