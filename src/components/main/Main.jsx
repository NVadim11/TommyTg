import axios from 'axios';
import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import sadIdle from '../../img/1_idle.gif';
import sadSpeak from '../../img/1talk.gif';
import normalIdle from '../../img/2_idle.gif';
import normalSpeak from '../../img/2talk.gif';
import smileIdle from '../../img/3_idle.gif';
import smileSpeak from '../../img/3talk.gif';
import happyIdle from '../../img/4_idle.gif';
import happySpeak from '../../img/4talk.gif';
import boostCoin from '../../img/boost_coin_side.png';
import catFace from '../../img/catFace.png';
import catCoinMove from '../../img/cat_coin_move.png';
import finalForm from '../../img/finalForm.gif';
import goldForm from '../../img/gold.gif';
import smile from '../../img/smile.png';
import { useUpdateBalanceMutation } from '../../services/phpService';
import { playBoostCatClick, playSadCatClick } from '../../utility/Audio';
import { useClickCount } from '../clickContext';
// import { GameInfoContext } from "../../helpers/context";
import './Main.scss';

const Main = ({ user }) => {
	const isMobile = useMediaQuery({ maxWidth: '1439.98px' });
	const [currentImage, setCurrentImage] = useState(true);
	const [coinState, setCoinState] = useState(false);
	const [currCoins, setCurrCoins] = useState(0);
	const [currEnergy, setCurrEnergy] = useState(0);
	const [isCoinsChanged, setIsCoinsChanged] = useState(false);
	const [catIdle, setCatIdle] = useState(sadIdle);
	const [catSpeak, setCatSpeak] = useState(sadSpeak);
	const timeoutRef = useRef(null);
	const coinRef = useRef(null);
	const accumulatedCoinsRef = useRef(0);
	const [updateBalance] = useUpdateBalanceMutation();
	const [position, setPosition] = useState({ x: '50%', y: '50%' });
	const [boostPhase, setBoostPhase] = useState(false);
	const [visible, setVisible] = useState(false);
	const [catVisible, setCatVisible] = useState(true);

	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;

	let [happinessVal, setHappinessVal] = useState(1);
	let [clickNewCoins, setClickNewCoins] = useState(1);
	const [gamePaused, setGamePaused] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState('');

	const [isAnimationActive, setIsAnimationActive] = useState(false);
	const [animations, setAnimations] = useState([]);

	const secretKey = process.env.REACT_APP_SECRET_KEY;

	const isDesktop = () => {
		const userAgent = window.navigator.userAgent;
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		return !isMobile;
	};

	useEffect(() => {
		if (!isDesktop()) {
			const element = document.getElementById('clickableElement');
			if (element) {
				element.style.pointerEvents = 'none';
			}
		}
	}, []);

	const pauseGame = async () => {
		setGamePaused(true);
		const currentTimeStamp = Math.floor(Date.now() / 1000);
		const futureTimestamp = currentTimeStamp + 60 * 60;
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);

		fetch('https://aws.tomocat.com/api/set-activity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: userId,
				timestamp: futureTimestamp,
			}),
		})
			.then((response) => {
				if (response.ok) {
				} else {
					console.log('Failed to pause game');
				}
			})
			.catch((e) => {
				console.log('Error pausing game');
			});
	};

	useEffect(() => {
		if (user?.energy) {
			const timeoutId = setTimeout(() => {
				setCurrEnergy(user.energy);
			}, 1000);

			return () => clearTimeout(timeoutId);
		} else {
			setCurrEnergy(0);
		}
	}, []);

	useEffect(() => {
		if (currEnergy === 1000) {
			pauseGame();
			setCurrEnergy(0);
			setCatVisible(false);
		}
	}, [currEnergy]);

	const getGameStatus = async () => {
		try {
			const initGameStatusCheck = await axios.get(
				`https://aws.tomocat.com/api/telegram-id/${userId}`
			);
		} catch (e) {
			console.log('Error fetching leaderboard data');
		}
	};

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				const currentTimeStamp = Math.floor(Date.now() / 1000);
				const remainingTime = user?.active_at - currentTimeStamp;
				if (remainingTime >= 0) {
					if (remainingTime <= 0) {
						setGamePaused(false);
						setCatVisible(true);
					} else {
						setGamePaused(true);
						setTimeRemaining(remainingTime);
					}
				}
			};

			getGameStatus();

			const timeout = setTimeout(() => {
				getGameStatus();
			}, 1000);

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}
	}, [userId, user]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	let catIdleImage = catIdle;
	let catSpeakImage = catSpeak;

	const { incrementClickCount } = useClickCount();

	const handleCoinClick = () => {
		incrementClickCount();
	};

	const boostClickedHandler = () => {
		handleBoostClick();
	};

	const handleBoostClick = () => {
		const prevHappinessVal = happinessVal;
		const prevClickNewCoins = clickNewCoins;

		setBoostPhase(true);
		setVisible(false);
		setHappinessVal(4);
		setClickNewCoins(4);

		setTimeout(() => {
			setHappinessVal(prevHappinessVal);
			setClickNewCoins(prevClickNewCoins);
			setBoostPhase(false);
			setVisible(true);
		}, 10000);
	};

	const randomizePosition = () => {
		const elementWidth = 850;
		const elementHeight = 850;
		const maxX = Math.max(0, window.innerWidth - elementWidth);
		const maxY = Math.max(0, window.innerHeight - elementHeight);
		const x = Math.random() * maxX;
		const y = Math.random() * maxY;

		setPosition({ x, y });
	};

	useEffect(() => {
		if (gamePaused) {
			setCoinState(false);
			setBoostPhase(false);
			setVisible(false);
			setCurrentImage(false);
			setBoostPhase(false);
			setCoinState(false);
			clearAnimations();
			setHappinessVal(1);
			setClickNewCoins(1);
		}
	}, [gamePaused]);

	useEffect(() => {
		if (!gamePaused) {
			if (!visible) {
				randomizePosition();
				const showBoostTimeout = setTimeout(() => {
					randomizePosition();
					setVisible(true);
				}, Math.random() * (30000 - 13000) + 13000);

				return () => clearTimeout(showBoostTimeout);
			} else {
				const hideBoostTimeout = setTimeout(() => {
					setVisible(false);
				}, 8300);

				return () => clearTimeout(hideBoostTimeout);
			}
		}
	}, [visible, gamePaused]);

	const [bgImages] = useState({
		bgImageFirst: 'img/bgFirst.webp',
		bgImageSecond: 'img/bgSecond.webp',
		bgImageThird: 'img/bgThird.webp',
		bgImageFourth: 'img/bgFourth.webp',
		bgImageFives: 'img/bgFives.webp',
	});

	let activeImage = bgImages.bgImageFirst;
	let opacityFirst = 0;
	let opacitySecond = 0;
	let opacityThird = 0;
	let opacityFourth = 0;
	let opacityFives = 0;

	if (currEnergy >= 0 && currEnergy <= 150) {
		activeImage = bgImages.bgImageFirst;
		opacityFirst = 1;
	} else if (currEnergy >= 151 && currEnergy <= 300) {
		activeImage = bgImages.bgImageSecond;
		opacitySecond = 1;
	} else if (currEnergy >= 301 && currEnergy <= 550) {
		activeImage = bgImages.bgImageThird;
		opacityThird = 1;
	} else if (currEnergy >= 551 && currEnergy <= 800) {
		activeImage = bgImages.bgImageFourth;
		opacityFourth = 1;
	} else if (currEnergy >= 801 && currEnergy <= 1000) {
		activeImage = bgImages.bgImageFives;
		opacityFives = 1;
	}

	useEffect(() => {
		if (currEnergy <= 0) {
			setCurrEnergy(0);
		}
	}, [currEnergy]);

	const updateCurrCoins = () => {
		if (currEnergy >= 0 && currEnergy <= 150) {
			catIdleImage = sadIdle;
			catSpeakImage = sadSpeak;
		} else if (currEnergy >= 151 && currEnergy <= 300) {
			catIdleImage = normalIdle;
			catSpeakImage = normalSpeak;
		} else if (currEnergy >= 301 && currEnergy <= 550) {
			catIdleImage = smileIdle;
			catSpeakImage = smileSpeak;
		} else if (currEnergy >= 551 && currEnergy <= 800) {
			catIdleImage = happyIdle;
			catSpeakImage = happySpeak;
		} else if (currEnergy >= 801 && currEnergy <= 1000) {
			catIdleImage = happyIdle;
			catSpeakImage = finalForm;
		}
		setCatIdle(catIdleImage);
		setCatSpeak(catSpeakImage);
		setIsCoinsChanged(true);
		return clickNewCoins;
	};

	useEffect(() => {
		const timer = setInterval(() => {
			if (isCoinsChanged) {
				submitData(accumulatedCoinsRef.current);
				setIsCoinsChanged(false);
				accumulatedCoinsRef.current = 0;
			}
		}, 3000);

		return () => clearInterval(timer);
	}, [isCoinsChanged]);

	const submitData = async (coins) => {
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);
		try {
			await updateBalance({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				score: coins,
			}).unwrap();
		} catch (e) {
			console.log('Error submitting coins:');
		}
	};

	const handleShowAnimation = (event) => {
		event.stopPropagation();
		const touch = event.touches ? event.touches[0] : event;
		const clicker = touch.currentTarget || touch.target;
		const rect = clicker.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;

		setAnimations((prev) => [...prev, { x, y }]);
		setIsAnimationActive(true);
	};

	const clearAnimations = () => {
		setAnimations([]);
	};

	const coinClicker = (event) => {
		if (!event.isTrusted) return;
		if ((currEnergy >= 801 && currEnergy <= 1000) || boostPhase === true) {
			playBoostCatClick();
		} else {
			playSadCatClick();
		}
		setCurrentImage(false);
		setCoinState(true);
		handleShowAnimation(event);
		handleCoinClick();
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + happinessVal, 1000));
		clearTimeout(timeoutRef.current);
		clearTimeout(coinRef.current);
		timeoutRef.current = setTimeout(() => setCurrentImage(true), 1100);
		coinRef.current = setTimeout(() => setCoinState(false), 4000);

		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
	};

	const debouncedHandleClick = debounce(() => {
		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
	}, 500);

	const handleTouchStart = (event) => {
		if (event.touches.length > 1) {
			event.preventDefault();
			return;
		}

		if (!event.isTrusted) return;
		if ((currEnergy >= 801 && currEnergy <= 1000) || boostPhase === true) {
			playBoostCatClick();
		} else {
			playSadCatClick();
		}
		setCurrentImage(false);
		setCoinState(true);
		handleShowAnimation(event);
		handleCoinClick();
		clearTimeout(timeoutRef.current);
		clearTimeout(coinRef.current);
		timeoutRef.current = setTimeout(() => setCurrentImage(true), 1100);
		coinRef.current = setTimeout(() => setCoinState(false), 4000);
	};

	const handleTouchEnd = (event) => {
		if (event && event.touches) {
			Array.from(event.touches).forEach((touch) => {
				handleShowAnimation(touch);
			});
		}
		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + happinessVal, 1000));
	};

	return (
		<div className='mainContent'>
			<div
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFirst})`,
					opacity: opacityFirst,
				}}
			></div>
			<div
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageSecond})`,
					opacity: opacitySecond,
				}}
			></div>
			<div
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageThird})`,
					opacity: opacityThird,
				}}
			></div>
			<div
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFourth})`,
					opacity: opacityFourth,
				}}
			></div>
			<div
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFives})`,
					opacity: opacityFives,
				}}
			></div>
			<div className='mainContent__container'>
				<div className='mainContent__phaseTwo'>
					<div className='gameContentBox'>
						{gamePaused ? (
							<div className='gameContentBox__box'>
								{timeRemaining ? (
									<h4
										style={{
											fontSize: '22px',
											textAlign: 'center',
											alignContent: 'center',
										}}
									>
										Time remaining: {formatTime(timeRemaining)} minutes
									</h4>
								) : (
									<></>
								)}
								<img
									src={catFace}
									alt='cat face'
									style={{
										width: '275px',
										marginTop: '15px',
									}}
								/>
								<p
									style={{
										fontSize: '16px',
										textAlign: 'center',
										alignContent: 'center',
										marginTop: '15px',
									}}
								>
									Tomo is tired, comeback when timer is over.
								</p>
							</div>
						) : (
							<>
								{catVisible && (
									<>
										{currentImage ? (
											<div
												className='mainContent__catBox'
												id='coinClicker'
												onClick={isDesktop() ? coinClicker : null}
												onTouchStart={handleTouchStart}
												onTouchEnd={(e) => handleTouchEnd(e.touches[0], e)}
											>
												{animations.map((anim, index) => (
													<AnimatePresence key={index}>
														{isAnimationActive && (
															<motion.div
																className={`clickerAnimation`}
																initial={{ opacity: 1, y: 0 }}
																animate={{ opacity: [1, 0], y: [-30, -120] }}
																exit={{ opacity: 0 }}
																transition={{ duration: 2 }}
																style={{
																	fontSize: '45px',
																	left: `${anim.x}px`,
																	top: `${anim.y}px`,
																	position: 'absolute',
																	color: boostPhase ? '#FFDA17' : 'white',
																	textShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
																}}
																onAnimationComplete={() => {
																	clearAnimations(index);
																}}
															>
																+{clickNewCoins}
															</motion.div>
														)}
													</AnimatePresence>
												))}
												<motion.img
													id='catGif'
													className='mainContent__catIdle'
													src={boostPhase ? goldForm : catIdle}
													draggable='false'
													alt='cat animation'
													animate={{ opacity: 1 }}
													initial={{ opacity: 0 }}
													transition={{ duration: 0.5 }}
												/>
											</div>
										) : (
											<div
												className='mainContent__catBox'
												id='coinClicker'
												onClick={isDesktop() ? coinClicker : null}
												onTouchStart={handleTouchStart}
												onTouchEnd={(e) => handleTouchEnd(e.touches[0], e)}
											>
												{animations.map((anim, index) => (
													<AnimatePresence key={index}>
														{isAnimationActive && (
															<motion.div
																className={`clickerAnimation`}
																initial={{ opacity: 1, y: 0 }}
																animate={{ opacity: [1, 0], y: [-30, -120] }}
																exit={{ opacity: 0 }}
																transition={{ duration: 2 }}
																style={{
																	fontSize: '45px',
																	left: `${anim.x}px`,
																	top: `${anim.y}px`,
																	position: 'absolute',
																	color: boostPhase ? '#FFDA17' : 'white',
																	textShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
																}}
																onAnimationComplete={() => {
																	clearAnimations(index);
																}}
															>
																+{clickNewCoins}
															</motion.div>
														)}
													</AnimatePresence>
												))}
												<motion.img
													id='catGif'
													className='mainContent__catMeow'
													src={boostPhase ? goldForm : catSpeak}
													draggable='false'
													alt='cat animation'
													animate={{ opacity: 1 }}
													initial={{ opacity: 0 }}
													transition={{ duration: 0.5 }}
												/>
											</div>
										)}
									</>
								)}
							</>
						)}
					</div>
					<div style={{ position: 'absolute' }}></div>
					<motion.div
						initial={{
							y: 70,
							rotate: 0,
						}}
						animate={{
							y: [0, 15, 0],
							rotate: [0, 2, -4, 0],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							repeatType: 'mirror',
							ease: 'easeInOut',
						}}
						style={{
							position: 'absolute',
							top: '340px',
							right: '140px',
							width: '100px',
						}}
					>
						{!gamePaused && timeRemaining <= 0 && (
							<div className='mainContent__tapCat'>
								<p>Tap the</p>
								<img src={smile} alt='cat icon' />
							</div>
						)}
					</motion.div>
					{!gamePaused && (
						<div className='mainContent__energyBox'>
							<div className='mainContent__energyContainer'>
								<img src={smile} alt='' />
								<div className='mainContent__energyValue'>
									<p className='energyCount' id='energyCount'>
										{user ? currEnergy : 0}
									</p>
									<span>/</span>
									<p className='maximumEnergy' id='maximumEnergy'>
										1000
									</p>
								</div>
							</div>
							<div className='mainContent__energyBar'>
								<progress
									className='filledBar'
									id='filledBar'
									max='1000'
									value={user ? currEnergy : 0}
								></progress>
							</div>
							<div className='mainContent__energyHint'>
								<p>
									The happier the cat — the more you get! Make it purr and get rewards
								</p>
							</div>
						</div>
					)}

					{!gamePaused && visible ? (
						<motion.div
							initial={{
								y: 7,
								rotate: 0,
								opacity: 1,
							}}
							animate={{
								y: [0, -10, 0],
								rotate: [0, 3, -7, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								repeatType: 'mirror',
								ease: 'easeInOut',
							}}
							style={{
								position: 'absolute',
								top: '50%',
								left: 0,
								zIndex: 1500,
							}}
						>
							<motion.div
								animate={{
									opacity: [0, 1],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									repeatType: 'mirror',
									ease: 'easeInOut',
								}}
							>
								<div
									className='boost-element'
									style={{
										position: 'absolute',
										overflow: 'hidden',
										left: `${position.x}px`,
										top: `${position.y}px`,
										cursor: 'pointer',
										width: '150px',
										height: '150px',
										borderRadius: '150px',
										zIndex: 1500,
										...(isMobile && {
											scale: '50%',
										}),
									}}
									onClick={boostClickedHandler}
								>
									<motion.img
										src={boostCoin}
										alt='Boost coin'
										style={{
											width: '100%',
											height: '100%',
											userSelect: 'none',
										}}
										initial={{ opacity: 0, rotate: 0 }}
										animate={{ opacity: 1, rotate: 360 }}
										transition={{
											duration: 4,
											repeat: Infinity,
											repeatType: 'mirror',
											ease: 'easeInOut',
										}}
									/>
								</div>
							</motion.div>
						</motion.div>
					) : null}
					{!gamePaused && (
						<div className='mainContent__coins'>
							<div className='mainContent__coinBox'>
								<div className='mainContent__coinImg' draggable='false'>
									<img src={catCoinMove} alt='coin animation' draggable='false' />
								</div>
								<div className='mainContent__coinAmount'>
									<span id='coinAmount'>{currCoins}</span>
								</div>
							</div>
						</div>
					)}

					{coinState && (
						<div className='mainContent__animation'>
							<div className='mainContent__coinOne'>
								<img src={catCoinMove} alt='' />
							</div>
							<div className='mainContent__coinTwo'>
								<img src={catCoinMove} alt='' />
							</div>
							<div className='mainContent__coinThree'>
								<img src={catCoinMove} alt='' />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Main;
