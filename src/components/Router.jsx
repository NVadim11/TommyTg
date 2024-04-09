import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import { useGetUserByWalletIdMutation } from "../services/phpService"
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
	// const { publicKey, connected } = useWallet();
	// const wallet_address = publicKey?.toBase58();
	// const [getUser] = useGetUserByWalletIdMutation();

	const contextValue = {
		value: auth,
		setValue: setAuth,
	};

	// const connectSubmitHandler = async () => {
	//   try {
	//     const response = await getUser(wallet_address).unwrap();
	//     if (response) {
	//       setAuth(response);
	//     }
	//   } catch (error) {
	//     console.error("Error submitting data:", error.message);
	//   }
	// };
	// useEffect(() => {
	//   if (connected === true) {
	//     connectSubmitHandler();
	//     localStorage.setItem("wallet_id", wallet_address);
	//   }
	// }, [connected]);

	return (
		<AuthContext.Provider value={contextValue}>
			<RouterProvider router={router} />
		</AuthContext.Provider>
	);
};

export default AppRouter;
