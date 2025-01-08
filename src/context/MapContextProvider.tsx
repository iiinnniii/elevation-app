// context
import { MapContext } from './map-context';

//  hooks
import { useState } from 'react';

// types
import type { ReactNode } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface MapContextProviderProps {
	children: ReactNode;
}

export const MapContextProvider = (props: MapContextProviderProps) => {
	const [map, setMap] = useState<LeafletMap | null>(null);

	return (
		<MapContext.Provider
			value={{
				map,
				setMap: (map: LeafletMap) => {
					setMap(map);
				},
			}}
		>
			{props.children}
		</MapContext.Provider>
	);
};
