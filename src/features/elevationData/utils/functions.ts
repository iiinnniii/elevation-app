// types
import type { LatLng } from 'leaflet';
import type { Location } from '../../../types/schema';

export const convertLatLngToLocation = (latLng: LatLng): Location => ({
	lat: latLng.lat,
	lng: latLng.lng,
});
