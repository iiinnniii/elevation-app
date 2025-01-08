// actions
import {
	setLocation,
	setElevation,
} from './features/elevationData/elevationDataSlice';

// compontents
import { Map } from './features/elevationData/components/Map';
import { LocationForm } from './features/elevationData/components/LocationForm';

// hooks
import { useAppSelector, useAppDispatch } from './app/hooks';

// selectors
import {
	selectMap,
	selectLocation,
	selectElevation,
} from './features/elevationData/elevationDataSlice';

// types
import type { Location } from './types/schema';
import type { LatLng } from 'leaflet';

const App = () => {
	const dispatch = useAppDispatch();
	const map = useAppSelector(selectMap);
	const location = useAppSelector(selectLocation);
	const elevation = useAppSelector(selectElevation);

	const fetchElevation = async (lat: number, lng: number) => {
		try {
			const response = await fetch(
				`/api/v1/test-dataset?locations=${lat},${lng}`,
			);
			console.log(response);
			if (!response.ok) {
				console.error(`HTTP error! Status: ${response.status}`); // Handle the error accordingly
			}
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			console.log(data);
			dispatch(setElevation(data.results[0].elevation));
		} catch (error) {
			console.error('Error fetching elevation:', error);
		}
	};

	const handleSubmit = (location: Location) => {
		dispatch(setLocation(location));
		fetchElevation(location.lat, location.lng);
		map?.flyTo(location);
	};

	const handleClick = (location: LatLng) => {
		dispatch(setLocation(location));
		fetchElevation(location.lat, location.lng);
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
