// actions
import { setLocation } from './features/elevationData/elevationDataSlice';

// actions async
import { fetchElevationDataAsync } from './features/elevationData/elevationDataSlice';

// compontents
import { H1 } from './shared/components/H1';
import { LocationForm } from './features/elevationData/components/LocationForm';
import { Map } from './features/elevationData/components/Map';
import { Elevation } from './features/elevationData/components/Elevation';

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
import { useEffect } from 'react';

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

	useEffect(() => {
		if (elevation === null) {
			dispatch(fetchElevationDataAsync(location));
		}
	}, [elevation]);

	return (
		<div>
			<H1>Elevation Data</H1>
			<LocationForm onSubmit={handleSubmit} />
			<Map center={location} onClick={handleClick} />
			<Elevation location={location} elevation={elevation} />
		</div>
	);
};

export default App;
