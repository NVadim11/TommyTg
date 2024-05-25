import React, { useEffect, useState } from 'react';
import cat from '../../img/cat2.png';
import './Preloader.scss';

const ProgressBar = ({ progress, rotate }) => {
	const radius = 150; // Radius of the circle
	const strokeWidth = 5; // Width of the stroke
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;

	// Calculate the strokeDashoffset based on the progress and offset
	const strokeDashoffset = circumference - (progress / 50) * circumference;

	return (
		<svg
			height={radius * 2}
			width={radius * 2}
			className={`progress-bar ${rotate ? 'rotate' : ''}`}
		>
			<circle
				className='progress-bar-background'
				stroke='#c09aff'
				fill='transparent'
				strokeWidth={strokeWidth}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
			<circle
				className='progress-bar-progress'
				stroke='#691ee2'
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
		<div className={`preloader${loaded ? ' loaded' : ''}`}>
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
				<h4
					style={{
						position: 'absolute',
						top: '37%', // Adding a small margin for spacing
					}}
				>
					Loading . . .
				</h4>
				<img
					className='cat-image'
					src={cat}
					alt='Tim The Cat'
					style={{
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						paddingBottom: '20px',
					}}
				/>
				<ProgressBar progress={progress} rotate={progress === 100} />
			</div>
		</div>
	);
};

export default Preloader;
