import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { GameInfoContext } from '../../helpers/context';
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
import goldIdle from '../../img/goldIdle.gif';
import smile from '../../img/smile.png';
import { useUpdateBalanceMutation } from '../../services/phpService';
import { playBoostCatClick, playSadCatClick } from '../../utility/Audio';
import './Main.scss';

const Main = ({ user }) => {
	const { state } = useContext(GameInfoContext);

	const isMedia = useMediaQuery({ maxWidth: '1439.98px' });
	const [currentImage, setCurrentImage] = useState(true);
	const [coinState, setCoinState] = useState(false);
	const [currCoins, setCurrCoins] = useState(0);
	const [currEnergy, setCurrEnergy] = useState(user?.energy);
	const [isCoinsChanged, setIsCoinsChanged] = useState(false);
	const [catIdle, setCatIdle] = useState(sadIdle);
	const [catSpeak, setCatSpeak] = useState(sadSpeak);
	const timeoutRef = useRef(null);
	const coinRef = useRef(null);
	const accumulatedCoinsRef = useRef(0);
	const [updateBalance] = useUpdateBalanceMutation();
	const [position, setPosition] = useState({ x: '0', y: '0' });
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

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	const secretURL = process.env.REACT_APP_SECRET_URL;
	const testURL = process.env.REACT_APP_TEST_URL;

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
			timeZone: 'Etc/GMT-3',
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);

		fetch(testURL + '/api/set-activity', {
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
		if (user) setCurrEnergy(user?.energy);
	}, [user]);

	useEffect(() => {
		let timeoutId;

		if (currEnergy >= 1000) {
			submitData();
			timeoutId = setTimeout(() => {
				pauseGame();
				setCatVisible(false);
			}, 100);
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [currEnergy]);

	// const getGameStatus = async () => {
	// 	try {
	// 		const initGameStatusCheck = await axios.get(
	// 			testURL + `/api/telegram-id/${userId}`
	// 		);
	// 	} catch (e) {
	// 		console.log('Error fetching leaderboard data');
	// 	}
	// };

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				// Get the current time in Frankfurt time zone ('Etc/GMT-3')
				const currentTimeStamp = moment.tz('Etc/GMT-3').unix();
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

			// getGameStatus();

			// const timeout = setTimeout(() => {
			// 	getGameStatus();
			// }, 1000);

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
				// clearTimeout(timeout);
			};
		}
	}, [userId, user]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	let catIdleImage = catIdle;
	let catSpeakImage = catSpeak;

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

	const mainRef = useRef(null);

	const positions = [
		{ x: 100, y: -250 },
		{ x: 100, y: -200 },
		{ x: 100, y: -150 },
		{ x: 100, y: -100 },
		{ x: 100, y: -50 },
		{ x: 100, y: 0 },
		{ x: -50, y: -250 },
		{ x: -50, y: -200 },
		{ x: -50, y: -150 },
		{ x: -50, y: -100 },
		{ x: -50, y: -50 },
		{ x: -50, y: 0 },
		{ x: 210, y: -250 },
		{ x: 210, y: -200 },
		{ x: 210, y: -150 },
		{ x: 210, y: -100 },
		{ x: 210, y: -50 },
		{ x: 210, y: 0 },
	];

	const randomizePosition = () => {
		const randomIndex = Math.floor(Math.random() * positions.length);
		const { x, y } = positions[randomIndex];
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
		let showBoostTimeout;
		let hideBoostTimeout;

		if (!gamePaused) {
			if (!visible) {
				randomizePosition();
				showBoostTimeout = setTimeout(() => {
					randomizePosition();
					setVisible(true);
				}, Math.random() * (30000 - 13000) + 13000);
			} else {
				hideBoostTimeout = setTimeout(() => {
					setVisible(false);
				}, 8300);
			}
		}

		return () => {
			clearTimeout(showBoostTimeout);
			clearTimeout(hideBoostTimeout);
		};
	}, [visible, gamePaused]);

	const [bgImages] = useState({
		bgImageFirst: 'img/bgFirst.webp',
		bgImageSecond: 'img/bgSecond.webp',
		bgImageThird: 'img/bgThird.webp',
		bgImageFourth: 'img/bgFourth.webp',
		bgImageFives: 'img/bgFives.webp',
	});

	let activeImage = bgImages.bgImageFirst;
	let opacityFirst = 1;
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
		}, 3500);

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
			timeZone: 'Etc/GMT-3',
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
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + happinessVal, 1000));
		clearTimeout(timeoutRef.current);
		clearTimeout(coinRef.current);
		timeoutRef.current = setTimeout(() => setCurrentImage(true), 1100);
		coinRef.current = setTimeout(() => setCoinState(false), 4000);

		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
	};

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
				id='bgImage'
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFirst})`,
					opacity: opacityFirst,
				}}
			></div>
			<div
				id='bgImage'
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageSecond})`,
					opacity: opacitySecond,
				}}
			></div>
			<div
				id='bgImage'
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageThird})`,
					opacity: opacityThird,
				}}
			></div>
			<div
				id='bgImage'
				className='bgImage'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFourth})`,
					opacity: opacityFourth,
				}}
			></div>
			<div
				id='bgImage'
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
									<p
										style={{
											fontSize: '22px',
											textAlign: 'center',
											alignContent: 'center',
										}}
									>
										Time remaining: {formatTime(timeRemaining)} minutes
									</p>
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
									Tomo is tired, come back when timer is over.
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
													src={boostPhase ? goldIdle : catIdle}
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
										{currEnergy}
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
									value={currEnergy}
								></progress>
							</div>
							<div className='mainContent__energyHint'>
								<p>{state?.info.mainContent__energyHint}</p>
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
										...(isMedia && {
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
