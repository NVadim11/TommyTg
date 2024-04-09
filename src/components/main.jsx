import AOS from 'aos';
import { useEffect, useState } from 'react';
import { useGetUserByTgIdQuery } from '../services/phpService';
import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';
import Preloader from './preloader/Preloader';

const MainComponent = () => {
	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;
	const [preloaderLoaded, setPreloaderLoaded] = useState(false);
	const [skip, setSkip] = useState(true);
	const { data: user } = useGetUserByTgIdQuery(userId, {
		skip: skip,
		pollingInterval: 10000,
	});

	useEffect(() => {
		if (tg && userId) {
			setSkip(false);
			localStorage.setItem('tg_id', userId);
		}
	}, [tg, userId]);

	useEffect(() => {
		const preloaderTimeout = setTimeout(() => {
			setPreloaderLoaded(true);
		}, 3000);

		const timeout = setTimeout(() => {
			AOS.init({
				easing: 'custom',
			});
		}, 3000);
		return () => {
			clearTimeout(timeout);
			clearTimeout(preloaderTimeout);
		};
	}, []);
	return (
		<div className='wrapper'>
			<Preloader loaded={preloaderLoaded} />
			<Header user={user} />
			<main className='main'>
				<Main user={user} />
			</main>
			<Footer user={user} />
		</div>
	);
};

export default MainComponent;
