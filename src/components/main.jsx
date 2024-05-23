import AOS from 'aos';
import { useContext, useEffect, useRef, useState } from 'react';
import { GameInfoContext } from '../helpers/context';
import sadIdle from '../img/1_idle.gif';
import sadSpeak from '../img/1talk.gif';
import normalIdle from '../img/2_idle.gif';
import normalSpeak from '../img/2talk.gif';
import smileIdle from '../img/3_idle.gif';
import smileSpeak from '../img/3talk.gif';
import happyIdle from '../img/4_idle.gif';
import happySpeak from '../img/4talk.gif';
import boostCoin from '../img/boost_coin_side.png';
import finalForm from '../img/finalForm.gif';
import goldForm from '../img/gold.gif';
import { useGetGameInfoQuery } from '../services';
import { useGetUserByTgIdQuery } from '../services/phpService';
import NotFound from './404';
import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';
import Preloader from './preloader/Preloader';

const MainComponent = () => {
	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;
	const [skip, setSkip] = useState(true);
	const { data: user } = useGetUserByTgIdQuery(userId, {
		skip: skip,
		pollingInterval: 10000,
	});

	const [preloaderLoaded, setPreloaderLoaded] = useState(false);
	const imagesRef = useRef([]);

	const { updateState } = useContext(GameInfoContext);
	const { data, isLoading, isError } = useGetGameInfoQuery();

	useEffect(() => {
		if (!isLoading && data) {
			updateState(data);
		}
	}, [isLoading, data, updateState]);

	useEffect(() => {
		const loadImage = (src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
			});
		};

		const loadImages = async () => {
			const imageSources = [
				sadIdle,
				sadSpeak,
				normalIdle,
				normalSpeak,
				smileIdle,
				smileSpeak,
				happyIdle,
				happySpeak,
				finalForm,
				goldForm,
				boostCoin,
			];
			const promises = imageSources.map((src) => loadImage(src));

			try {
				const loadedImages = await Promise.all(promises);
				imagesRef.current = loadedImages;
				setPreloaderLoaded(true);
			} catch (e) {
				console.log('problem loading images');
			}
		};

		const loadImagesTimeout = setTimeout(() => {
			loadImages();
		}, 2000);

		const aosInitTimeout = setTimeout(() => {
			AOS.init({
				easing: 'custom',
			});
			setPreloaderLoaded(true);
		}, 5000);

		return () => {
			clearTimeout(loadImagesTimeout);
			clearTimeout(aosInitTimeout);
		};
	}, []);

	useEffect(() => {
		if (tg && userId) {
			setSkip(false);
		}
	}, [tg, userId]);

	return (
		<>
			<Preloader loaded={preloaderLoaded} />
			{/* {user ? ( */}
				<>
					<Header user={user} />
					<main id='main' className='main'>
						<Main user={user} />
					</main>
					<Footer user={user} />
				</>
			{/* ) : ( */}
				{/* <NotFound /> */}
			{/* )} */}
		</>
	);
};

export default MainComponent;
