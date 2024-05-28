import React, { useEffect, useState } from 'react';
import star from '../../img/Star.svg';
import cat from '../../img/cat2.png';
import './Preloader.scss';

const ProgressBar = ({ progress, rotate }) => {
	const radius = 130; // Radius of the circle
	const strokeWidth = 2; // Width of the stroke
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;

	// Calculate the strokeDashoffset based on the progress and offset
	const strokeDashoffset = circumference - (progress / 60) * circumference;

	return (
		<svg
			height={radius * 2}
			width={radius * 2}
			className={`progress-bar ${rotate ? 'rotate' : ''}`}
		>
			<circle
				className='progress-bar-background'
				stroke='#ffffff'
				opacity={0.5}
				fill='transparent'
				strokeWidth={strokeWidth}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
			<circle
				className='progress-bar-progress'
				stroke='#ffffff'
				fill='transparent'
				strokeWidth={strokeWidth}
				strokeDasharray={circumference + ' ' + circumference}
				style={{ strokeDashoffset }}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
		</svg>
	);
};

const Preloader = ({ loaded }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prevProgress) => (prevProgress === 0 ? 100 : prevProgress + 1));
		}, 35);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<>
			<div className={`preloader${loaded ? ' loaded' : ''}`}>
				<div
					className='orangeEllipse'
					style={{
						zIndex: '100',
					}}
				>
					<svg
						width='390'
						height='754'
						viewBox='0 0 655 754'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g opacity='0.3' filter='url(#filter0_f_5127_4548)'>
							<circle
								cx='-29.3449'
								cy='684.466'
								r='384.234'
								transform='rotate(60 -29.3449 684.466)'
								fill='url(#paint0_linear_5127_4548)'
							/>
						</g>
						<defs>
							<filter
								id='filter0_f_5127_4548'
								x='-713.643'
								y='0.16748'
								width='1368.6'
								height='1368.6'
								filterUnits='userSpaceOnUse'
								color-interpolation-filters='sRGB'
							>
								<feFlood flood-opacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feGaussianBlur
									stdDeviation='150'
									result='effect1_foregroundBlur_5127_4548'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_5127_4548'
								x1='-334.146'
								y1='353.187'
								x2='202.181'
								y2='1068.7'
								gradientUnits='userSpaceOnUse'
							>
								<stop stop-color='#FFD600' />
								<stop offset='1' stop-color='#FF004D' stop-opacity='0.2' />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<div
					className='violettEllipse'
					style={{
						zIndex: '100',
					}}
				>
					<svg
						width='329'
						height='452'
						viewBox='0 0 329 452'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g filter='url(#filter0_f_5127_4227)'>
							<circle cx='344' cy='344' r='195' fill='url(#paint0_linear_5127_4227)' />
						</g>
						<defs>
							<filter
								id='filter0_f_5127_4227'
								x='0'
								y='0'
								width='688'
								height='688'
								filterUnits='userSpaceOnUse'
								color-interpolation-filters='sRGB'
							>
								<feFlood flood-opacity='0' result='BackgroundImageFix' />
								<feBlend
									mode='normal'
									in='SourceGraphic'
									in2='BackgroundImageFix'
									result='shape'
								/>
								<feGaussianBlur
									stdDeviation='74.5'
									result='effect1_foregroundBlur_5127_4227'
								/>
							</filter>
							<linearGradient
								id='paint0_linear_5127_4227'
								x1='-21.7531'
								y1='13.4221'
								x2='364.597'
								y2='583.901'
								gradientUnits='userSpaceOnUse'
							>
								<stop stop-color='#FF00A8' stop-opacity='0' />
								<stop offset='0.9999' stop-color='#2723FE' />
								<stop offset='1' stop-color='#23A7FE' />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<div
					className='progress-container'
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center', // Center horizontally
						height: '100vh', // Full viewport height
					}}
				>
					<div
						style={{
							width: '205px',
							height: '205px',
							position: 'absolute',
							borderRadius: '100%',
							background:
								'radial-gradient(184.14% 50.12% at 50% 50%, rgb(28, 175, 238) 18.268051743507385%, rgb(63, 219, 60) 100%)',
						}}
					>
						<img
							className='cat-image'
							src={cat}
							alt='Tim The Cat'
							style={{
								position: 'absolute',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								bottom: '30px',
								left: '3px',
								paddingBottom: '15px',
							}}
						/>
					</div>
					<ProgressBar progress={progress} rotate={progress === 100} />
				</div>
				<div className='mainContent__animation'>
					<div className='mainContent__coinOne'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinTwo'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinThree'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinFour'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinFive'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinSix'>
						<img src={star} alt='' />
					</div>
					<div className='mainContent__coinSeven'>
						<img src={star} alt='' />
					</div>
				</div>
			</div>
		</>
	);
};

export default Preloader;
