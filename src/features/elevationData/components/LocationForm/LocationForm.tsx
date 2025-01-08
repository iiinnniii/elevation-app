// hooks
import { useState } from 'react';

// types
import type { FormEvent } from 'react';
import type { Location } from '../../../../types/schema';

interface LocationFormProps {
	onSubmit: (location: Location) => void;
}

export const LocationForm = ({ onSubmit }: LocationFormProps) => {
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit({ lat: parseFloat(lat), lng: parseFloat(lng) });
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
