// components
import { MapContainer, TileLayer } from 'react-leaflet';

// context
import { MapContext } from '../../../../context/map-context';

// css
import 'leaflet/dist/leaflet.css';

// hooks
import { useContext, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

// types
import type { LatLng, LatLngExpression } from 'leaflet';

interface MapProps {
	center: LatLngExpression;
	onClick?: (location: LatLng) => void;
}

export const Map = ({
	center = { lat: 51.505, lng: -0.09 },
	onClick,
}: MapProps) => {
	const mapContext = useContext(MapContext);

	const MapEvents = () => {
		const map = useMapEvents({
			click(e) {
				map.flyTo(e.latlng);
				if (onClick) {
					onClick(e.latlng);
				}
			},
		});
		useEffect(() => {
			if (mapContext.map === null) {
				mapContext.setMap(map);
			}
		}, []);
		return null;
	};

	return (
		<>
			<MapContainer
				center={center}
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
