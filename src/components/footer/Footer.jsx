import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import catCoinMove from '../../img/cat_coin_move.png';
import checkbox from '../../img/checkbox.png';
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
import { toggleMuteAllSounds } from '../../utility/Audio';
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
	const [resetBtnDisabled, setResetBtnDisabled] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [passDaily] = usePassDailyMutation();
	const [passPartners] = usePassPartnersMutation();
	const [errMsgVisible, setErrMsgVisible] = useState(false);
	const [errorText, setErrorText] = useState(
		'An error occurred. Please try again later.'
	);

	const dailyTasksObj = user?.daily_quests;
	const partnerTaskObj = user?.partners_quests;

	const [twitterQuest, setTwitterQuest] = useState(user?.twitter);
	const [tgChatQuest, setTgChatQuest] = useState(user?.tg_chat);
	const [tgChannelQuest, setTgChannelQuest] = useState(user?.tg_channel);
	const [websiteQuest, setWebsiteQuest] = useState(user?.website);
	const [dailyQuests, setDailyQuests] = useState(dailyTasksObj);
	const [partnerQuests, setPartnerQuests] = useState(partnerTaskObj);

	// aws
	// const secretKey = process.env.REACT_APP_SECRET_KEY;

	// prodtest
	const secretKey = '<sNE:pYjk>2(0W%JUKaz9v(uBa3U';

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
		if (user?.wallet_address) {
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
	};

	const tasksBtn = () => {
		setTasksOpen(true);
		fadeShow();
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		// const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.add('popupTasks-show');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (bgTag) bgTag.classList.add('h100');
	};

	const tasksCloseToggler = () => {
		setTasksOpen(false);
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		// const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.remove('popupTasks-show');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
	};

	const errorCloseToggler = () => {
		setErrMsgVisible(false);
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.remove('show-blur');
		const footerTag = document.getElementById('footer');
		if (footerTag) footerTag.classList.remove('show-blur');
	};

	const toggleVisibility = () => {
		toggleMuteAllSounds();
		setIsVisible(!isVisible);
	};

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
					<div className='soundToggler'>
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
					</div>
					<div className='footerMain__activities'>
						<div className='footerMain__activitiesBtn'>
							<button onClick={tasksBtn}>
								<span>Tasks</span>
								<img src={tasks} />
							</button>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								Pet
								<img src={pet} />
							</button>
							<div className='footerMain__activitiesHint'>Coming Soon</div>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								Shop
								<img src={shop} />
							</button>
							<div className='footerMain__activitiesHint'>Coming Soon</div>
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
									width='19'
									height='19'
									viewBox='0 0 19 19'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M9.5 9.5L2 2M9.5 9.5L17 17M9.5 9.5L17 2M9.5 9.5L2 17'
										stroke='white'
										strokeWidth='3'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
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
												<img src={catCoinMove} alt='animation' draggable='false' />
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
									<button>
										<svg
											width='23'
											height='21'
											viewBox='0 0 23 21'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M6.02221 21C5.26134 21 4.6146 20.7337 4.08199 20.2011C3.54938 19.6685 3.28308 19.0217 3.28308 18.2609C3.28308 17.5 3.54938 16.8533 4.08199 16.3207C4.6146 15.788 5.26134 15.5217 6.02221 15.5217C6.23525 15.5217 6.43308 15.5446 6.61568 15.5902C6.79829 15.6359 6.97329 15.6967 7.14068 15.7728L8.44177 14.1522C8.01569 13.6804 7.71895 13.1478 7.55155 12.5543C7.38416 11.9609 7.34612 11.3674 7.43742 10.7739L5.58851 10.1576C5.32981 10.538 5.00264 10.8424 4.60699 11.0707C4.21134 11.2989 3.77003 11.413 3.28308 11.413C2.52221 11.413 1.87547 11.1467 1.34286 10.6141C0.81025 10.0815 0.543945 9.43478 0.543945 8.67391C0.543945 7.91304 0.81025 7.2663 1.34286 6.7337C1.87547 6.20109 2.52221 5.93478 3.28308 5.93478C4.04395 5.93478 4.69068 6.20109 5.22329 6.7337C5.7559 7.2663 6.02221 7.91304 6.02221 8.67391V8.85652L7.87112 9.49565C8.17547 8.94783 8.58253 8.4837 9.09232 8.10326C9.6021 7.72283 10.1766 7.47935 10.8157 7.37283V5.38696C10.2222 5.21957 9.73145 4.8962 9.3434 4.41685C8.95536 3.9375 8.76134 3.37826 8.76134 2.73913C8.76134 1.97826 9.02764 1.33152 9.56025 0.798913C10.0929 0.266304 10.7396 0 11.5005 0C12.2613 0 12.9081 0.266304 13.4407 0.798913C13.9733 1.33152 14.2396 1.97826 14.2396 2.73913C14.2396 3.37826 14.0418 3.9375 13.6461 4.41685C13.2505 4.8962 12.7635 5.21957 12.1853 5.38696V7.37283C12.8244 7.47935 13.3988 7.72283 13.9086 8.10326C14.4184 8.4837 14.8255 8.94783 15.1298 9.49565L16.9787 8.85652V8.67391C16.9787 7.91304 17.245 7.2663 17.7776 6.7337C18.3102 6.20109 18.957 5.93478 19.7179 5.93478C20.4787 5.93478 21.1255 6.20109 21.6581 6.7337C22.1907 7.2663 22.457 7.91304 22.457 8.67391C22.457 9.43478 22.1907 10.0815 21.6581 10.6141C21.1255 11.1467 20.4787 11.413 19.7179 11.413C19.2309 11.413 18.7858 11.2989 18.3825 11.0707C17.9793 10.8424 17.6559 10.538 17.4124 10.1576L15.5635 10.7739C15.6548 11.3674 15.6168 11.9571 15.4494 12.5429C15.282 13.1288 14.9853 13.6652 14.5592 14.1522L15.8602 15.75C16.0276 15.6739 16.2026 15.6168 16.3853 15.5788C16.5679 15.5408 16.7657 15.5217 16.9787 15.5217C17.7396 15.5217 18.3863 15.788 18.9189 16.3207C19.4516 16.8533 19.7179 17.5 19.7179 18.2609C19.7179 19.0217 19.4516 19.6685 18.9189 20.2011C18.3863 20.7337 17.7396 21 16.9787 21C16.2179 21 15.5711 20.7337 15.0385 20.2011C14.5059 19.6685 14.2396 19.0217 14.2396 18.2609C14.2396 17.9565 14.2891 17.6636 14.388 17.3821C14.4869 17.1005 14.62 16.8457 14.7874 16.6174L13.4863 14.9967C12.8624 15.3467 12.1967 15.5217 11.4891 15.5217C10.7814 15.5217 10.1157 15.3467 9.49177 14.9967L8.21351 16.6174C8.3809 16.8457 8.51405 17.1005 8.61297 17.3821C8.71188 17.6636 8.76134 17.9565 8.76134 18.2609C8.76134 19.0217 8.49503 19.6685 7.96242 20.2011C7.42981 20.7337 6.78308 21 6.02221 21ZM3.28308 9.58696C3.54177 9.58696 3.75862 9.49946 3.93362 9.32446C4.10862 9.14946 4.19612 8.93261 4.19612 8.67391C4.19612 8.41522 4.10862 8.19837 3.93362 8.02337C3.75862 7.84837 3.54177 7.76087 3.28308 7.76087C3.02438 7.76087 2.80753 7.84837 2.63253 8.02337C2.45753 8.19837 2.37003 8.41522 2.37003 8.67391C2.37003 8.93261 2.45753 9.14946 2.63253 9.32446C2.80753 9.49946 3.02438 9.58696 3.28308 9.58696ZM6.02221 19.1739C6.2809 19.1739 6.49775 19.0864 6.67275 18.9114C6.84775 18.7364 6.93525 18.5196 6.93525 18.2609C6.93525 18.0022 6.84775 17.7853 6.67275 17.6103C6.49775 17.4353 6.2809 17.3478 6.02221 17.3478C5.76351 17.3478 5.54666 17.4353 5.37166 17.6103C5.19666 17.7853 5.10916 18.0022 5.10916 18.2609C5.10916 18.5196 5.19666 18.7364 5.37166 18.9114C5.54666 19.0864 5.76351 19.1739 6.02221 19.1739ZM11.5005 3.65217C11.7592 3.65217 11.976 3.56467 12.151 3.38967C12.326 3.21467 12.4135 2.99783 12.4135 2.73913C12.4135 2.48043 12.326 2.26359 12.151 2.08859C11.976 1.91359 11.7592 1.82609 11.5005 1.82609C11.2418 1.82609 11.0249 1.91359 10.8499 2.08859C10.6749 2.26359 10.5874 2.48043 10.5874 2.73913C10.5874 2.99783 10.6749 3.21467 10.8499 3.38967C11.0249 3.56467 11.2418 3.65217 11.5005 3.65217ZM11.5005 13.6957C12.1396 13.6957 12.6798 13.475 13.1211 13.0337C13.5624 12.5924 13.7831 12.0522 13.7831 11.413C13.7831 10.7739 13.5624 10.2337 13.1211 9.79239C12.6798 9.35109 12.1396 9.13043 11.5005 9.13043C10.8613 9.13043 10.3211 9.35109 9.87982 9.79239C9.43851 10.2337 9.21786 10.7739 9.21786 11.413C9.21786 12.0522 9.43851 12.5924 9.87982 13.0337C10.3211 13.475 10.8613 13.6957 11.5005 13.6957ZM16.9787 19.1739C17.2374 19.1739 17.4543 19.0864 17.6293 18.9114C17.8043 18.7364 17.8918 18.5196 17.8918 18.2609C17.8918 18.0022 17.8043 17.7853 17.6293 17.6103C17.4543 17.4353 17.2374 17.3478 16.9787 17.3478C16.72 17.3478 16.5032 17.4353 16.3282 17.6103C16.1532 17.7853 16.0657 18.0022 16.0657 18.2609C16.0657 18.5196 16.1532 18.7364 16.3282 18.9114C16.5032 19.0864 16.72 19.1739 16.9787 19.1739ZM19.7179 9.58696C19.9766 9.58696 20.1934 9.49946 20.3684 9.32446C20.5434 9.14946 20.6309 8.93261 20.6309 8.67391C20.6309 8.41522 20.5434 8.19837 20.3684 8.02337C20.1934 7.84837 19.9766 7.76087 19.7179 7.76087C19.4592 7.76087 19.2423 7.84837 19.0673 8.02337C18.8923 8.19837 18.8048 8.41522 18.8048 8.67391C18.8048 8.93261 18.8923 9.14946 19.0673 9.32446C19.2423 9.49946 19.4592 9.58696 19.7179 9.58696Z'
												fill='white'
											/>
										</svg>
									</button>
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
									<button>
										<svg
											width='20'
											height='23'
											viewBox='0 0 20 23'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M12.7344 17.9688C11.9688 17.9688 11.3216 17.7082 10.793 17.1871C10.2643 16.666 10 16.0281 10 15.2734C10 14.5188 10.2643 13.8809 10.793 13.3598C11.3216 12.8387 11.9688 12.5781 12.7344 12.5781C13.5 12.5781 14.1471 12.8387 14.6758 13.3598C15.2044 13.8809 15.4688 14.5188 15.4688 15.2734C15.4688 16.0281 15.2044 16.666 14.6758 17.1871C14.1471 17.7082 13.5 17.9688 12.7344 17.9688ZM2.34375 22.2813C1.74219 22.2813 1.22721 22.0701 0.798828 21.6479C0.370443 21.2256 0.15625 20.718 0.15625 20.125V5.03125C0.15625 4.43828 0.370443 3.93066 0.798828 3.5084C1.22721 3.08613 1.74219 2.875 2.34375 2.875H3.4375V0.71875H5.625V2.875H14.375V0.71875H16.5625V2.875H17.6562C18.2578 2.875 18.7728 3.08613 19.2012 3.5084C19.6296 3.93066 19.8438 4.43828 19.8438 5.03125V20.125C19.8438 20.718 19.6296 21.2256 19.2012 21.6479C18.7728 22.0701 18.2578 22.2813 17.6562 22.2813H2.34375ZM2.34375 20.125H17.6562V9.34375H2.34375V20.125ZM2.34375 7.1875H17.6562V5.03125H2.34375V7.1875Z'
												fill='white'
												fillOpacity='0.6'
											/>
										</svg>
									</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 2 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(2)
											: () => {
													setErrorText('Submit your wallet first.');
													setErrMsgVisible(true);
													blurPopupTasks();
											  }
									}
								>
									<button>
										<svg
											width='25'
											height='19'
											viewBox='0 0 25 19'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M0.3125 18.4062V15.2891C0.3125 14.6582 0.474077 14.0784 0.79723 13.5496C1.12038 13.0208 1.54972 12.6172 2.08523 12.3389C3.23011 11.7637 4.39347 11.3323 5.57528 11.0447C6.7571 10.7571 7.95739 10.6133 9.17614 10.6133C10.3949 10.6133 11.5952 10.7571 12.777 11.0447C13.9588 11.3323 15.1222 11.7637 16.267 12.3389C16.8026 12.6172 17.2319 13.0208 17.555 13.5496C17.8782 14.0784 18.0398 14.6582 18.0398 15.2891V18.4062H0.3125ZM20.2557 18.4062V15.0664C20.2557 14.25 20.0295 13.4661 19.5771 12.7146C19.1246 11.9631 18.483 11.3184 17.652 10.7803C18.5938 10.8916 19.4801 11.0818 20.3111 11.3508C21.142 11.6199 21.9176 11.9492 22.6378 12.3389C23.3026 12.71 23.8104 13.1228 24.1612 13.5774C24.5121 14.032 24.6875 14.5283 24.6875 15.0664V18.4062H20.2557ZM9.17614 9.5C7.95739 9.5 6.91406 9.06396 6.04616 8.19189C5.17827 7.31982 4.74432 6.27148 4.74432 5.04687C4.74432 3.82227 5.17827 2.77393 6.04616 1.90186C6.91406 1.02979 7.95739 0.59375 9.17614 0.59375C10.3949 0.59375 11.4382 1.02979 12.3061 1.90186C13.174 2.77393 13.608 3.82227 13.608 5.04687C13.608 6.27148 13.174 7.31982 12.3061 8.19189C11.4382 9.06396 10.3949 9.5 9.17614 9.5ZM20.2557 5.04687C20.2557 6.27148 19.8217 7.31982 18.9538 8.19189C18.0859 9.06396 17.0426 9.5 15.8239 9.5C15.6207 9.5 15.3622 9.47681 15.0483 9.43042C14.7344 9.38403 14.4759 9.33301 14.2727 9.27734C14.7713 8.68359 15.1545 8.0249 15.4222 7.30127C15.69 6.57764 15.8239 5.82617 15.8239 5.04687C15.8239 4.26758 15.69 3.51611 15.4222 2.79248C15.1545 2.06885 14.7713 1.41016 14.2727 0.816406C14.5313 0.723633 14.7898 0.66333 15.0483 0.635498C15.3068 0.607666 15.5653 0.59375 15.8239 0.59375C17.0426 0.59375 18.0859 1.02979 18.9538 1.90186C19.8217 2.77393 20.2557 3.82227 20.2557 5.04687ZM2.52841 16.1797H15.8239V15.2891C15.8239 15.085 15.7731 14.8994 15.6715 14.7324C15.57 14.5654 15.4361 14.4355 15.2699 14.3428C14.2727 13.8418 13.2663 13.4661 12.2507 13.2156C11.2351 12.9651 10.2102 12.8398 9.17614 12.8398C8.14205 12.8398 7.11719 12.9651 6.10156 13.2156C5.08594 13.4661 4.07955 13.8418 3.08239 14.3428C2.91619 14.4355 2.78232 14.5654 2.68075 14.7324C2.57919 14.8994 2.52841 15.085 2.52841 15.2891V16.1797ZM9.17614 7.27344C9.78551 7.27344 10.3072 7.05542 10.7411 6.61938C11.1751 6.18335 11.392 5.65918 11.392 5.04687C11.392 4.43457 11.1751 3.9104 10.7411 3.47436C10.3072 3.03833 9.78551 2.82031 9.17614 2.82031C8.56676 2.82031 8.0451 3.03833 7.61115 3.47436C7.1772 3.9104 6.96023 4.43457 6.96023 5.04687C6.96023 5.65918 7.1772 6.18335 7.61115 6.61938C8.0451 7.05542 8.56676 7.27344 9.17614 7.27344Z'
												fill='white'
												fillOpacity='0.6'
											/>
										</svg>
									</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 0 ? 'active' : ''}`}>
								<div className='popupTasks__walletTask'>
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
											disabled={walletInputDisabled === true}
										>
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
										</button>
									</div>
									<div className='popupTasks__walletTask-left'>
										{!user?.wallet_address ? (
											<p style={{ marginLeft: '-25px' }}>+ 20000</p>
										) : (
											''
										)}
									</div>
									<div className='popupTasks__walletTask-box'>
										<div className='popupTasks__walletTask-right'>
											<div className='popupTasks__walletTask-rightHint'>
												<span>
													*it can be done <br /> every 3 days
												</span>
											</div>
											<div className='popupTasks__walletTask-rightBtn'>
												<button
													onClick={resetWalletEnabler}
													disabled={resetBtnDisabled === true}
												>
													<svg
														width='15'
														height='12'
														viewBox='0 0 15 12'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M8.5 12C9.68669 12 10.8467 11.6481 11.8334 10.9888C12.8201 10.3295 13.5891 9.39246 14.0433 8.2961C14.4974 7.19975 14.6162 5.99335 14.3847 4.82946C14.1532 3.66557 13.5818 2.59648 12.7426 1.75736C11.9035 0.918247 10.8344 0.346802 9.67054 0.115291C8.50665 -0.11622 7.30025 0.00259972 6.2039 0.456725C5.10754 0.910851 4.17047 1.67989 3.51118 2.66658C2.85189 3.65328 2.5 4.81331 2.5 6V9.1L0.7 7.3L0 8L3 11L6 8L5.3 7.3L3.5 9.1V6C3.5 5.0111 3.79324 4.0444 4.34265 3.22215C4.89206 2.39991 5.67295 1.75904 6.58658 1.3806C7.50021 1.00217 8.50554 0.90315 9.47545 1.09608C10.4454 1.289 11.3363 1.76521 12.0355 2.46447C12.7348 3.16373 13.211 4.05465 13.4039 5.02455C13.5968 5.99445 13.4978 6.99979 13.1194 7.91342C12.741 8.82705 12.1001 9.60794 11.2778 10.1573C10.4556 10.7068 9.4889 11 8.5 11V12Z'
															fill='white'
														/>
													</svg>
													Reset
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className='popupTasks__task'>
									<button onClick={twitterClick} disabled={twitterQuest === 1}>
										Follow Twitter
										{user?.twitter === 0 ? (
											<p>
												+ 10000{' '}
												<img
													className='rewardCoin'
													src={catCoinMove}
													alt='animation'
													draggable='false'
												/>
											</p>
										) : (
											<img src={checkbox} />
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChat} disabled={tgChatQuest === 1}>
										Follow TG Chat
										{user?.tg_chat === 0 ? (
											<p>
												+ 10000{' '}
												<img
													className='rewardCoin'
													src={catCoinMove}
													alt='animation'
													draggable='false'
												/>
											</p>
										) : (
											<img src={checkbox} />
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChannel} disabled={tgChannelQuest === 1}>
										Follow TG Channel
										{user?.tg_channel === 0 ? (
											<p>
												+ 10000{' '}
												<img
													className='rewardCoin'
													src={catCoinMove}
													alt='animation'
													draggable='false'
												/>
											</p>
										) : (
											<img src={checkbox} />
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={websiteClick} disabled={websiteQuest === 1}>
										Visit Website
										{user?.website === 0 ? (
											<p>
												+ 3000{' '}
												<img
													className='rewardCoin'
													src={catCoinMove}
													alt='animation'
													draggable='false'
												/>
											</p>
										) : (
											<img src={checkbox} />
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
															<p>
																+ {quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoinMove}
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<img src={checkbox} alt='Completed' />
														)}
													</button>
												) : (
													<button disabled={quest.status === 1}>
														<span>{quest.daily_quest.name}</span>
														{quest.status === 0 ? (
															<p>
																+ {quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoinMove}
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<img src={checkbox} alt='Completed' />
														)}
													</button>
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
															<p>
																+ {quest.reward}{' '}
																<img
																	className='rewardCoin'
																	src={catCoinMove}
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<img src={checkbox} alt='Completed' />
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
									width='19'
									height='19'
									viewBox='0 0 19 19'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M9.5 9.5L2 2M9.5 9.5L17 17M9.5 9.5L17 2M9.5 9.5L2 17'
										stroke='white'
										strokeWidth='3'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
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
