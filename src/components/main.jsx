import AOS from 'aos';
import { useContext, useEffect, useRef, useState } from 'react';
import TelegramLinking from '../components/QRcode';
import { GameInfoContext } from '../helpers/context';
import sadIdle from '../img/1_idle.gif';
import normalIdle from '../img/2_idle.gif';
import smileIdle from '../img/3_idle.gif';
import happyIdle from '../img/4_idle.gif';
import star from '../img/Star.png';
import boostCoin from '../img/boostCoin.webp';
import catFace from '../img/catFace.webp';
import catCoin from '../img/catcoin_gold.webp';
import energy from '../img/energy.png';
import goldIdle from '../img/goldIdle.gif';
import orangeEllipse from '../img/orangeEllipse.webp';
import skullGlow from '../img/skullGlow.webp';
import violetEllipse from '../img/violetEllipse.webp';
import { useGetGameInfoQuery } from '../services';
import { useGetUserByTgIdQuery } from '../services/phpService';
// import ComingSoon from './ComingSoon';
// import Maintenance from './Maintenance';
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

		const imageSources = [
			sadIdle,
			normalIdle,
			smileIdle,
			happyIdle,
			boostCoin,
			star,
			catFace,
			catCoin,
			energy,
			goldIdle,
			orangeEllipse,
			skullGlow,
			violetEllipse,
		];

		const loadImages = async () => {
			const promises = imageSources.map((src) => loadImage(src));

			try {
				const loadedImages = await Promise.all(promises);
				imagesRef.current = loadedImages;
				checkAllLoaded();
			} catch (e) {
				console.log('problem loading images');
			}
		};

		const checkAllLoaded = () => {
			if (!isLoading && data && imagesRef.current.length === imageSources.length) {
				setTimeout(() => {
					setPreloaderLoaded(true);
					AOS.init({
						easing: 'custom',
					});
				}, 500);
			}
		};
		loadImages();
	}, [isLoading, data]);

	useEffect(() => {
		if (tg && userId) {
			setSkip(false);
		}
	}, [tg, userId]);

	// Detecting if the application is opened from a mobile device
	const isMobileDevice =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

	return (
		<>
			<>
				{/* {!isMobileDevice ? (
					<TelegramLinking />
				) : ( */}
					<>
						<Preloader loaded={preloaderLoaded} />
						{user ? (
							<>
								<Header user={user} />
								<main id='main' className='main'>
									<Main user={user} />
								</main>
								<Footer user={user} />
							</>
						) : (
							// <ComingSoon />
							// <Maintenance />
							<NotFound />
						)}
					</>
				{/* )} */}
			</>
		</>
	);
};

export default MainComponent;
