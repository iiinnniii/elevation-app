import React from 'react';

// types
import type { Map as LeafletMap } from 'leaflet';

interface MapContextType {
	map: LeafletMap | null;
	setMap: (map: LeafletMap) => void;
}

export const MapContext = React.createContext<MapContextType>({
	map: null,
	setMap: () => {},
});
