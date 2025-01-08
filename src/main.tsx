import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { MapContextProvider } from './context/MapContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MapContextProvider>
			<Provider store={store}>
				<App />
			</Provider>
		</MapContextProvider>
	</StrictMode>,
);
