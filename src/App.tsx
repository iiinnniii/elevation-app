// actions
import { setLocation } from './features/elevationData/elevationDataSlice';

// actions async
import { fetchElevationDataAsync } from './features/elevationData/elevationDataSlice';

// compontents
import { Map } from './features/elevationData/components/Map';
import { LocationForm } from './features/elevationData/components/LocationForm';

// hooks
import { useAppSelector, useAppDispatch } from './app/hooks';

// selectors
import {
	selectLocation,
	selectElevation,
} from './features/elevationData/elevationDataSlice';

// types
import type { Location } from './types/schema';
import type { LatLng } from 'leaflet';

// utils
import { convertLatLngToLocation } from './features/elevationData/utils/functions';

const App = () => {
	const dispatch = useAppDispatch();
	const location = useAppSelector(selectLocation);
	const elevation = useAppSelector(selectElevation);

	const handleSubmit = (location: Location) => {
		dispatch(setLocation(location));
		dispatch(fetchElevationDataAsync(location));
	};

	const handleClick = (latLng: LatLng) => {
		const location = convertLatLngToLocation(latLng);
		dispatch(setLocation(location));
		dispatch(fetchElevationDataAsync(location));
	};

	return (
		<div>
			<h1>Elevation Data</h1>
			<LocationForm onSubmit={handleSubmit} />
			<Map center={location} onClick={handleClick} />
			{location && (
				<div>
					<p>Latitude: {location.lat}</p>
					<p>Longitude: {location.lng}</p>
					<p>
						{`Elevation: ${elevation !== null ? `${elevation} meters` : 'Loading...'}`}
					</p>
				</div>
			)}
		</div>
	);
};

export default App;
