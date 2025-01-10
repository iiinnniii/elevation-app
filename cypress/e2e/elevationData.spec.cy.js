const remoteURL = `http://${Cypress.env('REMOTE_URL')}:${Cypress.env('PORT')}/`; // "localhost" | "host.docker.internal" | "elevation-app-server"

describe('Map Click Elevation Test', function () {
	beforeEach(function () {
		cy.task('log', `Cypress.env('REMOTE_URL'): ${Cypress.env('REMOTE_URL')}`);
		cy.task('log', `Cypress.env('PORT'): ${Cypress.env('PORT')}`);
		cy.task('log', `remoteURL: ${remoteURL}`);
		cy.visit(remoteURL);
	});

	it('should initially fetch elevation for default location', function () {
		// Avoid too many requests error
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Assert that the correct elevation text is displayed and not loading
		cy.get('[data-cy="elevation"]').should('not.contain', 'Loading...');
		cy.get('[data-cy="elevation"]').should(
			'have.text',
			'Elevation: 89.10835266113281 meters',
		);
	});

	it('should update elevation when clicking on the map', function () {
		// Avoid too many requests error
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Click on the map at specific coordinates
		// eslint-disable-next-line cypress/require-data-selectors
		cy.get('.leaflet-container').click(300, 200); // Adjust coordinates as needed

		// Assert that the correct elevation text for the new location is displayed and not loading
		cy.get('[data-cy="elevation"]').should(
			'not.contain',
			'Elevation: 89.10835266113281 meters',
		);
		cy.get('[data-cy="elevation"]').should('not.contain', 'Loading...');
		cy.get('[data-cy="elevation"]').should(
			'have.text',
			'Elevation: 89.85796356201172 meters',
		);
	});

	it('should display map', function () {
		// Avoid too many requests error (map fetches from other url)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Intercept request
		cy.intercept('GET', '/api/v1/test-dataset*', (req) => {
			req.reply({
				statusCode: 200,
				body: { results: [{ elevation: 2564 }] },
			});
		}).as('fetchElevation');

		// Wait for the UI to update (might be slow depending on the environment)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Take a screenshot and compare with the expected screenshot
		// eslint-disable-next-line cypress/require-data-selectors
		cy.get('.leaflet-container').matchImageSnapshot();
	});

	it('should update elevation via input form', function () {
		// Avoid too many requests error
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Enter values into the inputs
		cy.get('[data-cy="elevationData-LocationForm-Input-latitude"]').type('40'); // Replace with your input selector
		cy.get('[data-cy="elevationData-LocationForm-Input-longitude"]').type('4'); // Replace with your input selector

		// Press the button
		cy.get(
			'[data-cy="elevationData-LocationForm-ActionButton-submit"]',
		).click(); // Replace with your button selector

		// Assert that the correct elevation text for the via the form specified location is displayed and not loading
		cy.get('[data-cy="elevation"]').should(
			'not.contain',
			'Elevation: 89.10835266113281 meters',
		);
		cy.get('[data-cy="elevation"]').should('not.contain', 'Loading...');
		cy.get('[data-cy="elevation"]').should(
			'have.text',
			'Elevation: 136 meters',
		);
	});
});
