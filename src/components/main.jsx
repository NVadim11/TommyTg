import AOS from 'aos';
import { useContext, useEffect, useRef, useState } from 'react';
import TelegramLinking from '../components/QRcode';
import { GameInfoContext } from '../helpers/context';
import sadIdle from '../img/1_idle.gif';
import sadSpeak from '../img/1talk.gif';
import normalIdle from '../img/2_idle.gif';
import normalSpeak from '../img/2talk.gif';
import smileIdle from '../img/3_idle.gif';
import smileSpeak from '../img/3talk.gif';
import happyIdle from '../img/4_idle.gif';
import happySpeak from '../img/4talk.gif';
import star from '../img/Star.png';
import boostCoin from '../img/boostCoin.webp';
import catFace from '../img/catFace.webp';
import catCoin from '../img/catcoin_gold.webp';
import energy from '../img/energy.png';
import finalForm from '../img/finalForm.gif';
import goldForm from '../img/gold.gif';
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
	const initData = tg.initDataUnsafe;
	const userId = initData?.user?.id;
	const [skip, setSkip] = useState(true);
	const { data: user } = useGetUserByTgIdQuery(userId, {
		skip: skip,
		pollingInterval: 10000,
	});
	const [preloaderLoaded, setPreloaderLoaded] = useState(false);
	const imagesRef = useRef([]);
	const { updateState } = useContext(GameInfoContext);
	const { data, isLoading } = useGetGameInfoQuery();

	const secretURL = process.env.REACT_APP_REGISTER_KEY;
	const testURL = process.env.REACT_APP_TEST_URL;

	useEffect(() => {
		if (!user) {
			fetch(secretURL + '/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					parent_id_telegram: '',
					query_id: initData.query_id,
					user: {
						id: initData.user.id,
						is_bot: initData.user.is_bot,
						first_name: initData.user.first_name,
						last_name: initData.user.last_name,
						username: initData.user.username,
						language_code: initData.user.language_code,
					},
					auth_date: initData.auth_date,
					hash: initData.hash,
				}),
			})
				.then((response) => response.json())
				.then((data) => console.log('Success:', data))
				.catch((error) => console.error('Error:', error));
			console.log('Init Data:', JSON.stringify(initData, null, 2));
		} else {
			console.log('No user data available');
		}
	}, [initData]);

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
			happySpeak,
			finalForm,
			goldForm,
			sadSpeak,
			smileSpeak,
			normalSpeak,
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
				{!isMobileDevice ? (
					<TelegramLinking />
				) : (
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
				)}
			</>
		</>
	);
};

export default MainComponent;
