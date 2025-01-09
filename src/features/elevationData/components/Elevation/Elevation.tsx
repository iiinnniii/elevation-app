// types
import type { Location } from '../../../../types/schema';

interface ElevationProps {
	location: Location;
	elevation: number | null;
}

export const Elevation = ({ location, elevation }: ElevationProps) => {
	return (
		<>
			{location && (
				<div className='mt-2'>
					<p>Latitude: {location.lat}</p>
					<p>Longitude: {location.lng}</p>
					<p>
						{`Elevation: ${elevation !== null ? `${elevation} meters` : 'Loading...'}`}
					</p>
				</div>
			)}
		</>
	);
};
