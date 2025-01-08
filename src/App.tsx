import { useState } from 'react';
import { Map } from './components/Map';
import { LocationForm } from './components/LocationForm';

// types
import type { Location } from './components/LocationForm';
import type { LatLng } from 'leaflet';

const App = () => {
	const [location, setLocation] = useState<Location>({
		lat: 51.505,
		lng: -0.09,
	});
	const [elevation, setElevation] = useState<number | null>(null);

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
			setElevation(data.results[0].elevation);
		} catch (error) {
			console.error('Error fetching elevation:', error);
		}
	};

	const handleSubmit = (location: Location) => {
		setLocation(location);
		fetchElevation(location.lat, location.lng);
	};

	const handleClick = (location: LatLng) => {
		setLocation(location);
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
