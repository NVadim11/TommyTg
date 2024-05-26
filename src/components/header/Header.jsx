import React, { useContext, useEffect, useRef, useState } from 'react';
// import leaderboard_icon from '../../img/leaderboard_icon.svg';
import link from '../../img/link.svg';
import logo from '../../img/logo.svg';
import money from '../../img/money.svg';
import people from '../../img/people-icon.svg';
import { useGetLeaderboardMutation } from '../../services/phpService';
// import { toggleMuteAllSounds } from '../../utility/Audio';

import { GameInfoContext } from '../../helpers/context';
import './Header.scss';

const Header = ({ user }) => {
	const { state } = useContext(GameInfoContext);
	const [isToggled, setIsToggled] = useState(false);
	const [isShown, setIsShown] = useState(false);
	const [totalPoints, setTotalPoints] = useState(null);
	const [totalReferrals, setTotalReferrals] = useState(null);
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const [isInviteOpen, setInviteOpen] = useState(false);
	// const [isVisible, setIsVisible] = useState(false);
	const [isElementPresent, setIsElementPresent] = useState(false);
	const initLeadersRef = useRef(null);
	const [getLeaderboard] = useGetLeaderboardMutation();

	const popupClsTgl = isLeaderboardOpen ? 'popupLeaderboard_show' : null;
	const popupClasses = `popupLeaderboard ${popupClsTgl}`;

	const popupInvTgl = isInviteOpen ? 'popupInvite_show' : null;
	const popupInvite = `popupInvite ${popupInvTgl}`;

	const containerRef = useRef(null);

	const tg = window.Telegram.WebApp;

	// aws
	const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

	useEffect(() => {
		const observer = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
					const targetElement = document.getElementById('header__totalScore');
					if (targetElement) {
						setIsElementPresent(true);
					}
				} else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
					const targetElement = document.getElementById('header__totalScore');
					if (!targetElement) {
						setIsElementPresent(false);
					}
				}
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

	const toggleVisibility = () => {
		setIsShown(!isShown);
		setIsToggled(!isToggled);
	};

	// const toggleVisibilitySound = () => {
	// toggleMuteAllSounds();
	// setIsVisible(!isVisible);
	// };

	useEffect(() => {
		const fetchData = async () => {
			if (Object.keys(user).length) {
				const res = await getLeaderboard(user.id).unwrap();
				setLeaderboardData(res);
				setTotalReferrals(user?.referrals_count);
				setTotalPoints(user?.wallet_balance);
				const intervalId = setInterval(() => {
					getLeaderboard(user.id)
						.unwrap()
						.then((data) => setLeaderboardData(data))
						.catch((error) => console.error('Error refreshing leaderboard:', error));
				}, 60000);
				return intervalId;
			}
		};

		let intervalId;

		if (user) {
			fetchData().then((id) => {
				intervalId = id;
			});
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [user]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (event.target.closest('.header__mobileBurger')) return;
			setIsShown(false);
			setIsToggled(false);
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	const leaderBordBtn = () => {
		setLeaderboardOpen(true);
		fadeShow();
		setIsShown(false);
	};

	const inviteFriendsBtn = () => {
		setInviteOpen(true);
		fadeShow();
		setIsShown(false);
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		if (htmlTag) htmlTag.classList.add('popupLeaderboard-show');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const bgTag = document.getElementById('bgImage');
		const footerTag = document.getElementById('footer');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (bgTag) bgTag.classList.add('h100');
		if (footerTag) footerTag.classList.add('show-blur');
	};

	const сloseToggler = () => {
		setLeaderboardOpen(false);
		setInviteOpen(false);
		const htmlTag = document.getElementById('html');
		if (htmlTag) htmlTag.classList.remove('popupLeaderboard-show');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const bgTag = document.getElementById('bgImage');
		const footerTag = document.getElementById('footer');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
		if (footerTag) footerTag.classList.remove('show-blur');
	};

	const inviteLink = async () => {
		try {
			const response = await fetch(
				`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						chat_id: user?.id_telegram,
						text: 'In order to get Your referral link, use this command /referral',
						disable_notification: true,
					}),
				}
			);
			if (response.ok) {
				// Request was successful
				tg.close();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<>
			<header id='header' className='header'>
				<div className='header__container'>
					<div className='header__logo'>
						<img src={logo} />
					</div>
					<div className='header__mobileBtns'>
						{/* {user && totalPoints !== null && (
							<div id='header__totalScore' className='header__totalScore'>
								{state?.info.header__totalScore} <span>{totalPoints}</span>
							</div>
						)} */}
						{/* <div className='header__leaderboard'>
								<button onClick={leaderBordBtn}>
									{state?.info.header__leaderboard}
									<img src={leaderboard_icon} />
								</button>
							</div>
							<div className='header__inviteBtn'>
								<button onClick={inviteFriendsBtn}>
									{state?.info.header__inviteBtn}
									<svg
										width='20'
										height='20'
										viewBox='0 0 20 20'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<g clipPath='url(#clip0_4005_343)'>
											<path
												d='M10.4167 9.95801C10.8194 9.51356 11.1285 9.00662 11.3438 8.43717C11.559 7.86773 11.6667 7.27745 11.6667 6.66634C11.6667 6.05523 11.559 5.46495 11.3438 4.89551C11.1285 4.32606 10.8194 3.81912 10.4167 3.37467C11.25 3.48579 11.9444 3.85384 12.5 4.47884C13.0556 5.10384 13.3333 5.83301 13.3333 6.66634C13.3333 7.49967 13.0556 8.22884 12.5 8.85384C11.9444 9.47884 11.25 9.8469 10.4167 9.95801ZM15 16.6663V14.1663C15 13.6663 14.8889 13.1906 14.6667 12.7393C14.4444 12.2879 14.1528 11.8886 13.7917 11.5413C14.5 11.7913 15.1562 12.1143 15.7604 12.5101C16.3646 12.9059 16.6667 13.458 16.6667 14.1663V16.6663H15ZM16.6667 10.833V9.16634H15V7.49967H16.6667V5.83301H18.3333V7.49967H20V9.16634H18.3333V10.833H16.6667ZM6.66667 9.99967C5.75 9.99967 4.96528 9.67329 4.3125 9.02051C3.65972 8.36773 3.33333 7.58301 3.33333 6.66634C3.33333 5.74967 3.65972 4.96495 4.3125 4.31217C4.96528 3.6594 5.75 3.33301 6.66667 3.33301C7.58333 3.33301 8.36806 3.6594 9.02083 4.31217C9.67361 4.96495 10 5.74967 10 6.66634C10 7.58301 9.67361 8.36773 9.02083 9.02051C8.36806 9.67329 7.58333 9.99967 6.66667 9.99967ZM0 16.6663V14.333C0 13.8608 0.121528 13.4268 0.364583 13.0309C0.607639 12.6351 0.930556 12.333 1.33333 12.1247C2.19444 11.6941 3.06944 11.3712 3.95833 11.1559C4.84722 10.9406 5.75 10.833 6.66667 10.833C7.58333 10.833 8.48611 10.9406 9.375 11.1559C10.2639 11.3712 11.1389 11.6941 12 12.1247C12.4028 12.333 12.7257 12.6351 12.9688 13.0309C13.2118 13.4268 13.3333 13.8608 13.3333 14.333V16.6663H0ZM6.66667 8.33301C7.125 8.33301 7.51736 8.16981 7.84375 7.84342C8.17014 7.51704 8.33333 7.12467 8.33333 6.66634C8.33333 6.20801 8.17014 5.81565 7.84375 5.48926C7.51736 5.16287 7.125 4.99967 6.66667 4.99967C6.20833 4.99967 5.81597 5.16287 5.48958 5.48926C5.16319 5.81565 5 6.20801 5 6.66634C5 7.12467 5.16319 7.51704 5.48958 7.84342C5.81597 8.16981 6.20833 8.33301 6.66667 8.33301ZM1.66667 14.9997H11.6667V14.333C11.6667 14.1802 11.6285 14.0413 11.5521 13.9163C11.4757 13.7913 11.375 13.6941 11.25 13.6247C10.5 13.2497 9.74306 12.9684 8.97917 12.7809C8.21528 12.5934 7.44444 12.4997 6.66667 12.4997C5.88889 12.4997 5.11806 12.5934 4.35417 12.7809C3.59028 12.9684 2.83333 13.2497 2.08333 13.6247C1.95833 13.6941 1.85764 13.7913 1.78125 13.9163C1.70486 14.0413 1.66667 14.1802 1.66667 14.333V14.9997Z'
												fill='white'
											/>
										</g>
										<defs>
											<clipPath id='clip0_4005_343'>
												<rect width='20' height='20' fill='white' />
											</clipPath>
										</defs>
									</svg>
								</button>
							</div> */}
						<div className='header__mobileBtns-links'>
							<a href='https://t.me/tomo_cat' target='_blank'>
								<svg
									width='24'
									height='19'
									viewBox='0 0 24 19'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fill-rule='evenodd'
										clip-rule='evenodd'
										d='M19.8625 18.078L23.544 1.81156C23.724 1.01656 22.8754 0.352279 22.0547 0.639422L21.6647 0.778707L0.49754 8.40514C0.347985 8.45228 0.218196 8.54752 0.128351 8.67603C0.0385062 8.80455 -0.00635979 8.95916 0.00072731 9.1158C0.00781441 9.27245 0.0664576 9.42237 0.16754 9.54225C0.268623 9.66214 0.406482 9.74526 0.559683 9.77871L6.03897 11.2787L7.06111 14.2787L8.08325 17.2787C8.1422 17.4256 8.2361 17.5559 8.3568 17.6583C8.47751 17.7607 8.62137 17.8321 8.77592 17.8663C8.93046 17.9005 9.09102 17.8965 9.24365 17.8546C9.39629 17.8127 9.5364 17.7342 9.65182 17.6259L12.4825 14.9494L18.0411 18.7209C18.7204 19.1859 19.689 18.8409 19.8625 18.078ZM9.78959 12.0736L19.3532 4.25651C19.5932 4.05936 19.3146 3.71651 19.0424 3.87508L17.1696 4.94651L7.21816 10.6508C7.11894 10.7037 7.04142 10.7897 6.99913 10.8938C6.95683 10.998 6.95245 11.1137 6.98673 11.2208L7.7903 13.6101L8.56816 15.9458C8.57072 15.9742 8.58446 16.0004 8.60636 16.0187C8.62826 16.037 8.65653 16.0458 8.68495 16.0433C8.71336 16.0407 8.7396 16.027 8.75788 16.0051C8.77617 15.9832 8.785 15.9549 8.78244 15.9265L9.05887 13.5908L9.15959 12.7594C9.17619 12.6343 9.24073 12.5206 9.33959 12.4422L9.78959 12.0736Z'
										fill='white'
									/>
								</svg>
							</a>
						</div>
						<div className='header__mobileBtns-links'>
							<a href='https://twitter.com/TomoCatSol' target='_blank'>
								<svg
									width='24'
									height='22'
									viewBox='0 0 24 22'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M18.7187 0.5H22.2172L14.5739 9.2358L23.5657 21.1233H16.5252L11.0109 13.9136L4.7012 21.1233H1.20054L9.37581 11.7793L0.75 0.5H7.9692L12.9537 7.08992L18.7187 0.5ZM17.4908 19.0292H19.4294L6.91583 2.48406H4.83552L17.4908 19.0292Z'
										fill='white'
									/>
								</svg>
							</a>
						</div>
						<button
							className='header__mobileBurger'
							ref={containerRef}
							onClick={toggleVisibility}
						>
							Menu
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<g clip-path='url(#clip0_5124_6838)'>
									<path
										d='M19.9019 1.38086C19.508 1.38086 19.188 1.70083 19.188 2.09477C19.188 2.48866 19.508 2.80867 19.9019 2.80867C20.2958 2.80867 20.6158 2.48866 20.6158 2.09477C20.6158 1.70087 20.2958 1.38086 19.9019 1.38086Z'
										fill='white'
									/>
									<path
										d='M23.6249 0.929875C23.5685 0.6475 23.3475 0.426531 23.0651 0.370047C22.1399 0.185172 21.2607 0.0693906 20.4152 0.021625C21.3477 0.253188 22.0436 1.09103 22.0436 2.09416C22.0436 3.27517 21.0828 4.23588 19.9019 4.23588C18.7208 4.23588 17.7601 3.27513 17.7601 2.09416C17.7601 1.07017 18.4833 0.214047 19.4452 0.00390625C17.3419 0.0201719 15.4294 0.486531 13.5194 1.44086C13.0868 1.65719 12.9877 2.23802 13.3339 2.58423L16.8676 6.11791L15.8315 7.15398C13.6091 5.19316 11.1183 4.45356 11.0046 4.42131C10.6268 4.30975 10.2301 4.53353 10.1234 4.91355C10.016 5.29281 10.2363 5.68741 10.6156 5.7948C10.64 5.80183 12.8538 6.45789 14.8214 8.16409L12.7942 10.1913C11.0541 8.78359 8.9901 8.45444 8.89363 8.44061C8.49834 8.37578 8.14068 8.65328 8.0842 9.04366C8.02705 9.43338 8.29682 9.79591 8.68724 9.85309C8.70571 9.85614 10.3698 10.1149 11.7837 11.2019L9.74484 13.2407C8.44673 12.3916 6.80807 12.4669 6.73232 12.4724C6.33909 12.494 6.03932 12.8286 6.05952 13.2219C6.07977 13.6158 6.42341 13.9002 6.80826 13.8981C6.81665 13.8914 7.84073 13.8592 8.69737 14.2881L6.70902 16.2765C5.97899 15.8053 5.09498 15.6187 4.22174 15.7938L0.573414 16.5237C0.0147113 16.6354 -0.192429 17.3271 0.208774 17.7284L0.800008 18.3197C1.69523 19.2148 2.84066 19.769 4.07816 19.9168C4.22596 21.1543 4.78021 22.2998 5.67543 23.195L6.26666 23.7862C6.66927 24.1888 7.35974 23.9799 7.4714 23.4216L8.20134 19.7725C8.37529 18.9005 8.18915 18.0163 7.71843 17.2862L9.70645 15.2981C10.1327 16.1532 10.0981 17.1739 10.097 17.1867C10.0781 17.5792 10.38 17.9153 10.7732 17.9355C10.7858 17.9362 10.7983 17.9362 10.8109 17.9362C11.1873 17.9362 11.5018 17.6434 11.5227 17.2627C11.5276 17.1841 11.6028 15.5473 10.7543 14.2502L12.793 12.2116C13.8722 13.6195 14.1389 15.2908 14.1419 15.3099C14.1996 15.689 14.5499 15.9666 14.9527 15.9101C15.3425 15.8523 15.6116 15.4905 15.5544 15.1014C15.5406 15.0049 15.2114 12.9409 13.8037 11.2008L15.8309 9.17369C17.5285 11.1339 18.1931 13.3565 18.2002 13.3808C18.3098 13.7622 18.7092 13.9792 19.0821 13.8709C19.4614 13.7628 19.681 13.369 19.5736 12.9904C19.5414 12.8767 18.8017 10.386 16.841 8.16353L17.877 7.12745L21.4107 10.661C21.7546 11.005 22.3356 10.9125 22.554 10.4756C24.0265 7.53072 24.357 4.58655 23.6249 0.929875Z'
										fill='white'
									/>
								</g>
								<defs>
									<clipPath id='clip0_5124_6838'>
										<rect width='24' height='24' fill='white' />
									</clipPath>
								</defs>
							</svg>
							{/* <div
								className={
									isToggled
										? 'header__mobileBurger-btn is-active'
										: 'header__mobileBurger-btn'
								}
							>
								<span className='header__mobileBurger-line'></span>
								<span className='header__mobileBurger-line'></span>
								<span className='header__mobileBurger-line'></span>
							</div> */}
							{isShown && (
								<div className='header__mobileMenu'>
									<a className='header__mobileMenu-links' onClick={leaderBordBtn}>
										Leadboard
										<svg
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<g clip-path='url(#clip0_5127_4053)'>
												<path
													d='M17.4099 3.92878C17.3173 3.64458 17.0715 3.4373 16.7761 3.39441L13.9643 2.98575L12.7064 0.437531C12.5746 0.169687 12.3016 0 12.0026 0C11.7036 0 11.4307 0.169687 11.2988 0.437531L10.0409 2.9858L7.2287 3.39445C6.93324 3.43739 6.68738 3.64462 6.5949 3.92883C6.50242 4.21303 6.57957 4.52508 6.79374 4.73362L8.8291 6.71709L8.34817 9.51759C8.29754 9.81225 8.41871 10.11 8.66049 10.2856C8.90279 10.4619 9.22327 10.4836 9.48751 10.3454L12.0028 9.02311L14.5176 10.3454C14.7879 10.4872 15.1072 10.458 15.3446 10.2856C15.5864 10.11 15.7075 9.8123 15.657 9.51787L15.1765 6.71709L17.2113 4.73362C17.4252 4.52508 17.5019 4.21298 17.4099 3.92878Z'
													fill='white'
												/>
												<path
													d='M15.1404 11.9619H8.85957C8.42598 11.9619 8.07446 12.3134 8.07446 12.747V24.0001H15.9255V12.747C15.9255 12.3134 15.5739 11.9619 15.1404 11.9619Z'
													fill='white'
												/>
												<path
													d='M1.00862 15.1021C0.575026 15.1021 0.223511 15.4536 0.223511 15.8872V23.3791C0.223511 23.722 0.501433 23.9999 0.84423 23.9999H6.50434V15.1021H1.00862Z'
													fill='white'
												/>
												<path
													d='M22.9914 18.2427H17.4957V24.0001H23.1558C23.4987 24.0001 23.7766 23.7222 23.7766 23.3794V19.0278C23.7765 18.5942 23.425 18.2427 22.9914 18.2427Z'
													fill='white'
												/>
											</g>
											<defs>
												<clipPath id='clip0_5127_4053'>
													<rect width='24' height='24' fill='white' />
												</clipPath>
											</defs>
										</svg>
									</a>
									<a
										className='header__mobileMenu-links'
										onClick={inviteFriendsBtn}
										rel='noopener noreferrer'
									>
										Referral
										<svg
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M17.9999 13.9999C17.9469 13.9999 17.8999 14.0139 17.8449 14.0159L14.8169 8.83787C15.3799 8.27987 15.7643 7.5672 15.9215 6.79033C16.0787 6.01345 16.0015 5.20739 15.6998 4.47444C15.3981 3.74149 14.8854 3.11471 14.2269 2.67363C13.5683 2.23255 12.7936 1.99707 12.0009 1.99707C11.2083 1.99707 10.4336 2.23255 9.77502 2.67363C9.11646 3.11471 8.60379 3.74149 8.30208 4.47444C8.00036 5.20739 7.9232 6.01345 8.08039 6.79033C8.23757 7.5672 8.62202 8.27987 9.18494 8.83787L6.16594 14.0169C6.10894 14.0139 6.05694 13.9999 5.99994 13.9999C5.25122 13.9973 4.51679 14.2048 3.88021 14.599C3.24363 14.9931 2.73046 15.5581 2.39908 16.2295C2.0677 16.9009 1.9314 17.6518 2.00571 18.3968C2.08002 19.1419 2.36194 19.8511 2.8194 20.4438C3.27687 21.0365 3.89151 21.4889 4.59339 21.7496C5.29528 22.0103 6.05624 22.0687 6.7897 21.9183C7.52315 21.7678 8.19966 21.4145 8.74226 20.8986C9.28486 20.3827 9.67175 19.7248 9.85894 18.9999H14.1409C14.3291 19.7227 14.7162 20.3784 15.2582 20.8923C15.8003 21.4062 16.4756 21.7578 17.2074 21.9072C17.9393 22.0566 18.6984 21.9977 19.3985 21.7373C20.0986 21.4769 20.7116 21.0255 21.168 20.4342C21.6244 19.8428 21.9058 19.1354 21.9803 18.3922C22.0547 17.6489 21.9193 16.8997 21.5894 16.2296C21.2594 15.5595 20.7482 14.9953 20.1137 14.6012C19.4792 14.207 18.7469 13.9987 17.9999 13.9999ZM14.1409 16.9999H9.85894C9.60499 16.0166 8.98602 15.167 8.12794 14.6239L10.9209 9.83387C11.6242 10.0559 12.3787 10.0559 13.0819 9.83387L15.8819 14.6199C15.0189 15.1617 14.396 16.0133 14.1409 16.9999Z'
												fill='white'
											/>
										</svg>
									</a>
								</div>
							)}
						</button>

						{/* <div className='soundToggler'>
							{isVisible ? (
								<div className='soundToggler__itemOn' onClick={toggleVisibilitySound}>
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
								<div className='soundToggler__itemOff' onClick={toggleVisibilitySound}>
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
					</div>
				</div>
				{isInviteOpen}
			</header>
			{isLeaderboardOpen && (
				<div id='leaderboard' aria-hidden='true' className={popupClasses}>
					<div className='popupLeaderboard__wrapper'>
						<div className='popupLeaderboard__content'>
							<button
								onClick={сloseToggler}
								type='button'
								className='popupLeaderboard__close'
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
							<div className='popupLeaderboard__title'>
								<h4>Leaderboard</h4>
							</div>
							<div className='popupLeaderboard__crownIcon'>
								<svg
									width='39'
									height='30'
									viewBox='0 0 39 30'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M38.4225 8.61694C38.174 8.39826 37.8666 8.25901 37.5394 8.21688C37.2122 8.17474 36.88 8.23161 36.585 8.38028L28.0134 12.6902L20.9292 0.815487C20.7806 0.566685 20.5707 0.360855 20.32 0.21797C20.0692 0.0750856 19.7861 0 19.4981 0C19.2101 0 18.927 0.0750856 18.6763 0.21797C18.4255 0.360855 18.2157 0.566685 18.067 0.815487L10.9828 12.6902L2.41456 8.38195C2.11957 8.23341 1.78756 8.17631 1.46042 8.21787C1.13329 8.25944 0.825693 8.39779 0.576441 8.61547C0.327189 8.83316 0.147451 9.12043 0.0599063 9.44103C-0.0276385 9.76163 -0.0190678 10.1012 0.0845371 10.4169L6.19879 29.3097C6.24484 29.4523 6.32209 29.5826 6.42484 29.691C6.52759 29.7994 6.6532 29.8831 6.79236 29.9359C6.93153 29.9888 7.08069 30.0093 7.22881 29.9961C7.37693 29.9829 7.5202 29.9363 7.64803 29.8597C7.6596 29.8597 8.73207 29.2197 10.7217 28.5964C12.5576 28.0197 15.5668 27.3331 19.4981 27.3331C23.4294 27.3331 26.4386 28.0197 28.2762 28.5964C30.2592 29.2197 31.3383 29.853 31.3465 29.858C31.4743 29.935 31.6176 29.9819 31.7659 29.9954C31.9141 30.0089 32.0634 29.9885 32.2028 29.9359C32.3421 29.8832 32.4679 29.7996 32.5709 29.6912C32.6738 29.5828 32.7513 29.4524 32.7974 29.3097L38.9117 10.4202C39.0183 10.1048 39.0286 9.76434 38.9414 9.44289C38.8542 9.12145 38.6735 8.83374 38.4225 8.61694ZM31.2689 27.5881C29.4511 26.7681 25.419 25.3331 19.4981 25.3331C13.5772 25.3331 9.5451 26.7681 7.72735 27.5881L2.19974 10.5086L10.3548 14.6084C10.7313 14.7956 11.1636 14.8338 11.5667 14.7157C11.9697 14.5976 12.3144 14.3316 12.5328 13.9701L19.4981 2.30378L26.4634 13.9785C26.6818 14.3395 27.0261 14.6052 27.4288 14.7233C27.8315 14.8414 28.2634 14.8034 28.6397 14.6168L36.7965 10.5152L31.2689 27.5881Z'
										fill='#FFF500'
									/>
								</svg>
							</div>
							<div className='popupLeaderboard__playerList'>
								<ul className='popupLeaderboard__table'>
									{leaderboardData.map((player, index) => (
										<li className='popupLeaderboard__tableItem' key={index}>
											<div className='popupLeaderboard__itemData'>
												<div className='popupLeaderboard__id'>
													<span>{player.position}</span>
												</div>
												<div className='popupLeaderboard__playerName'>
													<span>
														{player.wallet_address
															? player.wallet_address.slice(0, 4) +
															  '..' +
															  player.wallet_address.slice(-4)
															: 'anonymous'}
													</span>
												</div>
												<div className='popupLeaderboard__coins'>
													<span>{player.wallet_balance}</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
			{isInviteOpen && (
				<div id='popupInvite' aria-hidden='true' className={popupInvite}>
					<div className='popupInvite__wrapper'>
						<div className='popupInvite__content'>
							<button onClick={сloseToggler} type='button' className='popupInvite__close'>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clip-path='url(#clip0_5127_14281)'>
										<path
											d='M12 0C9.62663 0 7.30655 0.703787 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519945 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693604 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9962 8.81855 22.7308 5.76849 20.4811 3.51886C18.2315 1.26924 15.1814 0.00375324 12 0ZM16.6276 15.0862C16.7318 15.1868 16.8149 15.3072 16.8721 15.4403C16.9293 15.5734 16.9594 15.7165 16.9606 15.8614C16.9619 16.0062 16.9343 16.1499 16.8794 16.2839C16.8246 16.418 16.7436 16.5398 16.6412 16.6422C16.5387 16.7447 16.4169 16.8257 16.2829 16.8805C16.1488 16.9354 16.0051 16.963 15.8603 16.9617C15.7154 16.9605 15.5723 16.9304 15.4392 16.8732C15.3061 16.816 15.1857 16.7329 15.0851 16.6287L12 13.5425L8.91491 16.6287C8.70916 16.8274 8.4336 16.9374 8.14756 16.9349C7.86153 16.9324 7.58792 16.8177 7.38566 16.6154C7.18339 16.4132 7.06866 16.1396 7.06618 15.8535C7.06369 15.5675 7.17365 15.2919 7.37237 15.0862L10.4575 12L7.37237 8.91382C7.26817 8.81318 7.18507 8.69281 7.12789 8.55971C7.07072 8.42662 7.04063 8.28347 7.03937 8.13862C7.03811 7.99377 7.06571 7.85012 7.12056 7.71605C7.17541 7.58198 7.25642 7.46018 7.35884 7.35775C7.46127 7.25532 7.58308 7.17432 7.71714 7.11947C7.85121 7.06461 7.99486 7.03701 8.13971 7.03827C8.28456 7.03953 8.42771 7.06962 8.56081 7.1268C8.6939 7.18397 8.81428 7.26708 8.91491 7.37127L12 10.4575L15.0851 7.37127C15.1857 7.26708 15.3061 7.18397 15.4392 7.1268C15.5723 7.06962 15.7154 7.03953 15.8603 7.03827C16.0051 7.03701 16.1488 7.06461 16.2829 7.11947C16.4169 7.17432 16.5387 7.25532 16.6412 7.35775C16.7436 7.46018 16.8246 7.58198 16.8794 7.71605C16.9343 7.85012 16.9619 7.99377 16.9606 8.13862C16.9594 8.28347 16.9293 8.42662 16.8721 8.55971C16.8149 8.69281 16.7318 8.81318 16.6276 8.91382L13.5425 12L16.6276 15.0862Z'
											fill='white'
											fill-opacity='0.2'
										/>
									</g>
									<defs>
										<clipPath id='clip0_5127_14281'>
											<rect width='24' height='24' fill='white' />
										</clipPath>
									</defs>
								</svg>
							</button>
							<h3>{state?.info.popupInvite__content_title}</h3>
							<div className='popupInvite__header'>
								<h6>How it Works</h6>
								<div className='popupInvite__refInfo'>
									<div className='popupInvite__headerDescr'>
										<p>Your Bonus:</p>
										<div className='popupInvite__headerItem'>
											<p>% 10</p>
										</div>
										<svg
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<g clip-path='url(#clip0_5127_14258)'>
												<path
													d='M16.0492 12.72C14.9692 11.0353 13.1299 10.0293 11.1289 10.0293C9.12796 10.0293 7.28866 11.0353 6.20889 12.72L3.6066 16.7797C3.17483 17.4531 2.97561 18.2313 3.03036 19.0295C3.08511 19.8278 3.38888 20.5712 3.90872 21.1799C4.42892 21.788 5.1163 22.2036 5.89651 22.382C6.67672 22.5603 7.47653 22.4841 8.20932 22.162L8.25839 22.1403C10.1023 21.3459 12.2093 21.3533 14.0484 22.162C14.5228 22.3706 15.0254 22.4761 15.5326 22.4761C15.8084 22.4761 16.0858 22.4448 16.3606 22.3821C17.1408 22.204 17.8282 21.7883 18.3486 21.1801C18.8686 20.572 19.1726 19.8284 19.2275 19.0298C19.2824 18.2313 19.0832 17.4533 18.6515 16.7795L16.0492 12.72Z'
													fill='white'
												/>
												<path
													d='M4.30757 12.7143C5.08174 12.417 5.66988 11.7931 5.96358 10.9576C6.24318 10.1626 6.22029 9.265 5.89894 8.43004C5.57741 7.59563 4.99257 6.91448 4.25209 6.51183C3.47426 6.08904 2.61971 6.02019 1.84682 6.3181C0.29189 6.91594 -0.421672 8.83745 0.256367 10.6024C0.797993 12.0072 2.06124 12.894 3.3384 12.894C3.66451 12.894 3.99153 12.8361 4.30757 12.7143Z'
													fill='white'
												/>
												<path
													d='M9.35699 9.53375C11.3008 9.53375 12.8823 7.73199 12.8823 5.51733C12.8823 3.30212 11.3008 1.5 9.35699 1.5C7.41333 1.5 5.83203 3.30212 5.83203 5.51733C5.83203 7.73199 7.41333 9.53375 9.35699 9.53375Z'
													fill='white'
												/>
												<path
													d='M15.4453 10.5204H15.4455C15.7445 10.6196 16.0495 10.6671 16.3533 10.6671C17.7709 10.6671 19.1524 9.63527 19.6796 8.04958C19.9832 7.1368 19.9632 6.17165 19.6234 5.33211C19.2678 4.4532 18.6088 3.81527 17.7676 3.53566C16.9262 3.25606 16.0164 3.3727 15.2054 3.86379C14.4307 4.3329 13.8371 5.09407 13.5339 6.00685C12.8939 7.93239 13.7514 9.95717 15.4453 10.5204Z'
													fill='white'
												/>
												<path
													d='M22.8693 10.0522L22.8688 10.0516C21.5283 9.06138 19.5235 9.49058 18.3994 11.0089C17.2764 12.5279 17.452 14.5701 18.7905 15.5611C19.2786 15.9227 19.8554 16.0956 20.4458 16.0956C21.4746 16.0956 22.5451 15.5704 23.2606 14.6047C24.3834 13.0857 24.208 11.0435 22.8693 10.0522Z'
													fill='white'
												/>
											</g>
											<defs>
												<clipPath id='clip0_5127_14258'>
													<rect width='24' height='24' fill='white' />
												</clipPath>
											</defs>
										</svg>
									</div>
									{totalReferrals >= 1 && (
										<div className='popupInvite__headerDescr'>
											<p>Referrals:</p>
											<div className='popupInvite__headerItem'>
												<img src={people} alt='people' />
												<p>{totalReferrals}</p>
											</div>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_5127_14258)'>
													<path
														d='M16.0492 12.72C14.9692 11.0353 13.1299 10.0293 11.1289 10.0293C9.12796 10.0293 7.28866 11.0353 6.20889 12.72L3.6066 16.7797C3.17483 17.4531 2.97561 18.2313 3.03036 19.0295C3.08511 19.8278 3.38888 20.5712 3.90872 21.1799C4.42892 21.788 5.1163 22.2036 5.89651 22.382C6.67672 22.5603 7.47653 22.4841 8.20932 22.162L8.25839 22.1403C10.1023 21.3459 12.2093 21.3533 14.0484 22.162C14.5228 22.3706 15.0254 22.4761 15.5326 22.4761C15.8084 22.4761 16.0858 22.4448 16.3606 22.3821C17.1408 22.204 17.8282 21.7883 18.3486 21.1801C18.8686 20.572 19.1726 19.8284 19.2275 19.0298C19.2824 18.2313 19.0832 17.4533 18.6515 16.7795L16.0492 12.72Z'
														fill='white'
													/>
													<path
														d='M4.30757 12.7143C5.08174 12.417 5.66988 11.7931 5.96358 10.9576C6.24318 10.1626 6.22029 9.265 5.89894 8.43004C5.57741 7.59563 4.99257 6.91448 4.25209 6.51183C3.47426 6.08904 2.61971 6.02019 1.84682 6.3181C0.29189 6.91594 -0.421672 8.83745 0.256367 10.6024C0.797993 12.0072 2.06124 12.894 3.3384 12.894C3.66451 12.894 3.99153 12.8361 4.30757 12.7143Z'
														fill='white'
													/>
													<path
														d='M9.35699 9.53375C11.3008 9.53375 12.8823 7.73199 12.8823 5.51733C12.8823 3.30212 11.3008 1.5 9.35699 1.5C7.41333 1.5 5.83203 3.30212 5.83203 5.51733C5.83203 7.73199 7.41333 9.53375 9.35699 9.53375Z'
														fill='white'
													/>
													<path
														d='M15.4453 10.5204H15.4455C15.7445 10.6196 16.0495 10.6671 16.3533 10.6671C17.7709 10.6671 19.1524 9.63527 19.6796 8.04958C19.9832 7.1368 19.9632 6.17165 19.6234 5.33211C19.2678 4.4532 18.6088 3.81527 17.7676 3.53566C16.9262 3.25606 16.0164 3.3727 15.2054 3.86379C14.4307 4.3329 13.8371 5.09407 13.5339 6.00685C12.8939 7.93239 13.7514 9.95717 15.4453 10.5204Z'
														fill='white'
													/>
													<path
														d='M22.8693 10.0522L22.8688 10.0516C21.5283 9.06138 19.5235 9.49058 18.3994 11.0089C17.2764 12.5279 17.452 14.5701 18.7905 15.5611C19.2786 15.9227 19.8554 16.0956 20.4458 16.0956C21.4746 16.0956 22.5451 15.5704 23.2606 14.6047C24.3834 13.0857 24.208 11.0435 22.8693 10.0522Z'
														fill='white'
													/>
												</g>
												<defs>
													<clipPath id='clip0_5127_14258'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										</div>
									)}
								</div>
							</div>
							<div className='popupInvite__grid'>
								<div className='popupInvite__gridItem'>
									<ul className='popupInvite__list'>
										<li className='popupInvite__list-item'>
											<img src={link} alt='' className='popupInvite__icon' />
											<div className='popupInvite__list-itemDescr'>
												<h5>Invite</h5>
												<p>Friends via the referral link</p>
												<svg
													width='24'
													height='24'
													viewBox='0 0 24 24'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M17.9998 13.9999C17.9468 13.9999 17.8998 14.0139 17.8448 14.0159L14.8168 8.83787C15.3797 8.27987 15.7642 7.5672 15.9214 6.79033C16.0786 6.01345 16.0014 5.20739 15.6997 4.47444C15.398 3.74149 14.8853 3.11471 14.2267 2.67363C13.5682 2.23255 12.7934 1.99707 12.0008 1.99707C11.2082 1.99707 10.4334 2.23255 9.77489 2.67363C9.11634 3.11471 8.60367 3.74149 8.30195 4.47444C8.00024 5.20739 7.92308 6.01345 8.08027 6.79033C8.23745 7.5672 8.6219 8.27987 9.18482 8.83787L6.16582 14.0169C6.10882 14.0139 6.05682 13.9999 5.99982 13.9999C5.2511 13.9973 4.51667 14.2048 3.88009 14.599C3.24351 14.9931 2.73034 15.5581 2.39896 16.2295C2.06757 16.9009 1.93128 17.6518 2.00559 18.3968C2.0799 19.1419 2.36182 19.8511 2.81928 20.4438C3.27675 21.0365 3.89138 21.4889 4.59327 21.7496C5.29516 22.0103 6.05612 22.0687 6.78958 21.9183C7.52303 21.7678 8.19954 21.4145 8.74214 20.8986C9.28473 20.3827 9.67163 19.7248 9.85882 18.9999H14.1408C14.329 19.7227 14.716 20.3784 15.2581 20.8923C15.8001 21.4062 16.4754 21.7578 17.2073 21.9072C17.9392 22.0566 18.6982 21.9977 19.3983 21.7373C20.0984 21.4769 20.7115 21.0255 21.1679 20.4342C21.6242 19.8428 21.9056 19.1354 21.9801 18.3922C22.0546 17.6489 21.9192 16.8997 21.5893 16.2296C21.2593 15.5595 20.7481 14.9953 20.1136 14.6012C19.4791 14.207 18.7468 13.9987 17.9998 13.9999ZM14.1408 16.9999H9.85882C9.60487 16.0166 8.9859 15.167 8.12782 14.6239L10.9208 9.83387C11.624 10.0559 12.3786 10.0559 13.0818 9.83387L15.8818 14.6199C15.0188 15.1617 14.3959 16.0133 14.1408 16.9999Z'
														fill='white'
													/>
												</svg>
											</div>
										</li>
										<li className='popupInvite__list-item'>
											<img src={money} alt='' className='popupInvite__icon' />
											<div className='popupInvite__list-itemDescr'>
												<h5>Get rewards</h5>
												<p>Receive 10% of your friends’ staking</p>
												<svg
													width='24'
													height='24'
													viewBox='0 0 24 24'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M17.6637 7.17871L13.1909 21.3426L24.0002 7.17871H17.6637Z'
														fill='white'
													/>
													<path
														d='M3.48456 2.16895L0.0507812 6.28949H5.88822L3.48456 2.16895Z'
														fill='white'
													/>
													<path
														d='M20.5155 2.16895L18.1118 6.28949H23.9493L20.5155 2.16895Z'
														fill='white'
													/>
													<path
														d='M6.33647 7.17871H0L10.8093 21.3426L6.33647 7.17871Z'
														fill='white'
													/>
													<path
														d='M13.0737 1.84082L17.2441 6.0112L19.6766 1.84082H13.0737Z'
														fill='white'
													/>
													<path
														d='M4.32324 1.84082L6.75577 6.0112L10.9261 1.84082H4.32324Z'
														fill='white'
													/>
													<path
														d='M7.26904 7.17871L11.9999 22.1588L16.7307 7.17871H7.26904Z'
														fill='white'
													/>
													<path
														d='M12.0001 2.02539L7.73633 6.28914H16.2638L12.0001 2.02539Z'
														fill='white'
													/>
												</svg>
											</div>
										</li>
									</ul>
								</div>
							</div>
							<div className='inviteLinkBtn'>
								<button onClick={inviteLink}>Invite</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
