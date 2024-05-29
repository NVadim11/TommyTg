import React from 'react';
import star from '../img/Star.svg';
import orangeEllipse from '../img/orangeEllipse.webp';
import scullGlow from '../img/scullGlow.png';
import violetEllipse from '../img/violetEllipse.webp';

const Maintenance = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				position: 'absolute',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				flexDirection: 'column',
				justifyContent: 'center',
				background: 'linear-gradient(180deg, #0b1f46 0%, #000 100%)',
			}}
		>
			<div
				className='scullGlow'
				style={{
					position: 'relative',
					boxSizing: 'border-box',
					overflow: 'hidden',
				}}
			>
				<img src={scullGlow} alt='glow' />
			</div>
			<h1
				style={{
					position: 'absolute',
					width: 'fit-content',
					marginTop: '0',
					fontWeight: '900',
					fontSize: '64px',
					lineHeight: '100%',
					textAlign: 'center',
					zIndex: '1000',
				}}
			>
				Coming Soon
			</h1>
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

			<div
				className='orangeEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<img src={orangeEllipse} alt='orangeEllipse' />
			</div>
			<div
				className='violettEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<img src={violetEllipse} alt='violetEllipse' />
			</div>
		</div>
	);
};

export default Maintenance;
