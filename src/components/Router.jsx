import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Discord, Twitter } from './auth';
import { AuthContext } from './helper/contexts';
import MainComponent from './main';

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainComponent />,
	},
	{
		path: '/:code',
		element: <MainComponent />,
	},
	{
		path: '/twitter/callback',
		element: <Twitter />,
	},
	{
		path: 'discord/callback',
		element: <Discord />,
	},
]);

const AppRouter = () => {
	const [auth, setAuth] = useState({});

	const contextValue = {
		value: auth,
		setValue: setAuth,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			<RouterProvider router={router} />
		</AuthContext.Provider>
	);
};

export default AppRouter;
