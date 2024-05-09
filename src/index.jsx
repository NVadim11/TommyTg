import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/dotenvConfig';
import App from './App';
import { GameInfoProvider } from './helpers/contextProvider';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<GameInfoProvider>
			<App />
		</GameInfoProvider>
	</React.StrictMode>
);

// test