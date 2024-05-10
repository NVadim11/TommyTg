import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';
import AppRouter from './components/Router';
import { store } from './store';

function App() {
	return (
		<Provider store={store}>
			<AppRouter />
		</Provider>
	);
}

export default App;
