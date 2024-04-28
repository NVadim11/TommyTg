import AOS from 'aos';
import { useContext, useEffect, useState, useMemo } from 'react';
import { GameInfoContext } from '../helpers/context';
import { useGetGameInfoQuery } from '../services';
import { useGetUserByTgIdQuery } from '../services/phpService';
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

	const { state } = useContext(GameInfoContext);

	const sadIdle = state?.images.one_idle;
	const sadSpeak = state?.images.one_talk;
	const normalIdle = state?.images.two_idle;
	const normalSpeak = state?.images.two_talk;
	const smileIdle = state?.images.three_idle;
	const smileSpeak = state?.images.three_talk;
	const happyIdle = state?.images.four_idle;
	const happySpeak = state?.images.four_talk;
	const goldForm = state?.images.gold;
	const finalForm = state?.images.finalForm;
	const boostCoin = state?.images.boost_coin;

	const [preloaderVisible, setPreloaderVisible] = useState(true);

	const { updateState } = useContext(GameInfoContext);
	const { data, isLoading, isError } = useGetGameInfoQuery();
	
	useEffect(() => {
        if (!isLoading && data) {
            updateState(data);
        }
    }, [isLoading, data, updateState]);

	const imageSources = useMemo(() => [
        sadIdle, sadSpeak, normalIdle, normalSpeak,
        smileIdle, smileSpeak, happyIdle, happySpeak,
        finalForm, goldForm, boostCoin,
    ], [
        sadIdle, sadSpeak, normalIdle, normalSpeak,
        smileIdle, smileSpeak, happyIdle, happySpeak,
        finalForm, goldForm, boostCoin,
    ]);

    useEffect(() => {
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                if (!src) {
                    resolve(); 
                    return;
                }

                const img = new Image();
                img.src = src;
                img.onload = () => {
                    resolve();
                    console.log('img.loaded');
                };
                img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
            });
        };

        const loadImages = async () => {
            try {
                await Promise.all(imageSources.map((src) => loadImage(src)));
                setPreloaderVisible(false);
            } catch (e) {
                console.log('Problem loading images:', e);
            }
        };

        loadImages();
    }, [imageSources]);

	useEffect(() => {
        if (preloaderVisible) {
            AOS.init({
                easing: 'custom',
            });
        }
    }, [preloaderVisible]);

	useEffect(() => {
		if (user && userId) {
			setSkip(false);
		}
	}, [user, userId]);

	return (
		<div className='wrapper'>
		{preloaderVisible && <Preloader />}
		{!preloaderVisible && <Header user={user} />}
		{!preloaderVisible && <main className='main'>
			<Main user={user} />
		</main>}
		{!preloaderVisible && <Footer user={user} />}
	</div>
	);
};

export default MainComponent;
