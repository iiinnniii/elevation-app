import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

const Map = ({
	setLocation,
}: {
	setLocation: (location: { lat: number; lng: number }) => void;
}) => {
	const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });

	const MapEvents = () => {
		useMapEvents({
			click(e) {
				setPosition(e.latlng);
				setLocation(e.latlng);
			},
		});
		return null;
	};

	return (
		<>
			<MapContainer
				center={position}
				zoom={13}
				style={{ height: '400px', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<MapEvents />
			</MapContainer>
		</>
	);
};

export default Map;
