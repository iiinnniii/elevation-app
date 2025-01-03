import { useState } from 'react';

const LocationForm = ({
	setLocation,
}: {
	setLocation: (location: { lat: number; lng: number }) => void;
}) => {
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
	};

	return (
		<form onSubmit={handleSubmit} className='mt-2'>
			<label>
				Latitude:
				<input
					type='text'
					value={lat}
					onChange={(e) => setLat(e.target.value)}
				/>
			</label>
			<label>
				Longitude:
				<input
					type='text'
					value={lng}
					onChange={(e) => setLng(e.target.value)}
				/>
			</label>
			<button type='submit'>Get Elevation</button>
		</form>
	);
};

export default LocationForm;
