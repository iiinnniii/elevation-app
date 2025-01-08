// types
import type { Location } from '../../types/schema';

export const fetchElevationData = async (location: Location) => {
	return fetch(
		`/api/v1/test-dataset?locations=${location.lat},${location.lng}`,
	);
};
