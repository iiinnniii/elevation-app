import { useState } from 'react';
import Map from './components/Map';
import LocationForm from './components/LocationForm';

const App = () => {
	const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
		null,
	);
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

	const handleLocationChange = (loc: { lat: number; lng: number }) => {
		setLocation(loc);
		fetchElevation(loc.lat, loc.lng);
	};

	// const a: number = 'dfdf';
	// let b = c + 1;
	// console.log(b);

	return (
		<div>
			<h1>Elevation Data</h1>
			<LocationForm setLocation={handleLocationChange} />
			<Map setLocation={handleLocationChange} />
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
