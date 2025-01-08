// components
import { MapContainer, TileLayer } from 'react-leaflet';

// css
import 'leaflet/dist/leaflet.css';

// hooks
import { useMapEvents, useMap, Marker } from 'react-leaflet';

// types
import type { LatLng, LatLngExpression } from 'leaflet';

interface MapProps {
	center: LatLngExpression;
	onClick?: (location: LatLng) => void;
}

interface ChangeViewProps {
	center: LatLngExpression;
	zoom: number;
}

export const Map = ({
	center = { lat: 51.505, lng: -0.09 },
	onClick,
}: MapProps) => {
	const MapEvents = () => {
		const map = useMapEvents({
			click(e) {
				map.flyTo(e.latlng);
				if (onClick) {
					onClick(e.latlng);
				}
			},
		});
		return null;
	};

	const ChangeView = ({ center, zoom }: ChangeViewProps) => {
		const map = useMap();
		map.flyTo(center, zoom);
		return null;
	};

	return (
		<>
			<MapContainer
				center={center}
				zoom={13}
				style={{ height: '400px', width: '100%' }}
			>
				<ChangeView center={center} zoom={13} />
				<Marker position={center}></Marker>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<MapEvents />
			</MapContainer>
		</>
	);
};
