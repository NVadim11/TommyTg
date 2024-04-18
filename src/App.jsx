import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';
import AppRouter from './components/Router';
import { ClickCountProvider } from './components/clickContext';
import { store } from './store';

function App() {
	return (
		<Provider store={store}>
			<ClickCountProvider>
				<AppRouter />
			</ClickCountProvider>
		</Provider>
	);
}

export default App;
