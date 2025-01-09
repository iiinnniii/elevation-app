// components
import { Input } from '../../../../shared/components/Input';
import { ActionButton } from '../../../../shared/components/ActionButton';

// hooks
import { useState } from 'react';

// types
import type { ChangeEvent, FormEvent } from 'react';
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
		<form onSubmit={handleSubmit} className='mt-5'>
			<label htmlFor='latitude'>Latitude:</label>
			<Input
				name='latitude'
				type='number'
				value={lat}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setLat(e.target.value)}
				required
				className='ml-2'
			/>
			<label htmlFor='longitude' className='ml-2'>
				Longitude:
			</label>
			<Input
				name='longitude'
				type='number'
				value={lng}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setLng(e.target.value)}
				required
				className='ml-2'
			/>
			<ActionButton type='submit' className='ml-2'>
				Get Elevation
			</ActionButton>
		</form>
	);
};
