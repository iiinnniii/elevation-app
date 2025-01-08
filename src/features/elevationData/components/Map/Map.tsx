// actions
import { setMap } from '../../elevationDataSlice';

// components
import { MapContainer, TileLayer } from 'react-leaflet';

// css
import 'leaflet/dist/leaflet.css';

// hooks
import { useAppDispatch } from '../../../../app/hooks';
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
	const dispatch = useAppDispatch();

	const MapEvents = () => {
		const map = useMapEvents({
			click(e) {
				map.flyTo(e.latlng);
				if (onClick) {
					onClick(e.latlng);
				}
			},
		});
		dispatch(setMap(map));
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
