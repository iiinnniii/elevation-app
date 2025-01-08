import { expect, test } from 'vitest';

// types
import { LatLng } from 'leaflet';
import type { Location } from '../../../types/schema';

// units
import { convertLatLngToLocation } from './functions';

test('conversion from LatLng To Location', () => {
	const latLng: LatLng = new LatLng(59.57885104663189, 13.623046875);
	const location: Location = {
		lat: 59.57885104663189,
		lng: 13.623046875,
	};
	expect(convertLatLngToLocation(latLng)).toStrictEqual(location);
});
