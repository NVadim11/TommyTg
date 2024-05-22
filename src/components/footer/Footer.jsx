import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import catCoinMove from '../../img/cat_coin_move.png';
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
		if (!user?.wallet_address) {
			toggleFirst();
		}
		else {
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
											width='13'
											height='13'
											viewBox='0 0 13 13'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M3.36969 12.5C2.93491 12.5 2.56535 12.3478 2.261 12.0435C1.95665 11.7391 1.80448 11.3696 1.80448 10.9348C1.80448 10.5 1.95665 10.1304 2.261 9.82609C2.56535 9.52174 2.93491 9.36957 3.36969 9.36957C3.49143 9.36957 3.60448 9.38261 3.70882 9.4087C3.81317 9.43478 3.91317 9.46957 4.00882 9.51304L4.7523 8.58696C4.50882 8.31739 4.33926 8.01304 4.24361 7.67391C4.14795 7.33478 4.12621 6.99565 4.17839 6.65652L3.12187 6.30435C2.97404 6.52174 2.78708 6.69565 2.561 6.82609C2.33491 6.95652 2.08274 7.02174 1.80448 7.02174C1.36969 7.02174 1.00013 6.86957 0.69578 6.56522C0.391432 6.26087 0.239258 5.8913 0.239258 5.45652C0.239258 5.02174 0.391432 4.65217 0.69578 4.34783C1.00013 4.04348 1.36969 3.8913 1.80448 3.8913C2.23926 3.8913 2.60882 4.04348 2.91317 4.34783C3.21752 4.65217 3.36969 5.02174 3.36969 5.45652V5.56087L4.42622 5.92609C4.60013 5.61304 4.83274 5.34783 5.12404 5.13043C5.41535 4.91304 5.74361 4.77391 6.10882 4.71304V3.57826C5.76969 3.48261 5.48926 3.29783 5.26752 3.02391C5.04578 2.75 4.93491 2.43043 4.93491 2.06522C4.93491 1.63043 5.08708 1.26087 5.39143 0.956522C5.69578 0.652174 6.06535 0.5 6.50013 0.5C6.93491 0.5 7.30448 0.652174 7.60882 0.956522C7.91317 1.26087 8.06535 1.63043 8.06535 2.06522C8.06535 2.43043 7.9523 2.75 7.72622 3.02391C7.50013 3.29783 7.22187 3.48261 6.89143 3.57826V4.71304C7.25665 4.77391 7.58491 4.91304 7.87621 5.13043C8.16752 5.34783 8.40013 5.61304 8.57404 5.92609L9.63056 5.56087V5.45652C9.63056 5.02174 9.78274 4.65217 10.0871 4.34783C10.3914 4.04348 10.761 3.8913 11.1958 3.8913C11.6306 3.8913 12.0001 4.04348 12.3045 4.34783C12.6088 4.65217 12.761 5.02174 12.761 5.45652C12.761 5.8913 12.6088 6.26087 12.3045 6.56522C12.0001 6.86957 11.6306 7.02174 11.1958 7.02174C10.9175 7.02174 10.6632 6.95652 10.4327 6.82609C10.2023 6.69565 10.0175 6.52174 9.87839 6.30435L8.82187 6.65652C8.87404 6.99565 8.8523 7.33261 8.75665 7.66739C8.661 8.00217 8.49143 8.3087 8.24795 8.58696L8.99143 9.5C9.08708 9.45652 9.18709 9.42391 9.29143 9.40217C9.39578 9.38043 9.50882 9.36957 9.63056 9.36957C10.0653 9.36957 10.4349 9.52174 10.7393 9.82609C11.0436 10.1304 11.1958 10.5 11.1958 10.9348C11.1958 11.3696 11.0436 11.7391 10.7393 12.0435C10.4349 12.3478 10.0653 12.5 9.63056 12.5C9.19578 12.5 8.82621 12.3478 8.52187 12.0435C8.21752 11.7391 8.06535 11.3696 8.06535 10.9348C8.06535 10.7609 8.09361 10.5935 8.15013 10.4326C8.20665 10.2717 8.28274 10.1261 8.37839 9.99565L7.63491 9.06957C7.27839 9.26957 6.89795 9.36957 6.49361 9.36957C6.08926 9.36957 5.70882 9.26957 5.3523 9.06957L4.62187 9.99565C4.71752 10.1261 4.79361 10.2717 4.85013 10.4326C4.90665 10.5935 4.93491 10.7609 4.93491 10.9348C4.93491 11.3696 4.78274 11.7391 4.47839 12.0435C4.17404 12.3478 3.80448 12.5 3.36969 12.5ZM1.80448 5.97826C1.9523 5.97826 2.07621 5.92826 2.17621 5.82826C2.27621 5.72826 2.32621 5.60435 2.32621 5.45652C2.32621 5.3087 2.27621 5.18478 2.17621 5.08478C2.07621 4.98478 1.9523 4.93478 1.80448 4.93478C1.65665 4.93478 1.53274 4.98478 1.43274 5.08478C1.33274 5.18478 1.28274 5.3087 1.28274 5.45652C1.28274 5.60435 1.33274 5.72826 1.43274 5.82826C1.53274 5.92826 1.65665 5.97826 1.80448 5.97826ZM3.36969 11.4565C3.51752 11.4565 3.64143 11.4065 3.74143 11.3065C3.84143 11.2065 3.89143 11.0826 3.89143 10.9348C3.89143 10.787 3.84143 10.663 3.74143 10.563C3.64143 10.463 3.51752 10.413 3.36969 10.413C3.22187 10.413 3.09795 10.463 2.99795 10.563C2.89795 10.663 2.84795 10.787 2.84795 10.9348C2.84795 11.0826 2.89795 11.2065 2.99795 11.3065C3.09795 11.4065 3.22187 11.4565 3.36969 11.4565ZM6.50013 2.58696C6.64795 2.58696 6.77187 2.53696 6.87187 2.43696C6.97187 2.33696 7.02187 2.21304 7.02187 2.06522C7.02187 1.91739 6.97187 1.79348 6.87187 1.69348C6.77187 1.59348 6.64795 1.54348 6.50013 1.54348C6.3523 1.54348 6.22839 1.59348 6.12839 1.69348C6.02839 1.79348 5.97839 1.91739 5.97839 2.06522C5.97839 2.21304 6.02839 2.33696 6.12839 2.43696C6.22839 2.53696 6.3523 2.58696 6.50013 2.58696ZM6.50013 8.32609C6.86535 8.32609 7.17404 8.2 7.42622 7.94783C7.67839 7.69565 7.80448 7.38696 7.80448 7.02174C7.80448 6.65652 7.67839 6.34783 7.42622 6.09565C7.17404 5.84348 6.86535 5.71739 6.50013 5.71739C6.13491 5.71739 5.82622 5.84348 5.57404 6.09565C5.32187 6.34783 5.19578 6.65652 5.19578 7.02174C5.19578 7.38696 5.32187 7.69565 5.57404 7.94783C5.82622 8.2 6.13491 8.32609 6.50013 8.32609ZM9.63056 11.4565C9.77839 11.4565 9.9023 11.4065 10.0023 11.3065C10.1023 11.2065 10.1523 11.0826 10.1523 10.9348C10.1523 10.787 10.1023 10.663 10.0023 10.563C9.9023 10.463 9.77839 10.413 9.63056 10.413C9.48274 10.413 9.35882 10.463 9.25882 10.563C9.15882 10.663 9.10882 10.787 9.10882 10.9348C9.10882 11.0826 9.15882 11.2065 9.25882 11.3065C9.35882 11.4065 9.48274 11.4565 9.63056 11.4565ZM11.1958 5.97826C11.3436 5.97826 11.4675 5.92826 11.5675 5.82826C11.6675 5.72826 11.7175 5.60435 11.7175 5.45652C11.7175 5.3087 11.6675 5.18478 11.5675 5.08478C11.4675 4.98478 11.3436 4.93478 11.1958 4.93478C11.048 4.93478 10.924 4.98478 10.824 5.08478C10.724 5.18478 10.674 5.3087 10.674 5.45652C10.674 5.60435 10.724 5.72826 10.824 5.82826C10.924 5.92826 11.048 5.97826 11.1958 5.97826Z'
												fill='white'
											/>
										</svg>
										Main
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
											width='11'
											height='13'
											viewBox='0 0 11 13'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M6.9124 9.84169C6.51684 9.84169 6.18251 9.70708 5.90939 9.43786C5.63627 9.16865 5.49971 8.83909 5.49971 8.44919C5.49971 8.05929 5.63627 7.72973 5.90939 7.46051C6.18251 7.1913 6.51684 7.05669 6.9124 7.05669C7.30795 7.05669 7.64228 7.1913 7.9154 7.46051C8.18852 7.72973 8.32508 8.05929 8.32508 8.44919C8.32508 8.83909 8.18852 9.16865 7.9154 9.43786C7.64228 9.70708 7.30795 9.84169 6.9124 9.84169ZM1.54421 12.0697C1.23342 12.0697 0.967363 11.9606 0.746043 11.7424C0.524723 11.5243 0.414062 11.262 0.414062 10.9557V3.15769C0.414062 2.85134 0.524723 2.58908 0.746043 2.37093C0.967363 2.15277 1.23342 2.04369 1.54421 2.04369H2.10928V0.929688H3.23942V2.04369H7.76V0.929688H8.89015V2.04369H9.45522C9.76601 2.04369 10.0321 2.15277 10.2534 2.37093C10.4747 2.58908 10.5854 2.85134 10.5854 3.15769V10.9557C10.5854 11.262 10.4747 11.5243 10.2534 11.7424C10.0321 11.9606 9.76601 12.0697 9.45522 12.0697H1.54421ZM1.54421 10.9557H9.45522V5.38569H1.54421V10.9557ZM1.54421 4.27169H9.45522V3.15769H1.54421V4.27169Z'
												fill='white'
											/>
										</svg>
										Daily
									</button>
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
									<button>
										<svg
											width='13'
											height='9'
											viewBox='0 0 13 9'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M0.5 9V7.425C0.5 7.10625 0.579545 6.81328 0.738636 6.54609C0.897727 6.27891 1.10909 6.075 1.37273 5.93437C1.93636 5.64375 2.50909 5.42578 3.09091 5.28047C3.67273 5.13516 4.26364 5.0625 4.86364 5.0625C5.46364 5.0625 6.05455 5.13516 6.63636 5.28047C7.21818 5.42578 7.79091 5.64375 8.35455 5.93437C8.61818 6.075 8.82955 6.27891 8.98864 6.54609C9.14773 6.81328 9.22727 7.10625 9.22727 7.425V9H0.5ZM10.3182 9V7.3125C10.3182 6.9 10.2068 6.50391 9.98409 6.12422C9.76136 5.74453 9.44545 5.41875 9.03636 5.14687C9.5 5.20312 9.93636 5.29922 10.3455 5.43516C10.7545 5.57109 11.1364 5.7375 11.4909 5.93437C11.8182 6.12187 12.0682 6.33047 12.2409 6.56016C12.4136 6.78984 12.5 7.04062 12.5 7.3125V9H10.3182ZM4.86364 4.5C4.26364 4.5 3.75 4.27969 3.32273 3.83906C2.89545 3.39844 2.68182 2.86875 2.68182 2.25C2.68182 1.63125 2.89545 1.10156 3.32273 0.660937C3.75 0.220312 4.26364 0 4.86364 0C5.46364 0 5.97727 0.220312 6.40455 0.660937C6.83182 1.10156 7.04545 1.63125 7.04545 2.25C7.04545 2.86875 6.83182 3.39844 6.40455 3.83906C5.97727 4.27969 5.46364 4.5 4.86364 4.5ZM10.3182 2.25C10.3182 2.86875 10.1045 3.39844 9.67727 3.83906C9.25 4.27969 8.73636 4.5 8.13636 4.5C8.03636 4.5 7.90909 4.48828 7.75455 4.46484C7.6 4.44141 7.47273 4.41563 7.37273 4.3875C7.61818 4.0875 7.80682 3.75469 7.93864 3.38906C8.07045 3.02344 8.13636 2.64375 8.13636 2.25C8.13636 1.85625 8.07045 1.47656 7.93864 1.11094C7.80682 0.745312 7.61818 0.4125 7.37273 0.1125C7.5 0.065625 7.62727 0.0351562 7.75455 0.0210937C7.88182 0.00703125 8.00909 0 8.13636 0C8.73636 0 9.25 0.220312 9.67727 0.660937C10.1045 1.10156 10.3182 1.63125 10.3182 2.25ZM1.59091 7.875H8.13636V7.425C8.13636 7.32187 8.11136 7.22812 8.06136 7.14375C8.01136 7.05937 7.94545 6.99375 7.86364 6.94687C7.37273 6.69375 6.87727 6.50391 6.37727 6.37734C5.87727 6.25078 5.37273 6.1875 4.86364 6.1875C4.35455 6.1875 3.85 6.25078 3.35 6.37734C2.85 6.50391 2.35455 6.69375 1.86364 6.94687C1.78182 6.99375 1.71591 7.05937 1.66591 7.14375C1.61591 7.22812 1.59091 7.32187 1.59091 7.425V7.875ZM4.86364 3.375C5.16364 3.375 5.42045 3.26484 5.63409 3.04453C5.84773 2.82422 5.95455 2.55938 5.95455 2.25C5.95455 1.94062 5.84773 1.67578 5.63409 1.45547C5.42045 1.23516 5.16364 1.125 4.86364 1.125C4.56364 1.125 4.30682 1.23516 4.09318 1.45547C3.87955 1.67578 3.77273 1.94062 3.77273 2.25C3.77273 2.55938 3.87955 2.82422 4.09318 3.04453C4.30682 3.26484 4.56364 3.375 4.86364 3.375Z'
												fill='white'
												fill-opacity='0.6'
											/>
										</svg>
										Special
									</button>
									<div className='footerMain__activitiesHint'>Coming Soon</div>
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 0 ? 'active' : ''}`}>
								<div className='popupTasks__walletTask'>
								{inputFirst && <div className='popupTasks__walletTask-input'>
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
									</div>}
									{inputSecond && <div className="popupTasks__walletTask-input">
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
											className='popupTasks__walletTask-inputBtn'
											disabled
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
									</div>}
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
													*it can be done once <br /> every 3 days
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
													<span>
														Change <br /> Wallet
													</span>
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
