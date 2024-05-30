import React, { useEffect, useState } from 'react';
import star from '../../img/Star.svg';
import cat from '../../img/catFace.png';
import orangeEllipse from '../../img/orangeEllipse.webp';
import skullGlow from '../../img/skullGlow.png';
import violetEllipse from '../../img/violetEllipse.webp';
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
					className='skullGlow'
					style={{
						display: 'flex',
						position: 'absolute',
						boxSizing: 'border-box',
						overflow: 'hidden',
						width: '555px',
						zIndex: '1000',
						justifyContent: 'center',
					}}
				>
					<img
						src={skullGlow}
						alt='glow'
						style={{
							width: '100%',
						}}
					/>
				</div>
				<div
					className='orangeEllipse'
					style={{
						zIndex: '100',
					}}
				>
					<img src={orangeEllipse} alt='orangeEllipse' />
				</div>
				<div
					className='violetEllipse'
					style={{
						zIndex: '100',
					}}
				>
					<img src={violetEllipse} alt='violetEllipse' />
				</div>
				<div
					className='progress-container'
					style={{
						zIndex: '1000',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center', // Center horizontally
						height: '100vh', // Full viewport height
					}}
				>
					<div
						style={{
							zIndex: '1000',
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
								zIndex: '1000',
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
				<div
					className='mainContent__animation'
					style={{
						zIndex: '1000',
					}}
				>
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
