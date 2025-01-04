import dotenv from 'dotenv';


dotenv.config({ path: './.env.e2e-test.local' });
dotenv.config({ path: './.env.e2e-test.ci' });


const remoteURL = `http://${process.env.REMOTE_URL}:5173/`; // "localhost" | "host.docker.internal" | "elevation-app-server"

describe('Map Click Elevation Test', function () {
	beforeEach(function () {
		cy.task('log', process.cwd());
		cy.task('log', process.env.REMOTE_URL);
		cy.visit(remoteURL);
	});

	it('should update elevation when clicking on the map', function () {
		// Wait for the elevation data to be fetched and displayed
		cy.intercept('/api/v1/test-dataset*').as('fetchElevation');
		// cy.wait('@fetchElevation');

		// Click on the map at specific coordinates
		cy.get('.leaflet-container')
			.click(300, 200); // Adjust coordinates as needed

		cy.log('Waiting for fetchElevation request');
		cy.wait('@fetchElevation', { timeout: 10000 }).then((interception) => {
			cy.log('Request intercepted: ', interception);
		});

		// Assert that the elevation text is displayed and not loading
		cy.contains('Elevation:')
			.should('not.contain', 'Loading...')
			.and('contain', 'meters');

		// Log: Final check 
		cy.get('p').then((p) => { cy.log('Paragraph text after fetch:', p.text()); });
	});
});
