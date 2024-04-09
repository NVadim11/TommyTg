import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';
import AppRouter from './components/Router';
import { store } from './store';
import { theme } from './theme';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</ThemeProvider>
	);
}

export default App;
