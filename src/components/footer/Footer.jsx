import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
// import checkbox from '../../img/checkbox.png';
import catCoin from '../../img/catcoin_gold.svg';
import pet from '../../img/pet_icon.svg';
import shop from '../../img/shop_icon.svg';
import tasks from '../../img/tasks_icon.svg';
import {
	useChangeWalletMutation,
	usePassDailyMutation,
	usePassPartnersMutation,
	usePassTaskMutation,
	useSetWalletMutation,
} from '../../services/phpService';
// import { toggleMuteAllSounds } from '../../utility/Audio';
// import taskTG from '../../img/task_TG.svg';
import taskImg from '../../img/task_twitter.png';
import taskWeb from '../../img/task_web.png';
import './Footer.scss';

const Footer = ({ user }) => {
	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;
	const [isVisible, setIsVisible] = useState(false);
	const [tasksOpen, setTasksOpen] = useState(false);
	const [passTask] = usePassTaskMutation();
	const [setWallet] = useSetWalletMutation();
	const [changeWallet] = useChangeWalletMutation();
	const [walletVaL, setWalletVal] = useState('');
	const [walletInputDisabled, setWalletInputDisabled] = useState(false);
	const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const [passDaily] = usePassDailyMutation();
	const [passPartners] = usePassPartnersMutation();
	const [errMsgVisible, setErrMsgVisible] = useState(false);
	const [errorText, setErrorText] = useState(
		'An error occurred. Please try again later.'
	);

	const [inputFirst, setInputFirst] = useState(true);
	const [inputSecond, setInputSecond] = useState(false);

	const toggleFirst = () => {
		setInputFirst(true);
		setInputSecond(false);
	};

	const toggleSecond = () => {
		setInputFirst(false);
		setInputSecond(true);
	};

	const dailyTasksObj = user?.daily_quests;
	const partnerTaskObj = user?.partners_quests;

	const [twitterQuest, setTwitterQuest] = useState(user?.twitter);
	const [tgChatQuest, setTgChatQuest] = useState(user?.tg_chat);
	const [tgChannelQuest, setTgChannelQuest] = useState(user?.tg_channel);
	const [websiteQuest, setWebsiteQuest] = useState(user?.website);
	const [dailyQuests, setDailyQuests] = useState(dailyTasksObj);
	const [partnerQuests, setPartnerQuests] = useState(partnerTaskObj);

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	useEffect(() => {
		setTwitterQuest(user?.twitter);
		setTgChatQuest(user?.tg_chat);
		setTgChannelQuest(user?.tg_channel);
		setWebsiteQuest(user?.website);
		setPartnerQuests(partnerTaskObj);
		setDailyQuests(dailyTasksObj);
	}, [user]);

	const popupTasksTgl = tasksOpen ? 'popupTasks_show' : null;
	const popupTasks = `popupTasks ${popupTasksTgl}`;

	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Etc/GMT-3',
	};
	const now = new Date();
	const dateStringWithTime = now.toLocaleString('en-GB', options);

	useEffect(() => {
		if (!user?.wallet_address) {
			toggleFirst();
		} else {
			toggleSecond();
			setWalletVal(user?.wallet_address);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				// Get the current time in Frankfurt time zone ('Etc/GMT-3')
				const currentTimeStamp = moment.tz('Etc/GMT-3').unix();
				const remainingTime = user?.update_wallet_at - currentTimeStamp;
				if (remainingTime >= 0) {
					if (remainingTime <= 0) {
						setResetBtnDisabled(false);
					} else {
						setResetBtnDisabled(true);
						setWalletInputDisabled(true);
					}
				}
			};

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
			};
		}
	}, [user]);

	const resetWalletEnabler = () => {
		setWalletInputDisabled(false);
		setWalletVal('');
		toggleFirst();
	};

	const tasksBtn = () => {
		setTasksOpen(true);
		fadeShow();
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.add('popupTasks-show');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (footerTag) footerTag.classList.add('show-blur');
		if (bgTag) bgTag.classList.add('h100');
	};

	const tasksCloseToggler = () => {
		setTasksOpen(false);
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.remove('popupTasks-show');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (footerTag) footerTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
	};

	const errorCloseToggler = () => {
		setErrMsgVisible(false);
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.remove('show-blur');
		// const footerTag = document.getElementById('footer');
		// if (footerTag) footerTag.classList.remove('show-blur');
	};

	// const toggleVisibility = () => {
	// 	toggleMuteAllSounds();
	// 	setIsVisible(!isVisible);
	// };

	const walletSubmitHandler = () => {
		if (!user?.wallet_address) {
			submitWallet();
		} else {
			resetWallet();
		}
	};

	const twitterClick = async () => {
		tg.openLink('https://twitter.com/TomoCatSol');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'twitter',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTwitterQuest(1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const tgClickChat = async () => {
		tg.openLink('https://t.me/tomocat_sol');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_chat',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTgChatQuest(1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const tgClickChannel = async () => {
		tg.openLink('https://t.me/tomo_cat');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_channel',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTgChannelQuest(1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const websiteClick = async () => {
		tg.openLink('https://tomocat.com/');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'website',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setWebsiteQuest(1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const blurPopupTasks = () => {
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.add('show-blur');
		const footerTag = document.getElementById('footer');
		if (footerTag) footerTag.classList.add('show-blur');
	};

	const submitWallet = async () => {
		if (walletVaL) {
			try {
				const res = await setWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: walletVaL,
					id_telegram: user?.id_telegram,
				}).unwrap();
				setResetBtnDisabled(true);
				setWalletInputDisabled(true);
				setErrorText('Wallet submitted successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
				toggleSecond();
			} catch (e) {
				setErrorText('This wallet is already in use.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		}
	};

	const resetWallet = async () => {
		if (walletVaL) {
			try {
				const res = await changeWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: walletVaL,
					user_id: user?.id,
				}).unwrap();
				setResetBtnDisabled(true);
				setWalletInputDisabled(true);
				setErrorText('Wallet changed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
				toggleSecond();
			} catch (e) {
				setErrorText('This wallet is already in use.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		}
	};

	const passDailyHandler = async (taskId, link) => {
		if (link !== null) {
			tg.openLink(link);
		}
		try {
			await passDaily({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				daily_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updateDailyQStatus(taskId, 1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const updateDailyQStatus = (taskId, status) => {
		// Update the quest status in state
		setDailyQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	const partnersTaskHandler = async (taskId, link) => {
		if (link !== null) {
			tg.openLink(link);
		}
		try {
			await passPartners({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				partners_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updatePartnerQStatus(taskId, 1);
				setErrorText('Task completed successfully.');
				setErrMsgVisible(true);
				blurPopupTasks();
			} else {
				setErrorText('An error occurred. Please try again later.');
				setErrMsgVisible(true);
				blurPopupTasks();
			}
		} catch (e) {
			setErrorText('An error occurred. Please try again later.');
			setErrMsgVisible(true);
			blurPopupTasks();
		}
	};

	const updatePartnerQStatus = (taskId, status) => {
		// Update the quest status in state
		setPartnerQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	return (
		<>
			<footer id='footer' className='footerMain'>
				<div className='footerMain__container'>
					{/* <div className='soundToggler'>
						{isVisible ? (
							<div className='soundToggler__itemOn' onClick={toggleVisibility}>
								<button>
									<svg
										width='23'
										height='19'
										viewBox='0 0 23 19'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M19.697 4.80667C19.697 4.80667 21.2996 6.37109 21.2996 8.97844C21.2996 11.5858 19.697 13.1502 19.697 13.1502'
											stroke='white'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
										<path
											d='M1 11.4367V7.56325C1 7.01003 1.22512 6.47948 1.62584 6.0883C2.02656 5.69712 2.57006 5.47736 3.13676 5.47736H6.23507C6.44396 5.47731 6.64825 5.41748 6.82267 5.30527L13.233 1.17939C13.394 1.07585 13.5808 1.01679 13.7735 1.00849C13.9661 1.00019 14.1575 1.04295 14.3273 1.13223C14.497 1.22152 14.6389 1.354 14.7378 1.51563C14.8367 1.67725 14.8889 1.86199 14.8889 2.05025V16.9497C14.8889 17.138 14.8367 17.3227 14.7378 17.4844C14.6389 17.646 14.497 17.7785 14.3273 17.8677C14.1575 17.957 13.9661 17.9998 13.7735 17.9915C13.5808 17.9832 13.394 17.9241 13.233 17.8206L6.82267 13.6947C6.64825 13.5825 6.44396 13.5227 6.23507 13.5226H3.13676C2.57006 13.5226 2.02656 13.3029 1.62584 12.9117C1.22512 12.5205 1 11.9899 1 11.4367Z'
											stroke='white'
											strokeWidth='2'
										/>
									</svg>
								</button>
							</div>
						) : (
							<div className='soundToggler__itemOff' onClick={toggleVisibility}>
								<button>
									<svg
										width='26'
										height='19'
										viewBox='0 0 26 19'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M20.1947 11.5865L22.2812 9.50001M22.2812 9.50001L24.3677 7.41351M22.2812 9.50001L20.1947 7.41351M22.2812 9.50001L24.3677 11.5865'
											stroke='white'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
										<path
											d='M1.6322 11.4373V7.56269C1.6322 7.00932 1.85203 6.47861 2.24332 6.08732C2.63462 5.69602 3.16533 5.4762 3.7187 5.4762H6.74412C6.9481 5.47614 7.14758 5.4163 7.31791 5.30406L13.5774 1.17697C13.7347 1.0734 13.917 1.01432 14.1052 1.00602C14.2933 0.997715 14.4802 1.04049 14.646 1.1298C14.8118 1.21911 14.9503 1.35163 15.0468 1.5133C15.1434 1.67497 15.1944 1.85977 15.1944 2.04808V16.9519C15.1944 17.1402 15.1434 17.325 15.0468 17.4867C14.9503 17.6484 14.8118 17.7809 14.646 17.8702C14.4802 17.9595 14.2933 18.0023 14.1052 17.994C13.917 17.9857 13.7347 17.9266 13.5774 17.823L7.31791 13.6959C7.14758 13.5837 6.9481 13.5239 6.74412 13.5238H3.7187C3.16533 13.5238 2.63462 13.304 2.24332 12.9127C1.85203 12.5214 1.6322 11.9907 1.6322 11.4373Z'
											stroke='white'
											strokeWidth='2'
										/>
									</svg>
								</button>
							</div>
						)}
					</div> */}
					<div className='footerMain__activities'>
						<div className='footerMain__activitiesBtn'>
							<button onClick={tasksBtn}>
								<img src={tasks} />
								<span>Tasks</span>
							</button>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<img src={pet} />
								Pet
								<span>Coming soon</span>
							</button>
							{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<img src={shop} />
								Shop
								<span>Coming soon</span>
							</button>
							{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
						</div>
					</div>
				</div>
			</footer>
			{tasksOpen && (
				<div id='popupTasks' aria-hidden='true' className={popupTasks}>
					<div className='popupTasks__wrapper'>
						<div className='popupTasks__content'>
							<button
								onClick={tasksCloseToggler}
								type='button'
								className='popupTasks__close'
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clip-path='url(#clip0_5186_2444)'>
										<path
											d='M12 0C9.62663 0 7.30655 0.703787 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519945 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693604 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9962 8.81855 22.7308 5.76849 20.4811 3.51886C18.2315 1.26924 15.1814 0.00375324 12 0ZM16.6276 15.0862C16.7318 15.1868 16.8149 15.3072 16.8721 15.4403C16.9293 15.5734 16.9594 15.7165 16.9606 15.8614C16.9619 16.0062 16.9343 16.1499 16.8794 16.2839C16.8246 16.418 16.7436 16.5398 16.6412 16.6422C16.5387 16.7447 16.4169 16.8257 16.2829 16.8805C16.1488 16.9354 16.0051 16.963 15.8603 16.9617C15.7154 16.9605 15.5723 16.9304 15.4392 16.8732C15.3061 16.816 15.1857 16.7329 15.0851 16.6287L12 13.5425L8.91491 16.6287C8.70916 16.8274 8.4336 16.9374 8.14756 16.9349C7.86153 16.9324 7.58792 16.8177 7.38566 16.6154C7.18339 16.4132 7.06866 16.1396 7.06618 15.8535C7.06369 15.5675 7.17365 15.2919 7.37237 15.0862L10.4575 12L7.37237 8.91382C7.26817 8.81318 7.18507 8.69281 7.12789 8.55971C7.07072 8.42662 7.04063 8.28347 7.03937 8.13862C7.03811 7.99377 7.06571 7.85012 7.12056 7.71605C7.17541 7.58198 7.25642 7.46018 7.35884 7.35775C7.46127 7.25532 7.58308 7.17432 7.71714 7.11947C7.85121 7.06461 7.99486 7.03701 8.13971 7.03827C8.28456 7.03953 8.42771 7.06962 8.56081 7.1268C8.6939 7.18397 8.81428 7.26708 8.91491 7.37127L12 10.4575L15.0851 7.37127C15.1857 7.26708 15.3061 7.18397 15.4392 7.1268C15.5723 7.06962 15.7154 7.03953 15.8603 7.03827C16.0051 7.03701 16.1488 7.06461 16.2829 7.11947C16.4169 7.17432 16.5387 7.25532 16.6412 7.35775C16.7436 7.46018 16.8246 7.58198 16.8794 7.71605C16.9343 7.85012 16.9619 7.99377 16.9606 8.13862C16.9594 8.28347 16.9293 8.42662 16.8721 8.55971C16.8149 8.69281 16.7318 8.81318 16.6276 8.91382L13.5425 12L16.6276 15.0862Z'
											fill='white'
											fill-opacity='0.2'
										/>
									</g>
									<defs>
										<clipPath id='clip0_5186_2444'>
											<rect width='24' height='24' fill='white' />
										</clipPath>
									</defs>
								</svg>
							</button>
							<div className='popupTasks__title'>
								<h4>Complete tasks and get rewarded!</h4>
							</div>
							<div className='popupTasks__coins'>
								<div className='popupTasks__coinBox'>
									{user?.wallet_balance && (
										<>
											<div className='popupTasks__coinImg' draggable='false'>
												<img src={catCoin} alt='animation' draggable='false' />
											</div>
											<div className='popupTasks__coinAmount'>
												<span id='coinAmount'>{user?.wallet_balance}</span>
											</div>
										</>
									)}
								</div>
							</div>
							<div className='popupTasks__tabs-btns'>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 0 ? 'active' : ''}`}
									onClick={() => handleTabClick(0)}
								>
									<button>Social</button>
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 1 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(1)
											: () => {
													setErrorText('Submit your wallet first.');
													setErrMsgVisible(true);
													blurPopupTasks();
											  }
									}
								>
									<button>Daily</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 2 ? 'active' : ''}`}
									// onClick={
									// 	user?.wallet_address
									// 		? () => handleTabClick(2)
									// 		: () => {
									// 				setErrorText('Submit your wallet first.');
									// 				setErrMsgVisible(true);
									// 				blurPopupTasks();
									// 		  }
									// }
								>
									<button>Partnership</button>
									<div className='footerMain__activitiesHint'>Coming Soon</div>
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 0 ? 'active' : ''}`}>
								<div className='popupTasks__walletTask'>
									{inputFirst && (
										<>
											<div className='popupTasks__walletTask-title'>
												<span>Enter your wallet</span>
											</div>
											<div className='popupTasks__walletTask-input'>
												<input
													type='text'
													placeholder='Enter Solana Wallet Address'
													style={{
														background: 'transparent',
														color: '#fff',
														fontSize: '0.75rem!important',
													}}
													value={walletVaL}
													onChange={(e) => setWalletVal(e.target.value)}
													disabled={walletInputDisabled === true}
												/>
												<button
													className='popupTasks__walletTask-inputBtn'
													onClick={walletSubmitHandler}
													// disabled={walletInputDisabled === true}
												>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M10.7071 6.29289C10.3166 5.90237 9.6834 5.90237 9.29289 6.29289C8.90237 6.6834 8.90237 7.31659 9.29289 7.70711L13.5858 12L9.29289 16.2929C8.90237 16.6834 8.90237 17.3166 9.29289 17.7071C9.6834 18.0977 10.3166 18.0977 10.7071 17.7071L15.7071 12.7071C16.0976 12.3166 16.0976 11.6834 15.7071 11.2929L10.7071 6.29289Z'
															fill='white'
														/>
													</svg>
												</button>
											</div>
										</>
									)}
									{inputSecond && (
										<>
											<div className='popupTasks__walletTask-title'>
												<span>Current wallet</span>
											</div>
											<div className='popupTasks__walletTask-input'>
												<input
													type='text'
													style={{
														background: 'transparent',
														color: '#fff',
														fontSize: '0.75rem!important',
													}}
													value={walletVaL}
													disabled
												/>
												<button
													onClick={resetWalletEnabler}
													disabled={resetBtnDisabled === true}
												>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_5228_4127)'>
															<path
																d='M21.5966 4.90886C19.3742 2.00582 15.9949 0.34082 12.3252 0.34082C9.74522 0.34082 7.2987 1.16969 5.24998 2.73793C4.50871 3.30544 3.83811 3.96166 3.2543 4.68594L2.73374 1.73736C2.67675 1.41491 2.36892 1.19925 2.04678 1.25656L0.48984 1.53135C0.334977 1.5587 0.197346 1.64645 0.107148 1.77523C0.0169488 1.90408 -0.0183086 2.06337 0.00904354 2.21824L1.2459 9.22457C1.29673 9.51217 1.54685 9.71454 1.82907 9.71454C1.8633 9.71454 1.898 9.71154 1.93286 9.70537L8.93928 8.46852C9.26173 8.4116 9.47699 8.10408 9.42008 7.78163L9.14521 6.22469C9.11786 6.06983 9.03019 5.9322 8.90133 5.842C8.77248 5.7518 8.61319 5.71662 8.45832 5.7439L5.53868 6.25932C5.94936 5.77393 6.41419 5.33116 6.9319 4.93487C8.49413 3.73905 10.3597 3.10702 12.327 3.10702C15.1269 3.10702 17.7048 4.37684 19.3997 6.59078C20.8437 8.47697 21.4666 10.8127 21.1539 13.1675C20.8411 15.5224 19.63 17.6145 17.7437 19.0584C16.1771 20.2577 14.3144 20.8916 12.3572 20.8916C11.9622 20.8916 11.5618 20.865 11.1669 20.8126C8.81208 20.4999 6.71996 19.2889 5.27599 17.4025C4.39708 16.2545 3.80641 14.8998 3.56775 13.485C3.54158 13.33 3.45486 13.1917 3.32672 13.1005C3.19865 13.0094 3.03944 12.973 2.88442 12.999L1.32542 13.262C1.00257 13.3165 0.785022 13.6224 0.83941 13.9453C1.15269 15.8026 1.92709 17.5797 3.07897 19.0844C4.97211 21.5575 7.71515 23.1453 10.8025 23.5554C11.3191 23.624 11.8433 23.6588 12.3605 23.6588C14.9286 23.6588 17.3716 22.8276 19.4253 21.2554C21.8985 19.3623 23.4863 16.6192 23.8964 13.5317C24.3067 10.4443 23.4899 7.38194 21.5966 4.90886Z'
																fill='white'
															/>
														</g>
														<defs>
															<clipPath id='clip0_5228_4127'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
												</button>
												{/* <button className='popupTasks__walletTask-inputBtn' disabled>
												<svg
													width='15'
													height='13'
													viewBox='0 0 13 11'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M0 5.25832C0 5.04901 0.0838528 4.84827 0.233109 4.70027C0.382367 4.55226 0.584803 4.46911 0.795883 4.46911L10.1205 4.46911L6.63236 1.37437C6.47645 1.23446 6.38271 1.03904 6.37162 0.830819C6.36053 0.622593 6.433 0.418478 6.57319 0.263061C6.71338 0.107645 6.9099 0.0135581 7.11982 0.00135409C7.32974 -0.0108499 7.53599 0.0598205 7.69354 0.197928L12.7341 4.6701C12.8178 4.74413 12.8847 4.83485 12.9305 4.93631C12.9763 5.03777 13 5.14768 13 5.25885C13 5.37001 12.9763 5.47993 12.9305 5.58139C12.8847 5.68285 12.8178 5.77356 12.7341 5.8476L7.69354 10.3198C7.61575 10.3896 7.52482 10.4434 7.42597 10.4783C7.32712 10.5131 7.2223 10.5282 7.11754 10.5227C7.01278 10.5172 6.91015 10.4913 6.81554 10.4463C6.72094 10.4013 6.63623 10.3383 6.56629 10.2608C6.49636 10.1832 6.44256 10.0927 6.40802 9.99451C6.37347 9.89629 6.35884 9.79226 6.36498 9.68841C6.37112 9.58457 6.39791 9.48295 6.44379 9.3894C6.48968 9.29585 6.55376 9.21222 6.63236 9.14332L10.1205 6.04753L0.795883 6.04753C0.584803 6.04753 0.382367 5.96438 0.233109 5.81637C0.0838528 5.66837 0 5.46763 0 5.25832Z'
														fill='white'
													/>
												</svg>
											</button> */}
											</div>
										</>
									)}

									<div className='popupTasks__walletTask-box'>
										<div className='popupTasks__walletTask-right'>
											<div className='popupTasks__walletTask-rightHint'>
												<span>*it can be done once every 3 days</span>
											</div>
										</div>
										{!user?.wallet_address ? (
											<div className='popupTasks__walletTask-left'>
												<p>+20000</p>
											</div>
										) : (
											''
										)}
									</div>
								</div>
								<div className='popupTasks__task'>
									<button onClick={twitterClick} disabled={twitterQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={taskImg} />
											<svg
												width='22'
												height='22'
												viewBox='0 0 22 22'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5228_3816)'>
													<path
														d='M0.5 11C0.5 5.20122 5.20122 0.5 11 0.5C16.7988 0.5 21.5 5.20122 21.5 11C21.5 16.7988 16.7988 21.5 11 21.5C5.20122 21.5 0.5 16.7988 0.5 11Z'
														fill='black'
														stroke='white'
													/>
													<path
														d='M12.2033 10.0045L16.9123 4.53076H15.7964L11.7076 9.28359L8.4419 4.53076H4.67529L9.61367 11.7179L4.67529 17.458H5.79123L10.1091 12.4388L13.5579 17.458H17.3245L12.203 10.0045H12.2033ZM6.19331 5.37083H7.90732L15.7969 16.6561H14.0829L6.19331 5.37083Z'
														fill='white'
													/>
												</g>
												<defs>
													<clipPath id='clip0_5228_3816'>
														<rect width='22' height='22' fill='white' />
													</clipPath>
												</defs>
											</svg>
										</div>
										Follow Twitter
										{user?.twitter === 0 ? (
											<p>+10000 </p>
										) : (
											// <svg
											// 	width='24'
											// 	height='24'
											// 	viewBox='0 0 24 24'
											// 	fill='none'
											// 	xmlns='http://www.w3.org/2000/svg'
											// >
											// 	<path
											// 		d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
											// 		fill='white'
											// 	/>
											// </svg>
											// <svg
											// 	width='24'
											// 	height='24'
											// 	viewBox='0 0 24 24'
											// 	fill='none'
											// 	xmlns='http://www.w3.org/2000/svg'
											// >
											// 	<path
											// 		d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linejoin='round'
											// 	/>
											// 	<path
											// 		d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linecap='round'
											// 		stroke-linejoin='round'
											// 	/>
											// </svg>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5186_2457)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='url(#paint0_linear_5186_2457)'
													/>
												</g>
												<defs>
													<linearGradient
														id='paint0_linear_5186_2457'
														x1='1.0739e-06'
														y1='-6.78261'
														x2='31.4402'
														y2='1.97004'
														gradientUnits='userSpaceOnUse'
													>
														<stop stop-color='#CAFFD6' />
														<stop offset='1' stop-color='#1EE261' />
													</linearGradient>
													<clipPath id='clip0_5186_2457'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChat} disabled={tgChatQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={taskImg} />
											<svg
												width='22'
												height='22'
												viewBox='0 0 22 22'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z'
													fill='#039BE5'
												/>
												<path
													d='M5.03292 10.7609L15.6388 6.67163C16.131 6.4938 16.5609 6.79171 16.4014 7.53605L16.4023 7.53513L14.5965 16.0427C14.4627 16.6459 14.1043 16.7925 13.6028 16.5084L10.8528 14.4816L9.52642 15.7595C9.37976 15.9061 9.25601 16.0299 8.97184 16.0299L9.16709 13.2313L14.2638 8.62688C14.4856 8.43163 14.2143 8.32163 13.9218 8.51596L7.62343 12.4815L4.90826 11.6345C4.31884 11.4475 4.30601 11.045 5.03292 10.7609Z'
													fill='white'
												/>
											</svg>
										</div>
										Follow TG Chat
										{user?.tg_chat === 0 ? (
											<p>+10000 </p>
										) : (
											// <svg
											// 	width='24'
											// 	height='24'
											// 	viewBox='0 0 24 24'
											// 	fill='none'
											// 	xmlns='http://www.w3.org/2000/svg'
											// >
											// 	<path
											// 		d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linejoin='round'
											// 	/>
											// 	<path
											// 		d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linecap='round'
											// 		stroke-linejoin='round'
											// 	/>
											// </svg>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5186_2457)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='url(#paint0_linear_5186_2457)'
													/>
												</g>
												<defs>
													<linearGradient
														id='paint0_linear_5186_2457'
														x1='1.0739e-06'
														y1='-6.78261'
														x2='31.4402'
														y2='1.97004'
														gradientUnits='userSpaceOnUse'
													>
														<stop stop-color='#CAFFD6' />
														<stop offset='1' stop-color='#1EE261' />
													</linearGradient>
													<clipPath id='clip0_5186_2457'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChannel} disabled={tgChannelQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={taskImg} />
											<svg
												width='22'
												height='22'
												viewBox='0 0 22 22'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z'
													fill='#039BE5'
												/>
												<path
													d='M5.03292 10.7609L15.6388 6.67163C16.131 6.4938 16.5609 6.79171 16.4014 7.53605L16.4023 7.53513L14.5965 16.0427C14.4627 16.6459 14.1043 16.7925 13.6028 16.5084L10.8528 14.4816L9.52642 15.7595C9.37976 15.9061 9.25601 16.0299 8.97184 16.0299L9.16709 13.2313L14.2638 8.62688C14.4856 8.43163 14.2143 8.32163 13.9218 8.51596L7.62343 12.4815L4.90826 11.6345C4.31884 11.4475 4.30601 11.045 5.03292 10.7609Z'
													fill='white'
												/>
											</svg>
										</div>
										Follow TG Channel
										{user?.tg_channel === 0 ? (
											<p>+10000 </p>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5186_2457)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='url(#paint0_linear_5186_2457)'
													/>
												</g>
												<defs>
													<linearGradient
														id='paint0_linear_5186_2457'
														x1='1.0739e-06'
														y1='-6.78261'
														x2='31.4402'
														y2='1.97004'
														gradientUnits='userSpaceOnUse'
													>
														<stop stop-color='#CAFFD6' />
														<stop offset='1' stop-color='#1EE261' />
													</linearGradient>
													<clipPath id='clip0_5186_2457'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={websiteClick} disabled={websiteQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={taskWeb} />
										</div>
										Visit Website
										{user?.website === 0 ? (
											<p>+3000 </p>
										) : (
											// <svg
											// 	width='24'
											// 	height='24'
											// 	viewBox='0 0 24 24'
											// 	fill='none'
											// 	xmlns='http://www.w3.org/2000/svg'
											// >
											// 	<path
											// 		d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linejoin='round'
											// 	/>
											// 	<path
											// 		d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
											// 		stroke='white'
											// 		stroke-width='2'
											// 		stroke-linecap='round'
											// 		stroke-linejoin='round'
											// 	/>
											// </svg>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5186_2457)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='url(#paint0_linear_5186_2457)'
													/>
												</g>
												<defs>
													<linearGradient
														id='paint0_linear_5186_2457'
														x1='1.0739e-06'
														y1='-6.78261'
														x2='31.4402'
														y2='1.97004'
														gradientUnits='userSpaceOnUse'
													>
														<stop stop-color='#CAFFD6' />
														<stop offset='1' stop-color='#1EE261' />
													</linearGradient>
													<clipPath id='clip0_5186_2457'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 1 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{dailyQuests && dailyQuests.length > 0 && (
									<>
										{dailyQuests.map((quest) => (
											<div className='popupTasks__task' key={quest.id}>
												{/* Conditionally render button or div */}
												{quest.required_amount === 0 && quest.required_referrals === 0 ? (
													<button
														disabled={quest.status === 1}
														onClick={() =>
															passDailyHandler(quest.id, quest.daily_quest.link)
														}
													>
														<span>{quest.daily_quest.name}</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																+{quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoin}
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												) : (
													<button
														disabled={quest.status === 1}
														style={
															quest.required_amount > 0 || quest.required_referrals > 0
																? { paddingBottom: '24px' }
																: {}
														}
													>
														<span>{quest.daily_quest.name}</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																+{quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoin}
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												)}
												{(quest.required_amount > 0 || quest.required_referrals > 0) && (
													<div className='popupTasks__progressBar'>
														<progress
															max={quest.required_amount || quest.required_referrals}
															value={quest.amount || quest.referrals}
														></progress>
													</div>
												)}
											</div>
										))}
									</>
								)}
							</div>
							<div className={`popupTasks__tasks ${activeTab === 2 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{partnerQuests && partnerQuests.length > 0 && (
									<>
										{partnerQuests
											.filter((quest) => quest.partners_quest.vis === 1)
											.map((quest) => (
												<div className='popupTasks__task'>
													<button
														disabled={quest.status === 1}
														onClick={() =>
															partnersTaskHandler(quest.id, quest.partners_quest.link)
														}
													>
														<span>{quest.partners_quest.name}</span>
														{quest.status === 0 ? (
															<div>
																+ {quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoin}
																	alt='animation'
																	draggable='false'
																/>
															</div>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												</div>
											))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{errMsgVisible && (
				<div id='popupError' aria-hidden='true' className='popupError'>
					<div className='popupError__wrapper'>
						<div className='popupError__content'>
							<button
								onClick={errorCloseToggler}
								type='button'
								className='popupError__close'
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clip-path='url(#clip0_5186_2444)'>
										<path
											d='M12 0C9.62663 0 7.30655 0.703787 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519945 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693604 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9962 8.81855 22.7308 5.76849 20.4811 3.51886C18.2315 1.26924 15.1814 0.00375324 12 0ZM16.6276 15.0862C16.7318 15.1868 16.8149 15.3072 16.8721 15.4403C16.9293 15.5734 16.9594 15.7165 16.9606 15.8614C16.9619 16.0062 16.9343 16.1499 16.8794 16.2839C16.8246 16.418 16.7436 16.5398 16.6412 16.6422C16.5387 16.7447 16.4169 16.8257 16.2829 16.8805C16.1488 16.9354 16.0051 16.963 15.8603 16.9617C15.7154 16.9605 15.5723 16.9304 15.4392 16.8732C15.3061 16.816 15.1857 16.7329 15.0851 16.6287L12 13.5425L8.91491 16.6287C8.70916 16.8274 8.4336 16.9374 8.14756 16.9349C7.86153 16.9324 7.58792 16.8177 7.38566 16.6154C7.18339 16.4132 7.06866 16.1396 7.06618 15.8535C7.06369 15.5675 7.17365 15.2919 7.37237 15.0862L10.4575 12L7.37237 8.91382C7.26817 8.81318 7.18507 8.69281 7.12789 8.55971C7.07072 8.42662 7.04063 8.28347 7.03937 8.13862C7.03811 7.99377 7.06571 7.85012 7.12056 7.71605C7.17541 7.58198 7.25642 7.46018 7.35884 7.35775C7.46127 7.25532 7.58308 7.17432 7.71714 7.11947C7.85121 7.06461 7.99486 7.03701 8.13971 7.03827C8.28456 7.03953 8.42771 7.06962 8.56081 7.1268C8.6939 7.18397 8.81428 7.26708 8.91491 7.37127L12 10.4575L15.0851 7.37127C15.1857 7.26708 15.3061 7.18397 15.4392 7.1268C15.5723 7.06962 15.7154 7.03953 15.8603 7.03827C16.0051 7.03701 16.1488 7.06461 16.2829 7.11947C16.4169 7.17432 16.5387 7.25532 16.6412 7.35775C16.7436 7.46018 16.8246 7.58198 16.8794 7.71605C16.9343 7.85012 16.9619 7.99377 16.9606 8.13862C16.9594 8.28347 16.9293 8.42662 16.8721 8.55971C16.8149 8.69281 16.7318 8.81318 16.6276 8.91382L13.5425 12L16.6276 15.0862Z'
											fill='white'
											fill-opacity='0.2'
										/>
									</g>
									<defs>
										<clipPath id='clip0_5186_2444'>
											<rect width='24' height='24' fill='white' />
										</clipPath>
									</defs>
								</svg>
							</button>
							<div className='popupError__title'>
								<h4>{errorText}</h4>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Footer;
